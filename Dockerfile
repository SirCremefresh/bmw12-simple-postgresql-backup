FROM node:14-alpine as builder
LABEL maintainer="donato@wolfisberg.dev"
WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci \
    && apk --update add postgresql-client

COPY ./  ./

CMD [ "node", "index.js" ]
