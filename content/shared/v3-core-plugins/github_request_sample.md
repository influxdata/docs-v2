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
2. _Optional_: install additional tools that might help you test and explore HTTP API requests:
   - cURL
   - jq 

3. Start the server with the processing engine activated.
   The `--plugin-dir <PYTHON_PLUGINS_DIRECTORY>` specifies the location
   of your plugin files and stores the `.venv` Python virtual environment for the processing engine.

   ```bash
   # If using InfluxDB 3 Enterprise:
   # Start the server with the specified node ID, mode, cluster ID, host, database, and plugin directory
   # The --mode flag specifies the server mode (ingest, query, compact, or all)
   # The --cluster-id flag specifies the cluster ID
   # The --http-bind flag specifies the host URL where your server listens for HTTP requests
   # The --plugin-dir flag specifies the directory where the plugins are located and activates the processing engine
   # The --node-id flag specifies the node ID
   # The --object-store flag specifies the object store type
   # The --data-dir flag specifies the data directory
   # Optional: The --log-filter flag specifies the log level
   influxdb3 serve --node-id rw01 --mode ingest,query --cluster-id docsaichat --http-bind localhost:9191 --plugin-dir ~/influxdb3-plugins/aichat --object-store file --data-dir ~/.influxdb3-data --log-filter debug
   ```

   ```bash
   # If using InfluxDB 3 Core:
   # The --node-id flag specifies the node ID
   # The --http-bind flag specifies the host URL where your server listens for HTTP requests
   # The --plugin-dir flag specifies the directory where the plugins are located and activates the processing engine
   # The --object-store flag specifies the object store type
   # The --data-dir flag specifies the data directory
   # Optional: The --log-filter flag specifies the log level
   influxdb3 serve --node-id rw01  --http-bind localhost:9191 --plugin-dir ~/Documents/github/influxdb3-plugins --object-store file --data-dir ~/.influxdb3-data --log-filter debug
   ```

   When the server starts, it creates the `.venv` directory with `python` and `pip` installed.

   ```bash
4. If you haven't already, create a database to store the data:

   ```bash
   influxdb3 create database --host http://localhost:9191 aichat
   ```

   > [!Important]
   >
   > If you try to create a trigger before the database is created, the server
   > response is HTTP status `404` with the error message `requested resource not found`.

### Create a plugin

With the processing engine enabled, create plugins and triggers.

#### Example: create a request plugin

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

In later steps, you'll create the `request` trigger to run this endpoint on-demand,
and create a separate plugin and trigger to schedule running the endpoint.

2. Install Python dependencies for your plugin:

   ```bash
   influxdb3 install package requests
   ```

> [!Note]
> #### Test your plugin
>
> Use one of the following approaches to test that your plugin is available and valid:
> 
> - `process_request` plugin: Create a `request` trigger for your API endpoint and test it using your favorite HTTP client.
> - `process_writes` or `process_schedule_call` plugin: Use the [`influxdb3 test`](/influxdb3/version/reference/cli/influxdb3/test/) command. 

#### Create a request trigger for a request plugin

1. Create a trigger to publish an API endpoint for the request plugin:
   
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

2. To run the plugin, send an HTTP request to the endpoint--for example:

    ```bash
    curl -X POST "http://localhost:9191/api/v3/engine/github_prs" \
      -H "Content-Type: application/json" \
      -d '{"repo": "influxdata/docs-v2", "time_period": "week"}'
    ```
    
    The plugin writes the following data in line protocol format to the `gh` database:
    - GitHub pull request data
    - Measurement: "aichat"
    
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
   ```
   
3. Query the pull request data from the database:
   
   ```bash
   influxdb3 query --host http://localhost:9191 --database aichat "select * from gh where time > 1742198400 and time < 1742216400" --format jsonl
   ```

## Example: create a scheduled call plugin 

Create a plugin and schedule a trigger to call the `github_prs` endpoint
every 1 hour and write it to the database.

