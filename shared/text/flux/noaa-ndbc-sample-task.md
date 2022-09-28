```js
import "influxdata/influxdb/sample"

option task = {
  name: "Collect NOAA NDBC data"
  every: 15m,
}

sample.data(set: "noaa")
  |> to(
      org: "example-org",
      bucket: "example-bucket"
  )
```