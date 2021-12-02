import React, { useEffect, useRef, useState } from 'react';
import 'rapidoc';
import './App.css';
import cloud from './openapi-specs/cloud.json';


function App() {
  const openapiSpec = cloud;
  const rapidocEl = useRef(null);
  const [spec, setSpec] = useState();

  useEffect(() => {
    if(openapiSpec && !spec) {
      setSpec(openapiSpec);

      console.log('loading OpenAPI spec...')
      rapidocEl.current && rapidocEl.current.loadSpec(openapiSpec);

    }
  }, [spec, openapiSpec]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>InfluxData API Docs Rapidoc Demo</h2>
      </header>

      <rapi-doc
        ref={ rapidocEl }
        render-style="read"
        style={{ height: "100vh", width: "100%" }}
      >
      </rapi-doc>
    </div>
  );
}

export default App;
