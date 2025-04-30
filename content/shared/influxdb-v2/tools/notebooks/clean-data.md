
Learn how to create a notebook that normalizes data.
Data normalization is the process of modifying or cleaning data to make it easier to
work with. Examples include adjusting numeric values to a uniform scale and modifying strings.

Walk through the following example to create a notebook that queries
[NOAA NDBC sample data](/influxdb/version/reference/sample-data/#noaa-ndbc-data),
normalizes degree-based wind directions to cardinal directions, and then writes
the normalized data to a bucket.

{{< show-in "cloud,cloud-serverless" >}}  
> [!Important]
> **Note**: Using sample data counts towards your total InfluxDB Cloud usage.
{{< /show-in >}}

1.  [Create a new notebook](/influxdb/version/tools/notebooks/create-notebook/).
2.  In the **Build a Query** cell:

    1.  In the **FROM** column under **{{% caps %}}Sample{{% /caps %}}**,
        select **NOAA National Buoy Data**.
    2.  In the next **FILTER** column, select **_measurement** from the drop-down list
        and select the **ndbc** measurement in the list of measurements.
    3.  In the next **FILTER** column, select **_field** from the drop-down list,
        and select the **wind\_dir\_degt** field from the list of fields.

3.  Click {{% icon "notebook-add-cell" %}} after your **Build a Query** cell to 
    add a new cell and select **{{% caps %}}Flux Script{{% /caps %}}**.
    
4.  In the Flux script cell:
    
    1.  Define a custom function (`cardinalDir()`) that converts a numeric degree
        value to a cardinal direction (N, NNE, NE, etc.).
    2.  Use `__PREVIOUS_RESULT__` to load the output of the previous notebook
        cell into the Flux script.
    3.  Use [`map()`](/flux/v0/stdlib/universe/map/) to iterate
        over each input row, update the field key to `wind_dir_cardinal`, and
        normalize the `_value` column to a cardinal direction using the custom
        `cardinalDir()` function.
    4.  Use [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/)
        to write the normalized data back to InfluxDB.
        Specify an existing bucket to write to or
        [create a new bucket](/influxdb/version/admin/buckets/create-bucket/).

        ```js
        import "array"

        cardinalDir = (d) => {
            _cardinal = if d >= 348.7 or d < 11.25 then "N"
            else if d >= 11.25 and d < 33.75 then "NNE"
            else if d >= 33.75 and d < 56.25 then "NE"
            else if d >= 56.25 and d < 78.75 then "ENE"
            else if d >= 78.75 and d < 101.25 then "E"
            else if d >= 101.25 and d < 123.75 then "ESE"
            else if d >= 123.75 and d < 146.25 then "SE"
            else if d >= 146.25 and d < 168.75 then "SSE"
            else if d >= 168.75 and d < 191.25 then "S"
            else if d >= 191.25 and d < 213.75 then "SSW"
            else if d >= 213.75 and d < 236.25 then "SW"
            else if d >= 236.25 and d < 258.75 then "WSW"
            else if d >= 258.75 and d < 281.25 then "W"
            else if d >= 281.25 and d < 303.75 then "WNW"
            else if d >= 303.75 and d < 326.25 then "NW"
            else if d >= 326.25 and d < 348.75 then "NNW"
            else ""

            return _cardinal
        }

        __PREVIOUS_RESULT__
            |> map(fn: (r) => ({r with
                _field: "wind_dir_cardinal",
                _value: cardinalDir(d: r._value),
            }))
            |> to(bucket: "example-bucket")
        ```

{{% show-in "v2" %}}
4.  Click {{% icon "notebook-add-cell" %}} after your **Flux Script** cell to 
    add a new cell and select **{{% caps %}}Output to Bucket{{% /caps %}}**.
    Select a bucket from the **{{% icon "bucket" %}} Choose a bucket**
    drop-down list.
{{% /show-in %}}
    
5.  _(Optional)_ Click {{% icon "notebook-add-cell" %}} and select **Note** to
    add a cell containing notes about what this notebook does. For example, the
    cell might say, "This notebook converts decimal degree wind direction values
    to cardinal directions."
{{% show-in "v2" %}}
6.  Click **Preview** in the upper left to verify that your
    notebook runs and previews the output.
{{% /show-in %}}
7.  Click **Run** to run the notebook and write the normalized data to your bucket.

## Continuously run a notebook
To continuously run your notebook, export the notebook as a task:

1.  Click {{% icon "notebook-add-cell" %}} to add a new cell and then select
    **{{% caps %}}Task{{% /caps %}}**.
2.  Provide the following:

    - **Every**: Interval that the task should run at.
    - **Offset**: _(Optional)_ Time to wait after the defined interval to execute the task.
      This allows the task to capture late-arriving data.

3.  Click **{{% icon "export" %}} Export as Task**.
