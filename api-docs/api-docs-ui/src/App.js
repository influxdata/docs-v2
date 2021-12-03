import React, { useEffect, useRef, useState } from 'react';
import 'rapidoc';
import './App.css';
import servers from './Servers';
import cloud from './openapi-specs/cloud.json';

const defaultServerUrl = (servers[servers.length - 1]).url;

function App() {
  const openapiSpec = cloud;
  const rapidocEl = useRef(null);
  const [spec, setSpec] = useState();

  useEffect(() => {
    function setRapidocListeners() {
      rapidocEl.current && rapidocEl.current.addEventListener('before-render', (e) => {
        /** Make changes to event.detail.spec here before it's rendered. **/
        console.log('handle before render...');
        console.log(e);
        e.detail.spec.servers = servers;
      });
      rapidocEl.current && rapidocEl.current.addEventListener('spec-loaded', (e) => {
        console.log("spec loaded!")
        console.log(e);
        e.target.setApiServer(defaultServerUrl);
      });
      rapidocEl.current && rapidocEl.current.addEventListener('api-server-change', (e) => {
        console.log('api server changed!');
        console.log(e);
      });
    }

    setRapidocListeners();
  }, []);

  useEffect(() => {
    function handleLoadSpec() {
      setSpec(openapiSpec);

      console.log('loading OpenAPI spec...')
      rapidocEl.current && rapidocEl.current.loadSpec(openapiSpec);
    }

    if(openapiSpec && !spec) {
      handleLoadSpec();
    }
  }, [spec, openapiSpec]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>InfluxData API Docs Rapidoc Demo</h2>
      </header>

      <rapi-doc
        ref={ rapidocEl }
        render-style="focused" // lazy-loading
        style={{ height: "100vh", width: "100%" }}
        fetch-credentials="include"
      >
      </rapi-doc>
    </div>
  );
}

export default App;
