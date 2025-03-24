### InfluxDB 3 Core and Enterprise API examples

```bash
curl "http://localhost:9191/api/v3/configure/processing_engine_trigger" \
--json '{
   "db": "sensors",
   "plugin_filename": "sensors_sched.py",
   "trigger_name": "sensors_sched_1",
   "trigger_settings": { "run_async": false, "error_behavior": "log" },
   "trigger_specification": {"every": {"duration": {"secs": 10, "nanos": 0}}},
   "disabled": false
 }'


curl "http://localhost:9191/api/v3/configure/processing_engine_trigger" \
--json '{
  "db": "sensors",
   "plugin_filename": "sensors_sched.py",
   "trigger_name": "sensors_sched_3",
   "trigger_settings": { "run_async": false, "error_behavior": "log" },
   "trigger_specification": {"schedule": ["0 0 * * *"]},
   "disabled": false
 }'

curl "http://localhost:9191/api/v3/configure/processing_engine_trigger" \
--json '{
  "db": "sensors",
  "plugin_filename": "sensors_sched.py",
  "trigger_name": "sensors_sched_3",
  "trigger_settings": { "run_async": false, "error_behavior": "log" },
  "trigger_specification": {"schedule": "cron:0 0 * * *"},
  "disabled": false
}'

curl "http://localhost:9191/api/v3/configure/processing_engine_trigger" \
--json ' {
  "db": "sensors",
  "plugin_filename": "sensors_sched.py",
  "trigger_name": "sensors_sched_3",
  "trigger_settings": { "run_async": false, "error_behavior": "log" },
  "trigger_specification": "cron:0 0 * * *",
  "disabled": false
}'

influxdb3 create trigger --host http://localhost:9191 --database sensors --trigger-spec "every:10s" --plugin-filename "sensors_sched.py" sensors_sched_2

influxdb3 write --host http://localhost:9191 --database sensors "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1742198400
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1742198400
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1742202000
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1742202000
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1742205600
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1742205600
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1742209200
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1742209200
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1742212800
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1742212800
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1742216400
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1742216400"
```

## Use the processing engine to retrieve and write pull request data from GitHub

1. Install [InfluxDB 3 Core](/influxdb3/core/) or [InfluxDB 3 Enterprise](/influxdb3/enterprise/) for your system.
2. _Optional_: install additional tools that might help test and explore API requests:
   - cURL
   - jq 

3. Start the server with the following command:
```bash
# Start the server with the specified node ID, mode, cluster ID, host, database, and plugin directory
# The --mode flag specifies the server mode (ingest, query, compact, or all)
# The --cluster-id flag specifies the cluster ID
# The --host flag specifies the host URL
# The --plugin-dir flag specifies the directory where the plugins are located and activates the processing engine
# The --node-id flag specifies the node ID
influxdb3 serve --node-id rw01 --mode ingest,query --cluster-id docsaichat --http-bind localhost:9191 --plugin-dir ~/influxdb3-plugins/aichat --object-store file --data-dir ~/.influxdb3-data --log-filter debug
```

4. If you haven't already, create a database to store the data:

   ```bash
   influxdb3 create database --host http://localhost:9191 aichat
   ```

   > [!Important]
   >
   > If you try to create a trigger before the database is created, the server
   > response is HTTP status `404` with the error message `requested resource not found`.

### Create a plugin

With the processing engine enabled, get started with a sample plugin.

#### Example plugin: GitHub pull request scheduler

The following sample Python plugin for the InfluxDB 3 Processing engine retrieves GitHub pull request merge data and writes it to your database.

