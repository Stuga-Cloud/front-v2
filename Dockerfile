# FROM node:16-alpine as build-stage
FROM node:16-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .


ENV NEXT_PUBLIC_GATEWAY_URL_ACCESS=https://faas.stuga-cloud.tech
ENV NEXT_PUBLIC_BASE_REGISTRY_ENDPOINT=registry-cloud.machavoine.fr
ENV NEXT_PUBLIC_BASE_CONTAINER_DOMAIN=hive.williamquach.fr
ENV NEXT_PUBLIC_DOCKER_HUB_URL=https://hub.docker.com/
ENV NEXT_PUBLIC_PRIVATE_REGISTRY_URL=https://registry-cloud.machavoine.fr/

RUN npm run build
#CMD while true; do echo "Hello world!"; sleep 5; done && tail -f /dev/null

EXPOSE 3000

CMD npm run start

# FROM node:16-alpine as production-stage

# WORKDIR /app

# COPY --from=build-stage /app/node_modules ./node_modules
# COPY --from=build-stage /app/.next ./.next
# COPY --from=build-stage /app/public ./public
# COPY --from=build-stage /app/package*.json ./

# EXPOSE 3000

# CMD npm run start