1. Save the following code as `github_pr_sched.py` in your plugin directory--for example: `~/influxdb3-plugins/github_pr_sched.py`:

   ```python
   def process_schedule_call()
       """
       Schedule plugin that runs the GitHub PR request plugin every hour.
       
       This plugin schedules a call to the GitHub PR request plugin every hour
       to collect PR merge data for the last week.
       
       Args:
           influxdb3_local: Local InfluxDB API client
           args: Optional arguments passed from the trigger configuration
           
       Returns:
           Dictionary containing response data (automatically converted to JSON)
       """
       # Get trigger arguments
       github_token = args.get("github_token")
       time_period = args.get("time_period") or "week"
       
       # Log start of scheduled call
       influxdb3_local.info(f"Scheduling PR merge data collection for the last {time_period}")
       
       # Call the request plugin with the specified parameters
       response = influxdb3_local.call_plugin("github_pr_req.py", github_token=github_token, time_period=time_period)
       
       # Log response
       if response.get("status") == "success":
           success_msg = f"Successfully scheduled PR merge data collection: {response['message']}"
           influxdb3_local.info(success_msg)
       else:
           error_msg = f"Error scheduling PR merge data collection: {response['message']}"
           influxdb3_local.error(error_msg)
       
       return response
   ```

### Create a trigger for the GitHub PR scheduled call plugin

To schedule the plugin, create a trigger to run the plugin every hour--for example,
to collect pull request data from the last week:

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

## Example: create a request plugin to fetch Kapa.ai data

