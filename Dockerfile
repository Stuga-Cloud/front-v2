FROM node:16-alpine as build-stage
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build
#CMD while true; do echo "Hello world!"; sleep 5; done && tail -f /dev/null

FROM node:16-alpine as production-stage

WORKDIR /app

COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/package*.json ./

EXPOSE 3000

CMD npm run start
