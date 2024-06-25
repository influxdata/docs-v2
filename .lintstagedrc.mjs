// Lint-staged configuration. This file must export a lint-staged configuration object.

function testStagedContent(paths, productPath) {
  const productName = productPath.replace(/\//g, '-');
  const CONTENT = `staged-${productName}`;
  const TEST = `pytest-${productName}`;

  return [
    // Remove any existing test container and volume
    `sh -c "docker rm -f ${CONTENT} || true"`,
    `sh -c "docker rm -f ${TEST} || true"`,

    `docker build . -f Dockerfile.tests -t influxdata-docs/tests:latest`,

    // Copy staged content to a volume and run the prepare script
    `docker run --name ${CONTENT}
      --mount type=volume,source=staged-content,target=/app/content
      --mount type=bind,src=./content,dst=/src/content
      --mount type=bind,src=./static/downloads,dst=/app/data
      influxdata-docs/tests --files "${paths.join(' ')}"`,

    `docker build .
      -f Dockerfile.pytest
      -t influxdata-docs/pytest:latest`,

    // Run test runners.
    // This script first checks if there are any tests to run using `pytest --collect-only`.
    // If there are tests, it runs them; otherwise, it exits with a success code.
    // Whether tests pass or fail, the container is removed,
    // but the CONTENT container and associated volume will remain until the next run.
    `sh -c "docker run --rm --name ${TEST}-collector \
      --env-file ${productPath}/.env.test \
      --volumes-from ${CONTENT} \
      influxdata-docs/pytest --codeblocks --collect-only \
       ${productPath}/ > /dev/null 2>&1; \
      TEST_COLLECT_EXIT_CODE=$?; \
      if [ $TEST_COLLECT_EXIT_CODE -eq 5 ]; then \
        echo 'No tests to run.'; \
        exit 0; \
      else \
        docker run --rm --name ${TEST} \
          --env-file ${productPath}/.env.test \
          --volumes-from ${CONTENT} \
          influxdata-docs/pytest --codeblocks --exitfirst ${productPath}/;
      fi"`
  ];
}

// Export a lint-staged configuration object.
// Run tests and linters on staged files.
export default {
  "*.{js,css}": paths => `prettier --write ${paths.join(' ')}`,

  "*.md": paths => `.ci/vale/vale.sh --config .vale.ini ${paths} --min|| true`,

  "content/influxdb/api-docs/": paths =>
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,

  "content/influxdb/cloud/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/cloud'), 
    ],

  "content/influxdb/cloud-dedicated/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/cloud-dedicated'), 
    ],

  "content/influxdb/cloud-serverless/**/*.md":
    paths => [
     `.ci/vale/vale.sh --config content/influxdb/cloud-serverless/.vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/cloud-serverless'),
    ], 

  "content/influxdb/clustered/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config content/influxdb/clustered/.vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/clustered'),
    ],
  
  "content/influxdb/v1/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/v1'), 
    ],

  "content/influxdb/v2/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/influxdb/v2'), 
  ],

  "content/telegraf/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...testStagedContent(paths, 'content/telegraf'),  
    ],
}
