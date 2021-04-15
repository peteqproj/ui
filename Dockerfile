FROM node:lts-alpine3.12 AS dev

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g create-react-app

COPY ./package.json yarn.lock /app/

RUN yarn --silent

COPY . /app

ARG REACT_APP_API

RUN yarn build

EXPOSE 80

CMD [ "yarn", "run", "start:prod" ]