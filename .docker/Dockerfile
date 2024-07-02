# build environment
FROM node:22 as build
WORKDIR /app
COPY . /app
RUN yarn install

RUN yarn test

RUN yarn build --mode=production

# production environment
FROM nginx:1.21.6-alpine
## add permissions for nginx user
RUN apk add python3
COPY --from=build /app/dist /usr/share/nginx/html/comm
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/
EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]
