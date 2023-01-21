FROM node:18.7.0-slim as base

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm run build

CMD npm start