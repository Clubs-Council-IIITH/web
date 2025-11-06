#!/bin/bash

# Copy node_modules from cache to the volume
echo "Copying node_modules from cache to volume..."
cp -r /cache/node_modules /web/

# Execute the container's main process
exec "$@"