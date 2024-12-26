---
title: JavaScript client library for InfluxDB v3
list_title: JavaScript
description: >
  The InfluxDB v3 `influxdb3-js` JavaScript client library integrates with JavaScript scripts and applications to write and query data stored in an InfluxDB Cloud Dedicated database.
external_url: https://github.com/InfluxCommunity/influxdb3-js
menu:
  influxdb_cloud_dedicated:
    name: JavaScript
    parent: v3 client libraries
    identifier: influxdb3-js
influxdb/cloud-dedicated/tags: [Flight client, JavaScript, gRPC, SQL, Flight SQL, client libraries]
weight: 201
aliases:
  - /influxdb/cloud-dedicated/reference/api/client-libraries/go/
  - /influxdb/cloud-dedicated/tools/client-libraries/go/
list_code_example: >
  ```javascript
  Example: Writing and querying data

  // The following example demonstrates how to write sensor data into InfluxDB using the 
  
  // and retrieve data from the last 90 days for analysis.

  
  // Import the InfluxDB client library
  
  import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';
 
  import fs from 'fs';
  
  import csv from 'csv-parser';

  
  // Initialize the InfluxDB client
  
  const client = new InfluxDBClient({
    host: 'https://your-influxdb-url',
    token: 'your-auth-token',
    org: 'your-organization-id',
    database: 'your-database-name',
  });

  
  // Function to write sensor data in batches from a CSV file
  
  const writeSensorData = async (filePath) => {
    const points = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const point = new Point('home')
          .timestamp(new Date(row['time']))
          .tag('room', row['room']);
        points.push(point);
      })
      .on('end', async () => {
        try {
          await client.write(points);
          console.log('Data successfully written to InfluxDB.');
        } catch (error) {
          console.error('Error writing data to InfluxDB:', error);
        }
      });
  };

  
  // Function to query data for the last 90 days
  
  const querySensorData = async () => {
    const query = `
      SELECT *
      FROM home
      WHERE time >= now() - INTERVAL '90 days'
      ORDER BY time
    `;
    try {
      const result = await client.query(query);
      console.log('Queried data:', result);
    } catch (error) {
      console.error('Error querying data from InfluxDB:', error);
    }
  };

  
  // Example usage
  
  const filePath = './data/home-sensor-data.csv';
  
  writeSensorData(filePath);
  
  querySensorData();
  
  ```
---
    
The InfluxDB v3 [`influxdb3-js` JavaScript client library](https://github.com/InfluxCommunity/influxdb3-js) integrates with JavaScript scripts and applications
to write and query data stored in an {{% product-name %}} database.

The documentation for this client library is available on GitHub.

<a href="https://github.com/InfluxCommunity/influxdb3-js" target="_blank" class="btn github">InfluxDB v3 JavaScript client library</a>
