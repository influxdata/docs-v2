# Lint cloud-dedicated
docspath=.
contentpath=$docspath/content
npx vale --config=$contentpath/influxdb/cloud-dedicated/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-dedicated

# Lint cloud-serverless
npx vale --config=$contentpath/influxdb/cloud-serverless/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-serverless

# Lint clustered
npx vale --config=$contentpath/influxdb/clustered/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/clustered

# Lint telegraf
# vale --config=$docspath/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/telegraf