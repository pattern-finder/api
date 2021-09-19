FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

RUN npm install cookie-parser

COPY . .

RUN npm run build

FROM nginx:1.17.10-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html


RUN echo "react app running on port 80 !"
