FROM node:lts-alpine as builder
# Create app directory
WORKDIR /app
# copy package.json
COPY package*.json ./
# Copy app source code
COPY . .

# Install app dependencies
RUN npm install --legacy-peer-deps
RUN npm run build-prod

# nginx state for serving content
FROM nginxinc/nginx-unprivileged
# Set working directory to nginx asset directory
WORKDIR /app
# Copy static assets from builder stage
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
USER 0
RUN chown -R nginx /etc/nginx/conf.d \
    && chown -R nginx /app
USER 101
CMD ["nginx", "-g", "daemon off;"]