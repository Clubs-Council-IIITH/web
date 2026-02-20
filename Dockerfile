# cache dependencies
FROM node:22-slim AS node_cache
WORKDIR /cache/
COPY package*.json .

# development dependencies
FROM node_cache AS dev_dep
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose

# production dependencies
FROM node_cache AS prod_dep
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

# development stage
FROM node:22-slim AS dev
ARG ENV=development
ENV NEXT_PUBLIC_ENV=$ENV
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /web

COPY --from=dev_dep /cache/ /cache/
COPY entrypoint.sh /cache/

RUN chmod +x /cache/entrypoint.sh

ENTRYPOINT [ "/cache/entrypoint.sh" ]
CMD [ "npm", "run", "dev" ]

# production stage
FROM node:22-slim AS prod
ARG ENV=production
ENV NEXT_PUBLIC_ENV=$ENV

WORKDIR /web

COPY --from=prod_dep /cache/node_modules ./node_modules
COPY entrypoint.sh /cache/
COPY . .

RUN chmod +x /cache/entrypoint.sh
RUN npm run build

ENTRYPOINT [ "/cache/entrypoint.sh" ]
CMD [ "npm", "start" ]