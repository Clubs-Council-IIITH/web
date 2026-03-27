# development dependencies
FROM node:22-slim AS dev_dep
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose

# production dependencies
FROM node:22-slim AS prod_dep
WORKDIR /cache/
COPY package*.json .
RUN npm install --prefer-offline --no-audit --progress=true --loglevel verbose --omit=dev

# development stage
FROM node:22-slim AS dev
ENV NEXT_PUBLIC_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /web

COPY --from=dev_dep /cache/ /cache/
COPY entrypoint.sh /cache/

RUN chmod +x /cache/entrypoint.sh

ENTRYPOINT [ "/cache/entrypoint.sh" ]
CMD [ "npm", "run", "dev" ]

# production build stage
FROM node:22-slim AS prod-build
ENV NEXT_PUBLIC_ENV=production
ENV NEXT_TELEMETRY_DISABLED=0

WORKDIR /web

COPY --from=prod_dep /cache/node_modules ./node_modules
COPY . .

RUN npm run build

# production stage
FROM prod-build AS prod
ENV NEXT_PUBLIC_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /web

COPY --from=prod-build /web/.next ./.next
COPY --from=prod-build /web/public ./public
COPY --from=prod-build /web/next.config.js ./next.config.js
COPY --from=prod-build /web/node_modules ./node_modules
COPY --from=prod-build /web/package.json ./package.json

# RUN chown -R node:node /web
# USER node

ENTRYPOINT [ "npm", "start" ]