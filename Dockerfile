FROM node:18.17.1

WORKDIR /app

COPY package*.json ./

COPY . ./

RUN npm install

RUN  npm run build

ENV PORT=80

EXPOSE 80

CMD [ "npm", "run", "start"]