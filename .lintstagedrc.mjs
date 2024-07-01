// Lint-staged configuration. This file must export a lint-staged configuration object.

function pytestStagedContent(paths, productPath) {
  const productName = productPath.replace(/\//g, '-');
  const CONTENT = `staged-${productName}`;
  const TEST = `pytest-${productName}`;

  return [
    // Remove existing containers
    `sh -c "docker rm -f ${CONTENT} || true"`,
    `sh -c "docker rm -f ${TEST} || true"`,

    `docker build . -f Dockerfile.tests -t influxdata-docs/tests:latest`,

    // Remove any existing Docker volume for staged content
    `sh -c "docker volume rm -f ${CONTENT} || true"`,
     
    // Create a Docker volume for product staged content
    `sh -c "docker volume create \
     --label tag=influxdata-docs \
     --label stage=test \
     --name ${CONTENT} || true"`,

    // Copy staged content to a volume and run the prepare script
    // to remove the existing 
    `docker run --name ${CONTENT}
      --label tag=influxdata-docs
      --label stage=test
      --mount type=volume,source=${CONTENT},target=/app/content
      --mount type=bind,src=./content,dst=/src/content
      --mount type=bind,src=./static/downloads,dst=/app/data
      influxdata-docs/tests --files "${paths.join(' ')}"`,

    `docker build .
      -f Dockerfile.pytest
      -t influxdata-docs/pytest:latest`,

    // Run test runners.
    // Uses a pytest plugin to suppress exit code 5 (if no tests are found),
    // This avoids needing to "pre-run" test collection in a subshell to check the exit code.
    // Instead of the plugin, we could use a placeholder test that always or conditionally passes.
    // Whether tests pass or fail, the container is removed,
    // but the CONTENT container and associated volume will remain until the next run.
    // Note: the "--network host" setting and `host-open` script are used to 
    // forward influxctl authentication URLs from the container to the host
    // where they can be opened and approved in a host browser.
    // Allowing "--network host" has security implications and isn't ideal.
    `docker run --rm -t \
      --label tag=influxdata-docs \
      --label stage=test \
      --name ${TEST} \
      --env-file ${productPath}/.env.test \
      --volumes-from ${CONTENT} \
      --mount type=bind,src=./test/shared,dst=/shared \
      influxdata-docs/pytest --codeblocks --suppress-no-test-exit-code --exitfirst ${productPath}/`,
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
      ...pytestStagedContent(paths, 'content/influxdb/cloud'), 
    ],

    "content/influxdb/cloud-dedicated/**/*.md":
    paths => [
     `.ci/vale/vale.sh --config content/influxdb/cloud-dedicated/.vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/influxdb/cloud-dedicated'),
    ], 

  "content/influxdb/cloud-serverless/**/*.md":
    paths => [
     `.ci/vale/vale.sh --config content/influxdb/cloud-serverless/.vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/influxdb/cloud-serverless'),
    ], 

  "content/influxdb/clustered/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config content/influxdb/clustered/.vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/influxdb/clustered'),
    ],
  
  "content/influxdb/v1/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/influxdb/v1'), 
    ],

  "content/influxdb/v2/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/influxdb/v2'), 
  ],

  "content/telegraf/**/*.md":
    paths => [
    `.ci/vale/vale.sh --config .vale.ini --minAlertLevel error ${paths}`,
      ...pytestStagedContent(paths, 'content/telegraf'),  
    ],
}
