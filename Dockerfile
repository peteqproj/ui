FROM node:14.14.0-alpine3.12 AS dev

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g create-react-app

COPY ./package.json yarn.lock /app/

RUN yarn --silent

COPY . /app

RUN yarn build

FROM nginx:1.17.8-alpine

COPY --from=dev /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

# APP_API should point to the api

CMD ["nginx", "-g", "daemon off;"]