Save this as `github_pr_req.py` in your plugin directory--for example: `~/influxdb3-plugins/github_pr_req.py`:

  ```python
  import requests
  import json
  from datetime import datetime, timedelta
  
  def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
      """
      Request plugin that retrieves merged PR data from the GitHub API
      and writes it to the database using line protocol.
      
      This plugin creates an HTTP endpoint that accepts parameters via query string or JSON body
      and returns the processed PR data while also writing it to the database.
      
      Args:
          influxdb3_local: Local InfluxDB API client
          query_parameters: Dictionary of query parameters from the URL
          request_headers: Dictionary of HTTP request headers
          request_body: Request body as a string
          args: Optional arguments passed from the trigger configuration
      
      Returns:
          Dictionary containing response data (automatically converted to JSON)
      """
      # Parse request body if provided
      request_data = {}
      if request_body:
          try:
              request_data = json.loads(request_body)
          except json.JSONDecodeError:
              influxdb3_local.warn("Invalid JSON in request body")
      
      # Get repository from request parameters or use default
      repo = request_data.get("repo") or query_parameters.get("repo") or "influxdata/docs-v2"
      
      # Set up GitHub API request
      headers = {
          "Accept": "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28"
      }
      
      # Add authentication if available from request or trigger args
      github_token = (
          request_data.get("github_token") or 
          query_parameters.get("github_token") or 
          (args and args.get("github_token"))
      )
      
      if github_token:
          headers["Authorization"] = f"token {github_token}"
      
      # Determine time period from parameters or default to one day
      time_period = (
          request_data.get("time_period") or 
          query_parameters.get("time_period") or 
          (args and args.get("time_period")) or 
          "day"
      )
      
      if time_period == "day":
          days = 1
      elif time_period == "week":
          days = 7
      else:
          days = 1
      
      # Calculate time range for data collection
      since = datetime.utcnow() - timedelta(days=days)
      since_iso = since.strftime("%Y-%m-%dT%H:%M:%SZ")
      
      # Log start of data collection
      influxdb3_local.info(f"Collecting PR merge data for {repo} (master branch) since {since_iso}")
      
      try:
          # Make API request to get merged pull requests
          url = f"https://api.github.com/repos/{repo}/pulls"
          params = {
              "state": "closed",    # Get closed PRs
              "sort": "updated",    # Sort by most recently updated
              "direction": "desc",  # Newest first
              "per_page": 100       # Maximum per page
          }
          response = requests.get(url, headers=headers, params=params)
          
          # Check for API errors
          if response.status_code != 200:
              error_msg = f"GitHub API error: {response.status_code} - {response.text}"
              influxdb3_local.error(error_msg)
              return {"status": "error", "message": error_msg}
          
          # Process PRs to find merged ones on master branch
          pulls = response.json()
          pr_merges_count = 0
          pr_merges = []
          
          for pr in pulls:
              # Skip PRs that haven't been merged
              if not pr.get("merged_at"):
                  continue
                  
              # Skip PRs not merged to master branch
              if pr.get("base", {}).get("ref") != "master":
                  continue
                  
              # Check if merge is within our time window
              merged_at = pr["merged_at"]
              merged_time = datetime.strptime(merged_at, "%Y-%m-%dT%H:%M:%SZ")
              
              # Skip older PRs
              if merged_time < since:
                  continue
                  
              # Convert timestamp to nanoseconds
              timestamp_ns = int(merged_time.timestamp() * 1_000_000_000)
              
              # Extract PR data
              author = pr["user"]["login"]
              pr_number = pr["number"]
              
              # Get detailed PR information to access line counts
              detail_url = pr["url"]
              detail_response = requests.get(detail_url, headers=headers)
              
              if detail_response.status_code != 200:
                  influxdb3_local.warn(f"Couldn't get PR details for #{pr_number}")
                  lines = 0
              else:
                  pr_detail = detail_response.json()
                  lines = pr_detail.get("additions", 0) + pr_detail.get("deletions", 0)
              
              # Store PR data for response
              pr_data = {
                  "number": pr_number,
                  "title": pr["title"],
                  "author": author,
                  "merged_at": merged_at,
                  "lines": lines
              }
              pr_merges.append(pr_data)
              
              # Create line protocol entry using LineBuilder
              line = LineBuilder("gh")
              line.tag("repo", repo)
              line.tag("ref", "master")
              line.string_field("activity_type", "pr_merge")
              line.int64_field("lines", lines)
              line.string_field("author", author)
              line.time_ns(timestamp_ns)
              
              # Write to database
              influxdb3_local.write(line)
              pr_merges_count += 1
          
          # Log summary
          if pr_merges_count > 0:
              success_msg = f"Wrote {pr_merges_count} PR merge events to database"
              influxdb3_local.info(success_msg)
          else:
              success_msg = f"No PR merge events found for master branch in the specified time period"
              influxdb3_local.info(success_msg)
          
          # Return success response with PR data
          return {
              "status": "success",
              "message": success_msg,
              "repository": repo,
              "time_period": time_period,
              "since": since_iso,
              "pr_count": pr_merges_count,
              "pull_requests": pr_merges
          }
              
      except Exception as e:
          error_msg = f"Error collecting GitHub data: {str(e)}"
          influxdb3_local.error(error_msg)
          return {"status": "error", "message": error_msg}
  ```

