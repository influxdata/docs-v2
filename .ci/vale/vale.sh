# Lint cloud-dedicated
docspath=.
contentpath=$docspath/content
vale --config=$contentpath/influxdb/cloud-dedicated/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-dedicated

# Lint cloud-serverless
vale --config=$contentpath/influxdb/cloud-serverless/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/influxdb/cloud-serverless

# Lint telegraf
# vale --config=$docspath/.vale.ini --output=line --relative --minAlertLevel=error $contentpath/telegraf