# cache dependencies
FROM node:20-slim as node_cache
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=false

# build and start
FROM node:20-slim as build
WORKDIR /web
COPY --from=node_cache /cache/ .
COPY . .
RUN npm run build
ENTRYPOINT [ "npm", "start" ]
