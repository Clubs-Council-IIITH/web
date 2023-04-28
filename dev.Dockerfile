# build and start
FROM node:18-slim as build
WORKDIR /web
RUN npm install --prefer-offline --no-audit --progress=false
ENTRYPOINT [ "npm", "run", "dev" ]
