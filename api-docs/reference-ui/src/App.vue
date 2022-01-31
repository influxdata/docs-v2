<template>
<influx-docs-header />
<rapi-doc
  spec-url = "https://petstore.swagger.io/v2/swagger.json"
  render-style = "read"
  style = "height:100vh; width:100%"> </rapi-doc>
<influx-docs-footer />
</template>

<script>
import InfluxDocsHeader from './components/influx-docs-header.vue'
import InfluxDocsFooter from './components/influx-docs-footer.vue'
import 'rapidoc'

export default {
  name: 'App',
  components: {
      InfluxDocsHeader,
    InfluxDocsFooter,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
