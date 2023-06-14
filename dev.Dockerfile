# build and start
FROM node:20-slim as build
WORKDIR /web
RUN yarn
ENTRYPOINT [ "npm", "run", "dev" ]
