analyze-api-source:
  <product_name> <endpoint_name> <parameter_name>

  Analyze source code in the specified repo to determine:
  1. HTTP method and endpoint path
  2. Parameters for the given endpoint
  3. Whether the specified parameter is supported for the given API endpoint
  4. Parameter format, valid values, and default behavior
  5. Any limitations or quirks of the parameter 

For product InfluxDB 3 Core and Enterprise,
  Search repo influxdata/influxdb
  Search through:
  - HTTP endpoint handlers in
  influxdb3_server/src/http/
  - Parameter structs and deserialization
  - Request routing and processing logic
  - Type definitions in influxdb3_types/src/

  In the output, provide: 
  - Comparison across v1, v2, and v3 API compatibility

In the output, provide:
  Concrete examples of endpoint and parameter usage
  Cite specific source code locations.