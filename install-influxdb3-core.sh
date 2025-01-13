#!/bin/sh -e

ARCHITECTURE=$(uname -m)
ARTIFACT=""
OS=""
INSTALL_LOC=~/.influxdb
BINARY_NAME="influxdb3"
PORT=8181


### OS AND ARCHITECTURE DETECTION ###
case "$(uname -s)" in
    Linux*)     OS="Linux";;
    Darwin*)    OS="Darwin";;
    *)         OS="UNKNOWN";;
esac

if [ "${OS}" = "Linux" ]; then
    if [ "${ARCHITECTURE}" = "x86_64" -o "${ARCHITECTURE}" = "amd64" ]; then
        # Check if we're on a GNU/Linux system, otherwise default to musl
        if ldd --version 2>&1 | grep -q "GNU"; then
            ARTIFACT="x86_64-unknown-linux-gnu"
        else
            ARTIFACT="x86_64-unknown-linux-musl"
        fi
    elif [ "${ARCHITECTURE}" = "aarch64" -o "${ARCHITECTURE}" = "arm64" ]; then
        if ldd --version 2>&1 | grep -q "GNU"; then
            ARTIFACT="aarch64-unknown-linux-gnu"
        else
            ARTIFACT="aarch64-unknown-linux-musl"
        fi
    fi
elif [ "${OS}" = "Darwin" ]; then
    ARTIFACT="aarch64-apple-darwin"
fi

# Exit if unsupported system
[ -n "${ARTIFACT}" ] || { echo "Unfortunately this script doesn't support your '${OS}' | '${ARCHITECTURE}' setup."; exit 1; }



### INSTALLATION ###

URL="https://dl.influxdata.com/influxdb/snapshots/influxdb3-edge_${ARTIFACT}.tar.gz"
START_TIME=$(date +%s)

# Clear screen and show welcome message
clear
echo "┌───────────────────────────────────────────────────┐"
echo "│ \033[1mWelcome to InfluxDB 3 Core!\033[0m                       │"
echo "│                                                   │"
echo "│ We'll make this quick. Beginning installation...  │"
echo "└───────────────────────────────────────────────────┘"
echo 

echo "\033[1mDownloading InfluxDB to $INSTALL_LOC\033[0m"
echo "├─\033[2m mkdir -p "$INSTALL_LOC"\033[0m"
mkdir -p "$INSTALL_LOC"
echo "└─\033[2m curl -sS "${URL}" -o "$INSTALL_LOC/influxdb3.tar.gz"\033[0m"
curl -sS "${URL}" -o "$INSTALL_LOC/influxdb3.tar.gz"
echo 

echo "\033[1mExtracting and Processing\033[0m"
echo "├─\033[2m tar -xf "$INSTALL_LOC/influxdb3.tar.gz" -C "$INSTALL_LOC"\033[0m"
tar -xf "$INSTALL_LOC/influxdb3.tar.gz" -C "$INSTALL_LOC"
echo "└─\033[2m rm "$INSTALL_LOC/influxdb3.tar.gz"\033[0m"
rm "$INSTALL_LOC/influxdb3.tar.gz"

if ! grep -q "export PATH=.*$INSTALL_LOC" ~/.$(basename "$SHELL")rc; then
    echo
    echo "\033[1mAdding InfluxDB to "~/.$(basename "$SHELL")rc"\033[0m"
    echo "└─\033[2m export PATH=\$PATH:"$INSTALL_LOC/" >> "~/.$(basename "$SHELL")rc"\033[0m"
    echo "export PATH=\$PATH:$INSTALL_LOC/" >> ~/.$(basename "$SHELL")rc
fi
echo 

