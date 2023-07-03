FROM node:16-alpine

WORKDIR /frontend

COPY package*.json ./

COPY . .

RUN npm install

CMD npm run build


EXPOSE 3000

CMD npm run dev
