#!/bin/bash

REPO=$1
USERNAME=$2
TOKEN=$3

if [ $# -eq 0 ]; then
    repos=(
        "dayiri-admin"
        "dayiri-backend"    
    )
    echo "Updating all project directories by pulling the latest code..."
    for repo in "${repos[@]}"; do
        echo "Updating $repo repo directory by pulling latest code..."
        cd "$repo" && git pull origin main
        cd ..
    done
else
    if [ "$1" == "dayiri-backend" ]; then
        echo "Updating $1 repo directory by pulling latest code..."
        cd /root/dayiri/dayiri-backend && git pull https://$USERNAME:$TOKEN@gitlab.com/roomey_rahman/dayiri-backend.git main      
    elif [ "$1" == "dayiri-admin" ]; then
        echo "Updating $1 repo directory by pulling latest code..."
        cd /root/dayiri/dayiri-admin && git pull https://$USERNAME:$TOKEN@gitlab.com/roomey_rahman/dayiri-admin.git main
    fi
fi
