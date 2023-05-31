# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:18-slim as build-stage

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y
RUN npm install -g pnpm

WORKDIR /app
COPY ./nginx.conf /nginx.conf
COPY package*.json /app/

RUN pnpm install

COPY ./ /app/
RUN pnpm build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# Note it leaves out almost everything from build stage, making a MUCH smaller final container
FROM nginx:alpine
EXPOSE 80
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy Nginx config
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

