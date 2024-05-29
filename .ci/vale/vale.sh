# Lint cloud-dedicated
docspath=.
contentpath=$docspath/content

# Vale searches for a configuration file (.vale.ini) in the directory of the file being linted, and then in each of its parent directories.
# Lint cloud-dedicated
npx vale --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-dedicated

# Lint cloud-serverless
npx vale --config=$contentpath/influxdb/cloud-serverless/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-serverless

# Lint clustered
npx vale --config=$contentpath/influxdb/clustered/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/clustered

# Lint telegraf
# npx vale --config=$docspath/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/telegraf
