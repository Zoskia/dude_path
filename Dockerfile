FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY content.js .

EXPOSE 23000

CMD ["node", "app.js"]
