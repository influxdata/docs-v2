#!/bin/bash

CONTEXT=$(git rev-parse --show-toplevel)

function start() {
  pid_file=$1
  $CONTEXT/test/scripts/monitor-container-urls.sh & echo $! >> "$pid_file"
}

function kill_processes() {
  pid_file=$1
  # Kill all processes in the monitor_urls_pid file
  echo "Cleaning up monitor-container-urls processes..."
  while read -r PID; do
    kill $PID 2>/dev/null; ps -p $PID > /dev/null
    if [ $? -ne 0 ]; then
      sed -i '' "/$PID/d" "$pid_file"
      echo "Successfully stopped monitor-container-urls process $PID"
    else
      # Leave it in the file to try stopping it again next time
      # and output the error message
      echo "Failed to stop monitor-container-urls process $PID"
    fi
  done < "$pid_file"
}

function get_pid_path() {
  TMP_DIR="${CONTEXT}/test/tmp"
  mkdir -p $TMP_DIR
  echo "${TMP_DIR}/_${1}_monitor_urls_pid"
}

case "$1" in
  start)
    test_name=$2
    start "$(get_pid_path $test_name)"
    ;;
  stop)
    test_name=$2
    kill_processes "$(get_pid_path $test_name)"
    ;;
  *) echo "Usage: $0 {start TEST_NAME|stop TEST_NAME}" ;;
esac
