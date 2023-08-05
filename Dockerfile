# cache dependencies
FROM node:20-slim as node_cache
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

# build and start
FROM node:20-slim as build
ARG ENV=production
ENV NEXT_PUBLIC_ENV=$ENV
WORKDIR /web
COPY --from=node_cache /cache/ .
COPY . .
RUN printf "NEXT_PUBLIC_ENV=${ENV}" >> .env
RUN npm run build
ENTRYPOINT [ "npm", "start" ]
