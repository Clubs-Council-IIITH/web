# build and start
FROM node:18-slim as build
WORKDIR /web
RUN yarn
ENTRYPOINT [ "npm", "run", "dev" ]
