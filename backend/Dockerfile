FROM node:18

RUN npm install -g pnpm

WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .
EXPOSE 8080
ENV ADDRESS=0.0.0.0 PORT=8080 DB_HOST=postgres DB_PORT=5432 DB_NAME=doggr DB_USER=doggr DB_PASS=doggr PASSWORD=password NODE_ENV=development

RUN pnpm build

#!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#NOTE WE CANNOT DO {RUN pnpm db:reset} HERE BECAUSE DOCKER WILL NOT CONNECT THE NETWORK AT BUILD TIME!
#RUN pnpm db:reset

CMD ["pnpm", "startProd"]
