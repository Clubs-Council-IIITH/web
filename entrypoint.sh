#!/bin/bash

# Copy node_modules from cache to the volume if it's empty or doesn't exist
if [ ! -d "/web/node_modules" ] || [ -z "$(ls -A /web/node_modules 2>/dev/null)" ]; then
    echo "Copying node_modules from cache to volume..."
    cp -r /cache/node_modules /web/
fi

# Execute the container's main process
exec "$@"