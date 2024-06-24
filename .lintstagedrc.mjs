// Lint-staged configuration. This file must export a lint-staged configuration object.

function lintStagedContent(paths, productPath) {
  const name = `staged-${productPath.replace(/\//g, '-')}`;

  return [
           `docker build . -f Dockerfile.tests -t influxdata-docs/tests:latest`,

            // Remove any existing test container.
           `docker rm -f ${name} || true`,

           `docker run --name ${name} --mount type=volume,target=/app/content --mount type=bind,src=./content,dst=/src/content --mount type=bind,src=./static/downloads,dst=/app/data
           influxdata-docs/tests --files "${paths.join(' ')}"`,

           `docker build . -f Dockerfile.pytest -t influxdata-docs/pytest:latest`,

           // Run test runners. If tests fail, the container will be removed,
           //but the "test-" container will remain until the next run.
           `docker run --env-file ${productPath}/.env.test
           --volumes-from ${name} --rm
           influxdata-docs/pytest --codeblocks ${productPath}/`
  ];
}

export default {
    "*.{js,css}": paths => `prettier --write ${paths.join(' ')}`,

    // Don't let prettier check or write Markdown files for now;
    // it indents code blocks within list items, which breaks Hugo's rendering.
    // "*.md": paths => `prettier --check ${paths.join(' ')}`,

    "content/influxdb/cloud-dedicated/**/*.md":
      paths => lintStagedContent(paths, 'content/influxdb/cloud-dedicated'),
    "content/influxdb/clustered/**/*.md":
      paths => lintStagedContent(paths, 'content/influxdb/clustered'),
    
    // "content/influxdb/cloud-serverless/**/*.md": "docker compose run -T lint --config=content/influxdb/cloud-serverless/.vale.ini --minAlertLevel=error",

    // "content/influxdb/clustered/**/*.md": "docker compose run -T lint --config=content/influxdb/clustered/.vale.ini --minAlertLevel=error",

    // "content/influxdb/{cloud,v2,telegraf}/**/*.md": "docker compose run -T lint --config=.vale.ini --minAlertLevel=error"
}
