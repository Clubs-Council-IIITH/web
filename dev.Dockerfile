# build and start
FROM node:20-slim as build
ARG ENV=development
ENV NEXT_PUBLIC_ENV=$ENV
WORKDIR /web
RUN printf "NEXT_PUBLIC_ENV=${ENV}" >> .env
ENTRYPOINT [ "npm", "run", "dev" ]
