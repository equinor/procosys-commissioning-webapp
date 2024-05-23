# build environment
FROM node:20.0.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM nginxinc/nginx-unprivileged

## add permissions for nginx user
COPY --from=build /app/dist /usr/share/nginx/html/comm
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/
 
# Change the user from root to non-root- From now on, all Docker commands are run as non-root user (except for COPY)
USER 0
RUN chown -R apprunner.apprunner /usr/share/nginx/html/comm \
    && chown -R apprunner:apprunner /etc/nginx/conf.d
USER 101

EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]