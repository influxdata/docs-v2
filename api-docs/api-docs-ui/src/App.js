import React, { useEffect, useRef, useState } from 'react';
import 'rapidoc';
import './App.css';
import * as Servers from './Servers';
import cloud from './openapi-specs/cloud.json';
import { useCookies } from "react-cookie";

/** Set the default server environment ('oss', 'cloud', or 'dev'). **/
const defaultServerName='oss';

function setDevApiServers(apiServers) {
  if(apiServers && process.env.NODE_ENV === 'development') {
    Object.keys(apiServers).forEach(k => {
      console.log(k)
      apiServers[k].url = `http://localhost:3000/${k}`
    });
    return apiServers;
  }
}

function findApiKey(request) {
  const header = request.headers.get('authorization');
  const token = header?.match(/^token .*/);
  return token && token[0];
}

function App() {
  const openapiSpec = cloud;
  const rapidocEl = useRef(null);
  const [cookies, setCookie] = useCookies(["influxdb_cloud_url"]);
  const [spec, setSpec] = useState();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    function setRapidocListeners() {
      rapidocEl.current && rapidocEl.current.addEventListener('before-render', (e) => {
        /** Make changes to event.detail.spec here before it's rendered. **/
        console.log('handle before render...');
        console.log(e);
        if(cookies.influxdb_cloud_url) {
          Servers.cloud.url = cookies.influxdb_cloud_url;
        }

        let servers;
        if(Servers) {
          servers = setDevApiServers(Servers);
        }

        const specServers = Object.keys(servers).map(s => ({url: servers[s].url, description: servers[s].description}));
        e.detail.spec.servers = specServers;
        function personalizeCodeSamples(props) {
          const paths = e.detail.spec.paths;
          const pathNodes = Object.keys(paths);
          pathNodes?.forEach((pathn) => {
            const ops = Object.keys(paths[pathn]);
              ops.forEach(opn => {
                paths[pathn][opn] && paths[pathn][opn]['x-code-samples']?.forEach((code, i) => {
                  if(paths[pathn][opn]['x-code-samples'][i]?.source) {
                    paths[pathn][opn]['x-code-samples'][i].source = code.source.replace(/https:\/\/cloud.influxdb/gi, props.baseUrl);
                    paths[pathn][opn]['x-code-samples'][i].source = code.source.replace(/http:\/\/localhost:8086/gi, props.baseUrl);
                    if(apiKey) {
                      paths[pathn][opn]['x-code-samples'][i].source = code.source.replace('token INFLUX_TOKEN', `${apiKey}`);
                    }
                  }
                });
              });
            });
        }
        personalizeCodeSamples({baseUrl: cookies.influxdb_cloud_url});
      });
      rapidocEl.current && rapidocEl.current.addEventListener('spec-loaded', (e) => {
        console.log("spec loaded!")
        console.log(e);
        e.target.setApiServer(Servers[defaultServerName].url);
      });
      rapidocEl.current && rapidocEl.current.addEventListener('api-server-change', (e) => {
        console.log('api server changed!');
        console.log(e);
      });
      rapidocEl.current && rapidocEl.current.addEventListener('before-try', (e) => {
        console.log('before try...')
        if(!e?.detail?.request) {
           return;
        }

        function personalizeCodeSamples(props) {
          const samples = e.target.shadowRoot.querySelectorAll('code > *');
          samples.forEach(s => {
            s.textContent = s.textContent.replace('token INFLUX_TOKEN', `${props.apiKey}`)
          });
        }

        const userApiKey = findApiKey(e.detail.request);
        if(userApiKey) {
            setApiKey(userApiKey);
            personalizeCodeSamples({apiKey: userApiKey});
        }

        /** Set the token from elsewhere, e.g. custom form field **/
        // const apiKeyOverride = '';
        // if(apiKeyOverride) {
        //   setApiKey(apiKeyOverride);
        //   e.detail.request.headers.append('Authorization', `token ${apiKeyOverride}`);
        // }
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
        allow-spec-url-load="false"
        allow-spec-file-load="false"
      >
      <user-prefs
        style={{
         minHeight: '5vh',
         display: 'flex',
         justifyContent: 'flex-end',
         flexDirection: 'row',
         alignItems: 'right',
         fontSize: '.8rem',
         fontWeight: '600' }}>
        <div>Your InfluxDB Cloud URL: {cookies.influxdb_cloud_url}</div>
      </user-prefs>
      </rapi-doc>
    </div>
  );
}

export default App;
