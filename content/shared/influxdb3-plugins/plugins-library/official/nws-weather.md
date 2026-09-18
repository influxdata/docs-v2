<!-- BEGIN GENERATED PLUGIN CONTENT -->
<!-- vale off -->
The US NWS Weather Sampler Plugin provides real-time weather data from the National Weather Service API for demonstration and sample data purposes. Fetch live observations from multiple weather stations across the United States with zero authentication required. Perfect for demos, training, testing, and providing realistic IoT-like time-series data streams.

- **Zero authentication**: No API keys or signup required
- **Real-time data**: Live weather updates from NOAA weather stations
- **Multiple metrics**: Temperature, humidity, wind, pressure, visibility, and more
- **Configurable stations**: Choose from thousands of US weather stations
- **Parallel fetching**: Efficient concurrent data retrieval from multiple stations
- **Statistics tracking**: Built-in monitoring of plugin performance

## Configuration

Plugin parameters may be specified as key-value pairs in the `--trigger-arguments` flag (CLI) or in the `trigger_arguments` field (API) when creating a trigger.

If a plugin supports multiple trigger specifications, some parameters may depend on the trigger specification that you use.

### Plugin metadata

This plugin includes a JSON metadata schema in its docstring that defines supported trigger types and configuration parameters. This metadata enables the [InfluxDB 3 Explorer](https://docs.influxdata.com/influxdb3/explorer/) UI to display and configure the plugin.

### Required parameters

| Parameter  | Type   | Default                                            | Description                              |
|------------|--------|----------------------------------------------------|------------------------------------------|
| `stations` | string | KSEA.KORD.KJFK.KDEN.KATL.KDFW.KLAX.KMIA.KPHX.KBOS | Dot-separated list of NWS station IDs   |

### Optional parameters

| Parameter             | Type    | Default                    | Description                                                                                                                                                                               |
|-----------------------|---------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `measurement`         | string  | weather_observations       | Destination measurement for weather data                                                                                                                                                  |
| `user_agent`          | string  | InfluxDB3-NWS-Plugin/1.0   | Custom User-Agent header for NWS API requests                                                                                                                                             |
| `use_data_timestamp`  | boolean | true                       | Use timestamp from weather observation data instead of current time when writing data                                                                                                     |
| `enable_full_logging` | boolean | false                      | When `true`, full exception messages are written to logs. When `false` (default), only the exception type is logged, to avoid leaking sensitive values. Enable temporarily for debugging. |

**Note:** Station IDs are separated by dots (`.`) in trigger arguments. Example: `stations=KSEA.KSFO.KLAX`

## Software Requirements

- **{{% product-name %}}**: with the Processing Engine enabled
- **Python packages**: No additional packages required (uses Python standard library only)
- **Network access**: Outbound HTTPS access to `api.weather.gov`

### Installation steps

1. Start {{% product-name %}} with the Processing Engine enabled (`--plugin-dir /path/to/plugins`):

   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```
2. No additional Python packages are required for this plugin.

## Trigger setup

### Scheduled trigger

Create a trigger for periodic weather data collection:

```bash
influxdb3 create trigger \
  --database weather_demo \
  --path "gh:influxdata/nws_weather/nws_weather_sampler.py" \
  --trigger-spec "every:5m" \
  nws_weather_trigger

# Enable the trigger
influxdb3 enable trigger --database weather_demo nws_weather_trigger
```
## Example usage

### Example 1: Basic weather data collection

Collect weather data from multiple stations every 5 minutes:

```bash
# Create the trigger
influxdb3 create trigger \
  --database weather_demo \
  --path "gh:influxdata/nws_weather/nws_weather_sampler.py" \
  --trigger-spec "every:5m" \
  --trigger-arguments "stations=KSEA.KSFO.KORD" \
  nws_basic_weather

# Enable the trigger
influxdb3 enable trigger --database weather_demo nws_basic_weather

# Query weather data (after a few minutes)
influxdb3 query \
  --database weather_demo \
  "SELECT station_id, temperature_c, relative_humidity_percent, time FROM weather_observations ORDER BY time DESC LIMIT 10"
```
### Expected output

 station_id | temperature_c | relative_humidity_percent | time
 -----------|---------------|---------------------------|-----
 KSEA       | 15.6          | 72.0                      | 2025-11-26T10:00:00Z
 KSFO       | 18.3          | 65.0                      | 2025-11-26T10:00:00Z
 KORD       | 12.2          | 68.0                      | 2025-11-26T10:00:00Z

### Example 2: Custom measurement name and user agent

```bash
# Create trigger with custom configuration
influxdb3 create trigger \
  --database weather_demo \
  --path "gh:influxdata/nws_weather/nws_weather_sampler.py" \
  --trigger-spec "every:10m" \
  --trigger-arguments "stations=KJFK.KATL.KDFW,measurement=us_weather,user_agent=MyDemo/1.0" \
  nws_custom_weather
```
### Example 3: Using current time instead of API observation timestamp

By default (`use_data_timestamp=true`), the plugin uses the timestamp from the weather observation data provided by the NWS API. However, since `api.weather.gov` may not update data regularly, this can lead to scenarios where no new records are written:

**Scenario example:**
- Weather station updates data every 10 minutes
- Plugin runs every 3 minutes
- First run: New record written (timestamp from API: 4:10 PM)
- Second run (3 min later): No new record (API still returns data timestamped 4:10 PM - a duplicate that will overwrite the existing record)
- Third run (6 min later): No new record (API still returns data timestamped 4:10 PM - a duplicate that will overwrite the existing record)
- Fourth run (9 min later): New record written (timestamp from API: 4:20 PM)

To ensure data is written on every plugin execution (useful for demos or populating tables with regular data), set `use_data_timestamp=false`:

```bash
# Create trigger that writes data on every execution using current time
influxdb3 create trigger \
  --database weather_demo \
  --path "gh:influxdata/nws_weather/nws_weather_sampler.py" \
  --trigger-spec "every:3m" \
  --trigger-arguments "stations=KSEA.KSFO,use_data_timestamp=false" \
  nws_current_time
```
**Note:** The NWS API data is typically delayed. For example:
- Request at 4:30 PM → Returns data timestamped 4:10 PM
- Request at 4:37 PM → Returns data timestamped 4:25 PM

## Output data structure

### Measurement: `weather_observations`

**Tags:**
- `station_id`: NWS station identifier (for example, "KSEA")
- `station`: Full station name
- `conditions`: Current weather conditions (for example, "Fair", "Partly Cloudy")
- `longitude`: Station longitude (4 decimal places)
- `latitude`: Station latitude (4 decimal places)

**Fields:**
- `temperature_c` (float): Temperature in Celsius
- `dewpoint_c` (float): Dew point in Celsius
- `wind_speed_kmh` (float): Wind speed in km/h
- `wind_direction_degrees` (float): Wind direction (0-360°)
- `wind_gust_kmh` (float): Wind gust speed in km/h
- `barometric_pressure_pa` (float): Barometric pressure in Pascals
- `visibility_m` (float): Visibility in meters
- `relative_humidity_percent` (float): Relative humidity (0-100%)
- `elevation_m` (float): Station elevation in meters

**Timestamp:**
- Automatically set from NWS observation time (nanosecond precision)

### Measurement: `nws_plugin_stats`

Tracks plugin execution statistics:

**Tags:**
- `plugin`: Always "nws_weather_sampler"

**Fields:**
- `success_count` (int64): Number of successful station fetches
- `error_count` (int64): Number of failed station fetches
- `total_count` (int64): Total stations attempted
- `success_rate` (float64): Success percentage (0-100)
- `task_id` (string): Unique identifier for each plugin execution

## Finding Weather Stations

### Popular Station IDs

Major US airports make excellent weather stations:

**West Coast:**
- `KSEA` - Seattle-Tacoma International, WA
- `KPDX` - Portland International, OR
- `KSFO` - San Francisco International, CA
- `KLAX` - Los Angeles International, CA
- `KSAN` - San Diego International, CA

**East Coast:**
- `KBOS` - Boston Logan International, MA
- `KJFK` - New York JFK International, NY
- `KEWR` - Newark Liberty International, NJ
- `KPHL` - Philadelphia International, PA
- `KATL` - Atlanta Hartsfield-Jackson International, GA
- `KMIA` - Miami International, FL

**Central:**
- `KORD` - Chicago O'Hare International, IL
- `KDFW` - Dallas/Fort Worth International, TX
- `KDEN` - Denver International, CO
- `KPHX` - Phoenix Sky Harbor International, AZ
- `KLAS` - Las Vegas McCarran International, NV

### How to Find Stations

1. **Airport Codes**: Most US airport weather stations use the ICAO code (4 letters starting with 'K')
   - Example: Seattle-Tacoma airport code SEA → Station ID KSEA

2. **NWS Station List**: Browse available stations at:
   - https://www.weather.gov/documentation/services-web-api
   - API endpoint: `https://api.weather.gov/stations?state=WA` (replace WA with your state)

3. **Test a Station**:
   ```bash
   curl -H "User-Agent: test" https://api.weather.gov/stations/KSEA/observations/latest
   ```
## Example Queries

### Current temperature across all stations

```sql
SELECT 
  station_id,
  temperature_c,
  time
FROM weather_observations
WHERE time > now() - INTERVAL '1 hour'
ORDER BY time DESC;
```
### Average temperature by location

```sql
SELECT 
  station_id,
  AVG(temperature_c) as avg_temp,
  MAX(temperature_c) as max_temp,
  MIN(temperature_c) as min_temp
FROM weather_observations
WHERE time > now() - INTERVAL '24 hours'
GROUP BY station_id
ORDER BY avg_temp DESC;
```
### Wind speed trends

```sql
SELECT 
  time_bucket(time, INTERVAL '1 hour') as hour,
  station_id,
  AVG(wind_speed_kmh) as avg_wind_speed,
  MAX(wind_gust_kmh) as max_gust
FROM weather_observations
WHERE time > now() - INTERVAL '24 hours'
GROUP BY hour, station_id
ORDER BY hour, station_id;
```
### Check plugin statistics

```sql
SELECT 
  time,
  success_count,
  error_count,
  success_rate
FROM nws_plugin_stats
WHERE time > now() - INTERVAL '1 hour'
ORDER BY time DESC;
```
## Code overview

### Files

- `nws_weather_sampler.py`: The main plugin code containing the scheduled handler for weather data collection

### Logging

Logs are stored in the trigger's database in the `system.processing_engine_logs` table. To view logs:

```bash
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'nws_weather_trigger'"
```
### Main functions

#### `process_scheduled_call(influxdb3_local, call_time, args)`

Handles scheduled weather data fetching. Fetches observations from configured NWS stations in parallel and writes to InfluxDB.

Key operations:

1. Parses configuration from trigger arguments
2. Fetches weather data from stations in parallel using ThreadPoolExecutor
3. Writes weather observations and plugin statistics to InfluxDB
4. Implements comprehensive error handling and logging

## Troubleshooting

### Common issues

#### Issue: No data appearing

**Solution**: Check trigger status, review plugin logs, and verify network connectivity:

```bash
# Check trigger status
influxdb3 show summary --database weather_demo --token YOUR_TOKEN

# Check plugin logs
influxdb3 query --database YOUR_DATABASE "SELECT * FROM system.processing_engine_logs WHERE log_text LIKE '%NWS%' ORDER BY event_time DESC LIMIT 10"

# Verify network connectivity
curl -H "User-Agent: test" https://api.weather.gov/stations/KSEA/observations/latest
```
#### Issue: Rate limiting from NWS API

**Solution**: The NWS API has generous rate limits. If you encounter rate limiting, reduce polling frequency, reduce number of stations, or add delays between station requests.

#### Issue: HTTP 404 errors for specific stations

**Solution**: Station may not exist or be decommissioned. Check station ID spelling and try a different station from the same area.

#### Issue: JSON decode errors

**Solution**: NWS API may be temporarily unavailable. Check if station is reporting data: `curl -H "User-Agent: test" https://api.weather.gov/stations/STATION_ID/observations/latest`

### Debugging tips

1. **Check trigger status**:
   ```bash
   influxdb3 show summary --database weather_demo --token YOUR_TOKEN
   ```
2. **Enable/Disable trigger**:
   ```bash
   influxdb3 disable trigger nws_weather --database weather_demo --token YOUR_TOKEN
   influxdb3 enable trigger nws_weather --database weather_demo --token YOUR_TOKEN
   ```
## Integration with Grafana

1. **Add {{% product-name %}} Data Source** in Grafana
   - URL: `http://localhost:8181`
   - Database: `weather_demo`
   - Token: Your admin token

2. **Create a Dashboard Panel**:

   **Query:**
   ```sql
   SELECT 
     time,
     station_id,
     temperature_c
   FROM weather_observations
   WHERE time > now() - INTERVAL '1 hour'
   ORDER BY time
   ```
   **Visualization**: Time series graph

3. **Watch real-time weather data update** every 5 minutes!

## Common Customizations

### Change Polling Frequency

**Every 1 minute** (for faster demos):
```bash
influxdb3 delete trigger nws_weather --database weather_demo --token YOUR_TOKEN

influxdb3 create trigger \
  --trigger-spec "every:1m" \
  --path "gh:influxdata/nws_weather/nws_weather_sampler.py" \
  --database weather_demo \
  --trigger-arguments "use_data_timestamp=false" \
  --token YOUR_TOKEN \
  nws_weather_fast
```
### Select Different Cities

Pick from major US cities:
```bash
# West Coast
--trigger-arguments "stations=KSEA.KPDX.KSFO.KLAX.KSAN"

# East Coast
--trigger-arguments "stations=KBOS.KJFK.KPHL.KBWI.KATL"

# Central
--trigger-arguments "stations=KORD.KMSP.KSTL.KCLE.KDEN"

# Texas
--trigger-arguments "stations=KDFW.KIAH.KAUS.KSAT.KHOU"
```
## API Reference

**National Weather Service API**
- Base URL: https://api.weather.gov
- Documentation: https://www.weather.gov/documentation/services-web-api
- Authentication: None required (User-Agent header required)
- Rate Limits: Not publicly documented, but generous
- Data Update Frequency: Typically every 1-5 minutes
- Coverage: Thousands of stations across the United States

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.
<!-- vale on -->
<!-- END GENERATED PLUGIN CONTENT -->
