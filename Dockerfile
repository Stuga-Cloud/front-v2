FROM node:16-alpine as build-stage

WORKDIR /frontend

COPY package*.json ./

COPY . .

RUN npm install

CMD npm run build

FROM node:16-alpine as production-stage

WORKDIR /app
COPY --from=builder /frontend ./

EXPOSE 80

CMD npm run start
