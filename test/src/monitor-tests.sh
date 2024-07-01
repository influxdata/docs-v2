function start {
  ./test/src/monitor-container-urls.sh & echo $! > ./test/monitor_urls_pid
}

function kill_process {
  PID=$(cat ./test/monitor_urls_pid) && kill -9 $PID && rm ./test/monitor_urls_pid
}

case "$1" in
  start) start ;;
  kill) kill_process ;;
  *) echo "Usage: $0 {start|kill}" ;;
esac