While you could use a _schedule_ plugin for the code, using a _request_ plugin
gives additional flexibility for running and testing the plugin on-demand.

In later steps, you'll create the `path` trigger to run this endpoint on-demand,
and create a separate plugin and trigger to schedule running the endpoint.

When you the plugin runs, it writes data in the following format:

```text
gh,repo="influxdata/docs-v2",ref="master" activity_type="pr_merge",lines=25,author="jstirnaman" 1742198400
```

And it returns a JSON response similar to the following:

```json
{
  "status": "success",
  "message": "Wrote 2 PR merge events to database",
  "repository": "influxdata/docs-v2",
  "time_period": "week",
  "since": "2023-10-01T00:00:00Z",
  "pr_count": 2,
  "pull_requests": [
    {
      "number": 1234,
      "title": "Fix typo in README",
      "author": "jstirnaman",
      "merged_at": "2023-10-01T12:34:56Z",
      "lines": 25
    },
    {
      "number": 5678,
      "title": "Add new feature",
      "author": "jdoe",
      "merged_at": "2023-10-02T14:56:78Z",
      "lines": 50
    }
  ]
}
````

2. Install Python dependencies for your plugin:

   ```bash
   influxdb3 install package
   ```

> [!Note]
> #### Test your plugin
>
> Use one of the following approaches to test that your plugin is available and valid:
> 
> - `process_request` plugin: Create a `request` trigger for your API endpoint and test it using your favorite HTTP client.
> - `process_writes` or `process_schedule_call` plugin: Use the [`influxdb3 test`](/influxdb3/version/reference/cli/influxdb3/test/) command. 

#### Use the plugin

1. To use the request plugin, create a trigger to publish an API endpoint for the plugin:
   
   ```bash
   influxdb3 create trigger \
     --host http://localhost:9191 \
     --database aichat \
     --trigger-spec "request:github_prs" \
     --plugin-filename "github_pr_req.py" \
     --trigger-arguments github_token=your_github_token \
     github_pr_endpoint
  ```

  Replace the following:

  - `your_github_token`: an authorization token. If the repository activity is _public_, you don't need to provide a token.


## Schedule the pull request operation

Use the processing engine to schedule a trigger to get GitHub pull request data every 1 hour and write it to the database.

1. To use the plugin, create a trigger to run the plugin every hour--for example, to collect pull request data from the last week:
```bash
influxdb3 create trigger \
  --host http://localhost:9191 \
  --database aichat \
  --trigger-spec "every:1h" \
  --plugin-filename "github_pr_sched.py" \
  --trigger-arguments github_token=your_github_token,time_period=week \
  gh_pr_monitor
```

In your trigger arguments, replace the following:

`your_github_token`: your actual GitHub token
`time_period`: set to "day" or "week" to specify the time range for data collection.

The processing engine writes the following data in line protocol format to the `gh` database:
- GitHub pull request data
- Measurement: "aichat"
```text
"gh,repo="influxdata/docs-v2",ref="master" activity_type="pr_merge",lines=25,author="jstirnaman" 1742198400"
```

##### Troubleshoot triggers

###### Error: Failed to create trigger

```console
gh_pr_monitor
Failed to create trigger: server responded with error [404 Not Found]: the requested resource was not found
Create command failed: server responded with error [404 Not Found]: the requested resource was not found
```

Possible causes:

- The database doesn't exist. If this is the case, the log contains the following debug message:

  ```log
  DEBUG influxdb3_server::http: API error error=Catalog(NotFound)
  ```

  Create the database or check the database name in the `create trigger` command.

4. Query the pull request data from the database:
```bash
influxdb3 query --host http://localhost:9191 --database aichat "select * from home where time > 1742198400 and time < 1742216400" --format jsonl
```