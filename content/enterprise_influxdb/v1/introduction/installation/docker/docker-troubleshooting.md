---
title: Docker troubleshooting for InfluxDB Enterprise v1
description: Common Docker-specific issues and solutions for InfluxDB Enterprise v1 deployments.
menu:
  enterprise_influxdb_v1:
    name: Docker troubleshooting
    weight: 35
    parent: Install with Docker 
related:
  - /enterprise_influxdb/v1/introduction/installation/docker/
  - /enterprise_influxdb/v1/troubleshooting/
  - /enterprise_influxdb/v1/administration/monitor/logs/
---

This guide covers common Docker-specific issues and solutions when running InfluxDB v1 Enterprise in containers.

## Common Docker issues

### License key issues

#### Problem: Container fails to start with license error

**Symptoms:**
```
license key verification failed
```

**Solution:**
1. Verify your license key is valid and not expired
2. Ensure the license key environment variable is set correctly:
   ```bash
   -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-actual-license-key
   ```
3. If nodes cannot reach `portal.influxdata.com`, use a license file instead:
   ```bash
   -v /path/to/license.json:/etc/influxdb/license.json
   -e INFLUXDB_ENTERPRISE_LICENSE_PATH=/etc/influxdb/license.json
   ```

### Network connectivity issues

#### Problem: Nodes cannot communicate with each other

**Symptoms:**
- Meta nodes fail to join cluster
- Data nodes cannot connect to meta nodes
- `influxd-ctl show` shows missing nodes

**Solution:**
1. Ensure all containers are on the same Docker network:
   ```bash
   docker network create influxdb
   # Add --network=influxdb to all container runs
   ```
2. Use container hostnames consistently:
   ```bash
   # Use hostname (-h) that matches container name
   -h influxdb-meta-0 --name=influxdb-meta-0
   ```
3. Verify network connectivity between containers:
   ```bash
   docker exec influxdb-meta-0 ping influxdb-meta-1
   ```

#### Problem: Cannot access InfluxDB from host machine

**Symptoms:**
- Connection refused when trying to connect to InfluxDB API
- Client tools cannot reach the database

**Solution:**
Expose the HTTP API port (8086) when starting data nodes:
```bash
docker run -d \
  --name=influxdb-data-0 \
  --network=influxdb \
  -h influxdb-data-0 \
  -p 8086:8086 \
  -e INFLUXDB_ENTERPRISE_LICENSE_KEY=your-license-key \
  influxdb:data
```

### Configuration issues

#### Problem: Custom configuration not being applied

**Symptoms:**
- Environment variables ignored
- Configuration file changes not taking effect

**Solution:**
1. For environment variables, use the correct format `INFLUXDB_$SECTION_$NAME`:
   ```bash
   # Correct
   -e INFLUXDB_REPORTING_DISABLED=true
   -e INFLUXDB_META_DIR=/custom/meta/dir
   
   # Incorrect
   -e REPORTING_DISABLED=true
   ```

2. For configuration files, ensure proper mounting:
   ```bash
   # Mount config file correctly
   -v /host/path/influxdb.conf:/etc/influxdb/influxdb.conf
   ```

3. Verify file permissions on mounted configuration files:
   ```bash
   # Config files should be readable by influxdb user (uid 1000)
   chown 1000:1000 /host/path/influxdb.conf
   chmod 644 /host/path/influxdb.conf
   ```

### Data persistence issues

#### Problem: Data lost when container restarts

**Symptoms:**
- Databases and data disappear after container restart
- Cluster state not preserved

**Solution:**
Mount data directories as volumes:
```bash
# For meta nodes
-v influxdb-meta-0-data:/var/lib/influxdb

# For data nodes
-v influxdb-data-0-data:/var/lib/influxdb
```

### Resource and performance issues

#### Problem: Containers running out of memory

**Symptoms:**
- Containers being killed by Docker
- OOMKilled status in `docker ps`

**Solution:**
1. Increase memory limits:
   ```bash
   --memory=4g --memory-swap=8g
   ```

2. Monitor memory usage:
   ```bash
   docker stats influxdb-data-0
   ```

3. Optimize InfluxDB configuration for available resources.

#### Problem: Poor performance in containerized environment

**Solution:**
1. Ensure adequate CPU and memory allocation
2. Use appropriate Docker storage drivers
3. Consider host networking for high-throughput scenarios:
   ```bash
   --network=host
   ```

## Debugging commands

### Check container logs
```bash
# View container logs
docker logs influxdb-meta-0
docker logs influxdb-data-0

# Follow logs in real-time
docker logs -f influxdb-meta-0
```

### Verify cluster status
```bash
# Check cluster status from any meta node
docker exec influxdb-meta-0 influxd-ctl show

# Check individual node status
docker exec influxdb-meta-0 influxd-ctl show-shards
```

### Network troubleshooting
```bash
# Test connectivity between containers
docker exec influxdb-meta-0 ping influxdb-data-0
docker exec influxdb-meta-0 telnet influxdb-data-0 8088

# Check which ports are listening
docker exec influxdb-meta-0 netstat -tlnp
```

### Configuration verification
```bash
# Check effective configuration
docker exec influxdb-meta-0 cat /etc/influxdb/influxdb-meta.conf
docker exec influxdb-data-0 cat /etc/influxdb/influxdb.conf

# Verify environment variables
docker exec influxdb-meta-0 env | grep INFLUXDB
```

## Best practices for Docker deployments

1. **Use specific image tags** instead of `latest` for production deployments
2. **Implement health checks** to monitor container status
3. **Use Docker Compose** for complex multi-container setups
4. **Mount volumes** for data persistence
5. **Set resource limits** to prevent resource exhaustion
6. **Use secrets management** for license keys in production
7. **Implement proper logging** and monitoring
8. **Regular backups** of data volumes

## Getting additional help

If you continue to experience issues:

1. Check the [general troubleshooting guide](/enterprise_influxdb/v1/troubleshooting/)
2. Review [InfluxDB Enterprise logs](/enterprise_influxdb/v1/administration/monitor/logs/)
3. Contact [InfluxData support](https://support.influxdata.com/) with:
   - Docker version and configuration
   - Container logs
   - Cluster status output
   - Network configuration details
