FROM node:18.7.0-slim as base

WORKDIR /frontend

COPY . .

RUN yarn
RUN yarn run build

CMD yarn start
