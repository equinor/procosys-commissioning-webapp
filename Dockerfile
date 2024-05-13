# build environment
FROM node:20.0.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM nginx:1.21.6-alpine
## add permissions for nginx user
RUN apk add python3
COPY --from=build /app/dist /usr/share/nginx/html/comm
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/

# Create non-root user. Set ui to 9999 to avoid conflicts with host OS just in case
RUN adduser --disabled-password --uid 9999 --gecos "" apprunner
 
#Set the non-root as owner
RUN chown -R apprunner.apprunner /comm \
    && chown -R apprunner:apprunner /etc/nginx/conf.d
 
# Change the user from root to non-root- From now on, all Docker commands are run as non-root user (except for COPY)
USER 9999

EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]