Create a request plugin that retrieves the last `ingested_at` timestamps for [sources from the Kapa.ai API](https://docs.kapa.ai/api#tag/Sources) and writes them to the database.

1. Save the following code as `kapa_ai_req.py` in your plugin directory--for example: `~/influxdb3-plugins/kapa_ai_req.py`:

```python
import requests
import json
from datetime import datetime, timedelta, timezone

def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
    """
    Request plugin that retrieves Kapa.ai source data and writes it to the database using line protocol.
    
    This plugin creates an HTTP endpoint that accepts parameters via query string or JSON body
    and returns the processed Kapa.ai data while also writing it to the database.
    
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
    
    # Get project_id from request parameters or return error if not provided
    project_id = request_data.get("project_id") or query_parameters.get("project_id")
    if not project_id:
        error_msg = "Missing required parameter: project_id"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
    
    # Get integration_id from request parameters or return error if not provided
    integration_id = request_data.get("integration_id") or query_parameters.get("integration_id")
    if not integration_id:
        error_msg = "Missing required parameter: integration_id"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
    
    # Get Kapa API token from request or trigger args
    kapa_token = (
        request_data.get("kapa_token") or 
        query_parameters.get("kapa_token") or 
        (args and args.get("kapa_token"))
    )
    
    if not kapa_token:
        error_msg = "Missing required parameter: kapa_token"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
    
    # Set up Kapa.ai API request headers with authentication
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": kapa_token
    }

    # Set up Kapa.ai request data
    payload = {
        "integration_id": integration_id
    }
    
    try:
        # Make API request to get sources for the project
        url = f"https://api.kapa.ai/ingestion/v1/projects/{project_id}/sources/"
        influxdb3_local.info(f"Requesting data from: {url}")
        
        # For GET requests, parameters should be in query string not body
        response = requests.get(url, headers=headers)
        
        # Check for API errors
        if response.status_code != 200:
            error_msg = f"Kapa API error: {response.status_code} - {response.text}"
            influxdb3_local.error(error_msg)
            return {"status": "error", "message": error_msg}
        
        # Parse response data
        data = response.json()
        sources = data.get("results", [])
        
        influxdb3_local.info(f"Retrieved {len(sources)} sources from Kapa.ai")
        
        # Process and write each source to the database
        sources_data = []
        for source in sources:
            source_id = source.get("id")
            source_name = source.get("name", "")
            source_type = source.get("type", "")
            
            # Process ingested_at timestamp
            ingested_at = source.get("ingested_at")
            if ingested_at:
                try:
                    # Parse ISO format timestamp with timezone
                    dt = datetime.fromisoformat(ingested_at.replace("Z", "+00:00"))
                    timestamp_ns = int(dt.timestamp() * 1_000_000_000)
                    
                    # Write ingested_at data point using the actual timestamp
                    line = LineBuilder("kapa_source")
                    line.tag("project_id", project_id)
                    line.tag("source_id", source_id)
                    line.tag("source_name", source_name)
                    line.tag("source_type", source_type)
                    line.tag("event_type", "ingestion")
                    
                    # Add fields with the timestamp components
                    line.int64_field("timestamp_unix", int(dt.timestamp()))
                    line.string_field("timezone", dt.tzinfo.tzname(dt))
                    line.int64_field("occurred", 1)  # Required field
                    
                    # Set the timestamp for the data point
                    line.time_ns(timestamp_ns)
                    
                    influxdb3_local.write(line)
                    
                except Exception as e:
                    influxdb3_local.warn(f"Error processing ingested_at for source {source_id}: {str(e)}")
            
            # Process next_run_at timestamp
            next_run_at = source.get("next_run_at")
            if next_run_at:
                try:
                    # Parse ISO format timestamp with timezone
                    dt = datetime.fromisoformat(next_run_at.replace("Z", "+00:00"))
                    timestamp_ns = int(dt.timestamp() * 1_000_000_000)
                    
                    # Write next_run_at data point using the actual timestamp
                    line = LineBuilder("kapa_source")
                    line.tag("project_id", project_id)
                    line.tag("source_id", source_id)
                    line.tag("source_name", source_name)
                    line.tag("source_type", source_type)
                    line.tag("event_type", "scheduled_run")
                    
                    # Add fields with the timestamp components
                    line.int64_field("timestamp_unix", int(dt.timestamp()))
                    line.string_field("timezone", dt.tzinfo.tzname(dt))
                    line.int64_field("scheduled", 1)  # Required field
                    
                    # Set the timestamp for the data point
                    line.time_ns(timestamp_ns)
                    
                    influxdb3_local.write(line)
                    
                except Exception as e:
                    influxdb3_local.warn(f"Error processing next_run_at for source {source_id}: {str(e)}")
            
            # Add source info to the returned data
            sources_data.append({
                "id": source_id,
                "name": source_name,
                "type": source_type,
                "ingested_at": ingested_at,
                "next_run_at": next_run_at
            })
        
        return {
            "status": "success",
            "project_id": project_id,
            "integration_id": integration_id,
            "source_count": len(sources),
            "sources": sources_data
        }
            
    except Exception as e:
        error_msg = f"Error collecting Kapa data: {str(e)}"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
```

### Create a trigger for the Kapa.ai sources request plugin:

```bash
influxdb3 create trigger \
  --host http://localhost:9191 \
  --database aichat \
  --trigger-spec "request:kapa_sources" \
  --plugin-filename "kapa_sources_req.py" \
  kapa_sources_endpoint
```

### Run the Kapa.ai sources request plugin:

1. Securely store your Kapa.ai API token in a secret store or environment variable.
2. Send an HTTP request to the endpoint--for example:

   ```bash
   API_TOKEN=$(grep API_TOKEN ~/.env.js_influxdb3_aichat_token | cut -d'=' -f2)
   PROJECT_ID=$(grep PROJECT_ID ~/.env.js_influxdb3_aichat_projectid | cut -d'=' -f2)
   INTEGRATION_ID=$(grep INTEGRATION_ID ~/.env.js_influxdb3_aichat_projectid | cut -d'=' -f2)

   curl -X POST "http://localhost:9191/api/v3/engine/kapa_sources" \
     -H "Content-Type: application/json" \
     -d @- << EOF
   {
     "project_id": "$PROJECT_ID",
     "integration_id": "$INTEGRATION_ID",
     "kapa_token": "$API_TOKEN"
   }
EOF
   ```

   The plugin writes the following data in line protocol format to the `kapa_source` database:
   - Kapa.ai source data
   - Measurement: "kapa_source"
   
   For example:

   ```text
   kapa_source,project_id=project123,source_id=source456,source_name=MySource,source_type=s3,event_type=ingested_at timestamp_unix=1612345678i,timezone="UTC",occurred=1i 1612345678000000000

   kapa_source,project_id=project123,source_id=source456,source_name=MySource,source_type=s3,event_type=next_run_at timestamp_unix=1712345678i,timezone="UTC",scheduled=1i 1712345678000000000
   ```

   And it returns a JSON response similar to the following:

   ```json
   {
     "status": "success",
     "project_id": "PROJECT_ID",
     "integration_id": "INTEGRATION_ID",
     "source_count": 58,
     "sources": [
       {
         "id": "e58aefe2-c16a-42d9-9ddc-b15d38142105",
         "name": "Source 1",
         "type": "scrape",
         "ingested_at": "2025-03-19T12:00:35.788963Z",
         "next_run_at": "2025-03-26T12:00:00.000138Z"
       },
       {
         "id": "0b8bcba6-c698-4e88-b9fa-7fa8ec38b05b",
         "name": "Source 2",
         "type": "scrape",
         "ingested_at": "2025-03-21T02:00:21.279909Z",
         "next_run_at": "2025-03-28T02:00:00.000112Z"
       }
     ]
   }
   ``` 

To view your data, query the `kapa_source` table:

```bash
influxdb3 query --host http://localhost:9191 --database aichat \
  "select * from kapa_source where event_type='ingested_at' and time > now() - interval '7 days'" \
  --format jsonl
```

## Orchestrate data collection with triggers

### Example: schedule PR data collection from GitHub

```python
import requests
import json
from datetime import datetime

def process_scheduled_call(influxdb3_local, call_time, args=None):
    """
    Scheduled plugin that retrieves GitHub PR data on a regular schedule.
    
    This plugin calls the github_prs endpoint to fetch PR merge data for a specified repository.
    The data is automatically written to the database by the github_prs endpoint.
    
    Args:
        influxdb3_local: Local InfluxDB API client
        call_time: Time when the trigger was called
        args: Optional arguments passed from the trigger configuration
            - github_token: GitHub API token
            - repo: GitHub repository (default: "influxdata/docs-v2")
            - time_period: Time period to retrieve PRs for (default: "week")
            - api_host: InfluxDB API host (default: "http://localhost:9191")
    
    Returns:
        Dictionary containing response data
    """
    # Extract arguments or use defaults
    if not args:
        args = {}
    
    github_token = args.get("github_token", "")
    repo = args.get("repo", "influxdata/docs-v2")
    time_period = args.get("time_period", "week")
    api_host = args.get("api_host", "http://localhost:9191")
    
    # Ensure api_host doesn't have trailing slash
    if api_host.endswith("/"):
        api_host = api_host[:-1]
    
    # Log the start of data collection
    current_time = datetime.now().isoformat()
    influxdb3_local.info(f"Starting GitHub PR data collection at {current_time}")
    
    # Make HTTP request to the github_prs endpoint
    github_url = f"{api_host}/api/v3/engine/github_prs"
    github_params = {
        "repo": repo,
        "time_period": time_period
    }
    
    if github_token:
        github_params["github_token"] = github_token
    
    try:
        influxdb3_local.info(f"Calling github_prs endpoint for {repo} over the last {time_period}...")
        
        response = requests.post(
            github_url,
            headers={"Content-Type": "application/json"},
            data=json.dumps(github_params),
            timeout=30
        )
        
        if response.status_code != 200:
            error_msg = f"GitHub API error: {response.status_code} - {response.text}"
            influxdb3_local.error(error_msg)
            return {"status": "error", "message": error_msg}
        
        # Parse response
        response_data = response.json()
        pr_count = response_data.get("pr_count", 0)
        
        success_msg = f"Successfully fetched {pr_count} PR merges for {repo}"
        influxdb3_local.info(success_msg)
        
        return {
            "status": "success",
            "message": success_msg,
            "pr_count": pr_count,
            "repository": repo,
            "time_period": time_period
        }
            
    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to call github_prs endpoint: {str(e)}"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
    except Exception as e:
        error_msg = f"Error during GitHub PR data collection: {str(e)}"
        influxdb3_local.error(error_msg)
        return {"status": "error", "message": error_msg}
```

```bash
GITHUB_TOKEN=$(grep GITHUB_TOKEN ~/.env.js_influxdb3_repo_token | cut -d'=' -f2)

influxdb3 create trigger \
  --host http://localhost:9191 \
  --database aichat \
  --trigger-spec "every:1h" \
  --plugin-filename "github_pr_scheduled.py" \
  --trigger-arguments "github_token=$GITHUB_TOKEN,repo=influxdata/docs-v2,time_period=week,api_host=http://localhost:9191" \
  github_pr_monitor
```

### Example: alert on outdated documentation in Kapa sources

```python
import requests
import json
from datetime import datetime, timezone

def process_writes(influxdb3_local, table_batches, args=None):
    """
    Writes plugin that monitors GitHub PR activity and checks Kapa.ai source ingestion.
    
    This plugin triggers when new data is written to the gh table. It checks if accumulated 
    PR lines since the last Kapa.ai source ingestion exceed a threshold, and if so, 
    generates an alert.
    
    Args:
        influxdb3_local: Local InfluxDB API client
        table_batches: Batches of data written to tables
        args: Optional arguments passed from the trigger configuration
            - source_name: Kapa.ai source name to monitor (default: "Documentation")
            - repo: GitHub repository (default: "influxdata/docs-v2")
            - severity_threshold: Line count threshold for severity warning (default: 100)
            - kapa_token: Kapa.ai API token
            - project_id: Kapa.ai project ID
    
    Returns:
        Dictionary containing response data
    """
    # Extract arguments or use defaults
    if not args:
        args = {}
    
    source_name = args.get("source_name", "Documentation")
    repo = args.get("repo", "influxdata/docs-v2")
    severity_threshold = int(args.get("severity_threshold", 100))
    kapa_token = args.get("kapa_token", "")
    project_id = args.get("project_id", "")
    
    # Check if any gh table writes match our criteria (activity_type = "pr_merge")
    has_pr_activity = False
    for table_batch in table_batches:
        if table_batch["table_name"] == "gh":
            for row in table_batch["rows"]:
                if row.get("activity_type") == "pr_merge" and row.get("repo") == repo:
                    has_pr_activity = True
                    break
            if has_pr_activity:
                break
    
    # Skip processing if no relevant PR activity
    if not has_pr_activity:
        return {"status": "skipped", "reason": "No relevant PR merge activity"}
    
    # Initialize results
    results = {
        "status": "success",
        "data": {},
        "errors": []
    }
    
    # Validate required parameters for Kapa.ai API
    if not all([kapa_token, project_id]):
        error_msg = "Missing required Kapa.ai parameters (kapa_token, project_id)"
        influxdb3_local.error(error_msg)
        results["status"] = "error"
        results["errors"].append(error_msg)
        return results
    
    try:
        # Call Kapa.ai API directly to get source information
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": kapa_token
        }
        
        # Make API request to get sources
        url = f"https://api.kapa.ai/ingestion/v1/projects/{project_id}/sources/"
        influxdb3_local.info(f"Requesting source data from Kapa.ai API")
        
        response = requests.get(url, headers=headers)
        
        # Check for API errors
        if response.status_code != 200:
            error_msg = f"Kapa API error: {response.status_code} - {response.text}"
            influxdb3_local.error(error_msg)
            results["errors"].append(error_msg)
            return results
        
        # Parse response to find the specified source
        kapa_data = response.json()
        sources = kapa_data.get("results", [])
        
        # Find the exact matching source
        target_source = None
        for source in sources:
            if source.get("name") == source_name:
                target_source = source
                break
        
        if not target_source:
            error_msg = f"Source '{source_name}' not found in Kapa.ai"
            influxdb3_local.warn(error_msg)
            results["errors"].append(error_msg)
            return results
        
        # Extract ingestion time
        ingestion_time = None
        if target_source.get("ingested_at"):
            ingestion_time = datetime.fromisoformat(target_source["ingested_at"].replace("Z", "+00:00"))
        else:
            error_msg = f"Source '{source_name}' has no ingestion timestamp"
            influxdb3_local.warn(error_msg)
            results["errors"].append(error_msg)
            return results
        
        # Format for database query
        ingestion_time_str = ingestion_time.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        
        # Query the database for PR data since last ingestion
        pr_query = f"""
        SELECT SUM(lines) as total_lines, COUNT(*) as pr_count
        FROM gh
        WHERE repo = '{repo}' AND ref = 'master' AND activity_type = 'pr_merge' AND time > '{ingestion_time_str}'
        """
        
        pr_records = influxdb3_local.query(pr_query)
        
        # Get PR stats
        if not pr_records or len(pr_records) == 0:
            total_lines = 0
            pr_count = 0
        else:
            pr_data = pr_records[0]
            total_lines = int(pr_data.get("total_lines") or 0)
            pr_count = int(pr_data.get("pr_count") or 0)
        
        # Calculate days since ingestion
        current_time = datetime.now(timezone.utc)
        days_difference = (current_time - ingestion_time).total_seconds() / 86400
        
        # Create status data
        status = {
            "source_name": source_name,
            "source_id": target_source.get("id"),
            "last_ingestion": ingestion_time.isoformat(),
            "days_since_ingestion": round(days_difference, 1),
            "pr_count": pr_count,
            "total_lines": total_lines,
            "needs_update": total_lines > 0,
            "threshold": severity_threshold
        }
        
        results["data"] = status
        
        # Only generate status and alerts if PR lines were found
        if total_lines > 0:
            influxdb3_local.info(f"Found {pr_count} PRs with {total_lines} lines changed since last ingestion of '{source_name}'")
            
            # Write status data to the database
            line = LineBuilder("integration_status")
            line.tag("repo", repo)
            line.tag("source_name", source_name)
            line.int64_field("days_since_ingestion", int(days_difference))
            line.int64_field("prs_since_ingestion", pr_count)
            line.int64_field("lines_since_ingestion", total_lines)
            line.int64_field("needs_update", 1)
            line.int64_field("severity_threshold", severity_threshold)
            
            influxdb3_local.write(line)
            
            # Generate alert based on severity threshold
            severity = "info" if total_lines < severity_threshold else "warning"
            
            alert_line = LineBuilder("documentation_alert")
            alert_line.tag("repo", repo)
            alert_line.tag("source_name", source_name)
            alert_line.tag("severity", severity)
            alert_line.string_field("message", 
                f"{source_name} needs update: {pr_count} PRs with {total_lines} lines changed in the last {days_difference:.1f} days")
            alert_line.int64_field("lines_changed", total_lines)
            alert_line.int64_field("days_since_ingestion", int(days_difference))
            
            influxdb3_local.write(alert_line)
            
            influxdb3_local.info(f"Generated {severity} alert for {source_name}")
        else:
            influxdb3_local.info(f"No PR changes since last ingestion of '{source_name}'")
    
    except requests.exceptions.RequestException as e:
        error_msg = f"Failed to call Kapa.ai API: {str(e)}"
        influxdb3_local.error(error_msg)
        results["errors"].append(error_msg)
    except Exception as e:
        error_msg = f"Error during integration monitoring: {str(e)}"
        influxdb3_local.error(error_msg)
        results["errors"].append(error_msg)
    
    return results
```

```bash
KAPA_TOKEN=$(grep API_TOKEN ~/.env.js_influxdb3_aichat_token | cut -d'=' -f2)
PROJECT_ID=$(grep PROJECT_ID ~/.env.js_influxdb3_aichat_projectid | cut -d'=' -f2)

influxdb3 create trigger \
  --host http://localhost:9191 \
  --database aichat \
  --trigger-spec "table:gh" \
  --plugin-filename "gh_kapa_integration.py" \
  --trigger-arguments "kapa_token=$KAPA_TOKEN,project_id=$PROJECT_ID,source_name=Documentation,repo=influxdata/docs-v2,severity_threshold=200" \
  gh_kapa_monitor
```

#### Data model

This plugin writes two types of measurements to your database:

1. **integration_status**: Summary of the source update status 

```text
integration_status,repo=influxdata/docs-v2,source_name=Documentation days_since_ingestion=5i,prs_since_ingestion=3i,lines_since_ingestion=250i,needs_update=1i,severity_threshold=200i
```

2. **documentation_alert**: Alerts when documentation needs updating

```text
documentation_alert,repo=influxdata/docs-v2,source_name=Documentation,severity=warning message="Documentation needs update: 3 PRs with 250 lines changed in the last 5.2 days",lines_changed=250i,days_since_ingestion=5i
```

##### Troubleshoot triggers and plugins

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

