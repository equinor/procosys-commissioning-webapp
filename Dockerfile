# build environment
FROM node:22 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM docker.io/nginxinc/nginx-unprivileged:alpine
USER 0
## add permissions for nginx user
RUN apk add python3
WORKDIR /comm

## add permissions for nginx user
COPY --from=build /app/dist /usr/share/nginx/html/comm
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/

RUN adduser --disabled-password --uid 9999 --gecos "" apprunner

#Set the non-root as owner
RUN chown -R apprunner.apprunner /usr/share/nginx/html/comm \
    && chown -R apprunner:apprunner /etc/nginx/conf.d

# Change the user from root to non-root- From now on, all Docker commands are run as non-root user (except for COPY)
USER 9999

EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]
