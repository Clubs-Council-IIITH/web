# cache dependencies
FROM node:20-slim AS node_cache
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

# build and start
FROM node:20-slim as build
ARG ENV=development
ENV NEXT_PUBLIC_ENV=$ENV
WORKDIR /web

COPY --from=node_cache /cache/ /cache/
COPY dev.entrypoint.sh /cache/
RUN chmod +x /cache/dev.entrypoint.sh

RUN printf "NEXT_PUBLIC_ENV=${ENV}" >> .env
ENTRYPOINT [ "/cache/dev.entrypoint.sh" ]