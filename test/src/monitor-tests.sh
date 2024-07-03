pid_file=./test/monitor_urls_pid
function start {
  ./test/src/monitor-container-urls.sh & echo $! >> "$pid_file"
}

function kill_processes {
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

case "$1" in
  start) start ;;
  stop) kill_processes ;;
  *) echo "Usage: $0 {start|stop}" ;;
esac