read -p "Start InfluxDB Now? (y/n): " START_SERVICE
echo "──────────────"
if [[ $START_SERVICE =~ ^[Yy]$ ]]; then
    # Prompt for Host ID
    echo 
    echo "\033[1mEnter Your Host ID\033[0m"  
    echo "A Host ID is a unique, uneditable identifier for a service."
    echo 
    read -p "Enter a Host ID (default: host0): " HOST_ID
    HOST_ID=${HOST_ID:-host0}

    # Prompt for storage solution
    echo
    echo
    echo "\033[1mSelect Your Storage Solution\033[0m"
    echo "1) In-memory storage (Fastest, data cleared on restart)"
    echo "2) File storage (Persistent local storage)"
    echo "3) Object storage (Cloud-compatible storage)"
    echo 
    read -p "Enter your choice (1-3): " STORAGE_CHOICE

    case $STORAGE_CHOICE in
        1)
            STORAGE_TYPE="memory"
            STORAGE_FLAGS="--object-store=memory"
            ;;
        2)
            STORAGE_TYPE="File Storage"
            echo
            read -p "Enter storage path (default: ${INSTALL_LOC}/data): " STORAGE_PATH
            STORAGE_PATH=${STORAGE_PATH:-"${INSTALL_LOC}/data"}
            STORAGE_FLAGS="--object-store=file --data-dir ${STORAGE_PATH}"
            ;;
        3)
            STORAGE_TYPE="Object Storage"
            echo
            echo "\033[1mSelect Cloud Provider\033[0m"
            echo "│ "
            echo "│ 1) Amazon S3"
            echo "│ 2) Azure Storage"
            echo "│ 3) Google Cloud Storage"
            echo "│ "
            read -p "└─ Enter your choice (1-3): " CLOUD_CHOICE

            case $CLOUD_CHOICE in
                1)  # AWS S3
                    echo
                    echo "\033[1mAWS S3 Configuration\033[0m"
                    echo "│"
                    read -p "├─ Enter AWS Access Key ID: " AWS_KEY
                    read -s -p "├─ Enter AWS Secret Access Key: " AWS_SECRET
                    echo
                    read -p "├─ Enter S3 Bucket: " AWS_BUCKET
                    read -p "└─ Enter AWS Region (default: us-east-1): " AWS_REGION
                    AWS_REGION=${AWS_REGION:-"us-east-1"}
                    
                    STORAGE_FLAGS="--object-store=s3 --aws-access-key-id=${AWS_KEY} --aws-secret-access-key=${AWS_SECRET} --bucket=${AWS_BUCKET}"
                    if [ ! -z "$AWS_REGION" ]; then
                        STORAGE_FLAGS="$STORAGE_FLAGS --aws-default-region=${AWS_REGION}"
                    fi
                    ;;
                    
                2)  # Azure Storage
                    echo
                    echo "\033[1mAzure Storage Configuration\033[0m"
                    read -p "├─ Enter Storage Account Name: " AZURE_ACCOUNT
                    read -s -p "└─ Enter Storage Access Key: " AZURE_KEY
                    echo
                    
                    STORAGE_FLAGS="--object-store=azure --azure-storage-account=${AZURE_ACCOUNT} --azure-storage-access-key=${AZURE_KEY}"
                    ;;
                    
                3)  # Google Cloud Storage
                    echo
                    echo "\033[1mGoogle Cloud Storage Configuration\033[0m"
                    read -p "└─ Enter path to service account JSON file: " GOOGLE_SA
                    
                    STORAGE_FLAGS="--object-store=gcs --google-service-account=${GOOGLE_SA}"
                    ;;
                    
                *)
                    echo "Invalid cloud provider choice. Defaulting to file storage."
                    STORAGE_TYPE="File Storage"
                    STORAGE_FLAGS="--object-store=file --data-dir ${INSTALL_LOC}/data"
                    ;;
            esac
            ;;
            
        *)
            echo "Invalid choice. Defaulting to in-memory."
            STORAGE_TYPE="Memory"
            STORAGE_FLAGS="--object-store=memory"
            ;;
    esac

    # Ensure port is available; if not, find a new one
    while lsof -i:"$PORT" -t >/dev/null 2>&1; do
        echo "├─\033[2m Port $PORT is in use. Finding new port.\033[0m"
        PORT=$((RANDOM + 1024))
        if ! lsof -i:"$PORT" -t >/dev/null 2>&1; then
            echo "└─\033[2m Found an available port: $PORT\033[0m"
            break
        fi
    done

    # Start and give up to 30 seconds to respond
    echo
    echo "\033[1mStarting InfluxDB\033[0m"
    echo "├─\033[2m Host ID: $HOST_ID\033[0m"
    echo "├─\033[2m Storage: $STORAGE_TYPE\033[0m"
    echo "├─\033[2m \"$INSTALL_LOC/$BINARY_NAME\" serve --host-id=$HOST_ID --http-bind=\"0.0.0.0:$PORT\" $STORAGE_FLAGS\033[0m"
    "$INSTALL_LOC/$BINARY_NAME" serve --host-id=$HOST_ID --http-bind="0.0.0.0:$PORT" $STORAGE_FLAGS > /dev/null 2>&1 &
    PID=$!

    SUCCESS=0
    for i in $(seq 1 30); do
        if kill -0 $PID 2>/dev/null && curl -s "http://localhost:$PORT/health" >/dev/null 2>&1; then
            echo "└─\033[1;32m ✓ InfluxDB is now installed and running on port $PORT. Nice!\033[0m"
            SUCCESS=1
            break
        fi
        sleep 1
    done

    if [ $SUCCESS -eq 0 ]; then
        echo "└─\033[1m ERROR: InfluxDB failed to start on port $PORT; check permissions or other potential issues.\033[0m"
        exit 1
    fi
else
    echo "Installation complete. Run \033[1msource ~/.$(basename "$SHELL")rc\033[0m, then access InfluxDB 3 Core with \033[1minfluxdb3\033[0m commands."
    exit 0
fi


### SUCCESS INFORMATION ###
echo 
echo "\033[1mFurther Info\033[0m"
echo "├─ Run \033[1msource ~/.$(basename "$SHELL")rc\033[0m, then access InfluxDB 3 Core with \033[1minfluxdb3\033[0m commands."
echo "├─ View documentation at \033[4;94mhttps://docs.influxdata.com/\033[0m."
echo "└─ Visit \033[4;94mhttps://www.influxdata.com/community/\033[0m for additional guidance."
echo 

END_TIME=$(date +%s) 
DURATION=$((END_TIME - START_TIME))

echo "┌───────────────────────────────────────────────────┐"
echo "│ Time is everything. This process took $DURATION seconds. │"
echo "└───────────────────────────────────────────────────┘"
