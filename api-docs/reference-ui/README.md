# reference-ui

This project provides the UI for API reference docs.
It includes a Vue.JS app that wraps [RapiDoc](https://mrin9.github.io/RapiDoc/index.html).

## Generate OpenAPI JSON from ref.yml

Rapidoc requires OpenAPI specs in JSON format.
To generate the JSON from the influxdata/openapi ref.yml files, run the following commands from `docs-v2/api-docs`:
`npx openapi bundle v2.1/ref.yml --output openapi/specs/v2.1.json
 npx openapi bundle cloud/ref.yml --output openapi/specs/cloud.json
`

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
