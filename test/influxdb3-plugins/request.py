def process_request(influxdb3_local, query_parameters, request_headers, request_body, args=None):
    """
    Process an HTTP request to a custom endpoint in the InfluxDB 3 processing engine.
    Args:
        influxdb3_local: Local InfluxDB API client
        query_parameters: Query parameters from the HTTP request
        request_headers: Headers from the HTTP request
        request_body: Body of the HTTP request
        args: Optional arguments passed from the trigger configuration
    """
    influxdb3_local.info("Processing HTTP request to custom endpoint")
    # Handle HTTP requests to a custom endpoint
    
    # Log the request parameters
    influxdb3_local.info(f"Received request with parameters: {query_parameters}")
    
    # Process the request body
    if request_body:
        import json
        data = json.loads(request_body)
        influxdb3_local.info(f"Request data: {data}")
    
    # Return a response (automatically converted to JSON)
    return {"status": "success", "message": "Request processed"}
