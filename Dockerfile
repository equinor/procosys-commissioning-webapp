
# Create non-root user. Set ui to 9999 to avoid conflicts with host OS just in case
RUN adduser --disabled-password --uid 9999 --gecos "" apprunner
 
# Create the folder and set the non-root as owner
RUN mkdir /app && chown apprunner.apprunner /app
 
# Change the user from root to non-root- From now on, all Docker commands are run as non-root user (except for COPY)
USER 9999

# build environment
FROM node:16.13.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM nginx:1.21.6-alpine
## add permissions for nginx user
RUN apk add python3
COPY --from=build /app/build /usr/share/nginx/html/comm
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/
EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]