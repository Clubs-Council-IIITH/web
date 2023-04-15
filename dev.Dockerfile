# cache dependencies
FROM node:18-slim as node_cache
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=false

# build and start
FROM node:18-slim as build
WORKDIR /web
COPY --from=node_cache /cache/ .
COPY . .
ENTRYPOINT [ "npm", "run", "dev" ]