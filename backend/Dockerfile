FROM node:latest
WORKDIR /app

COPY index.js /app/index.js
COPY package.json /app/package.json

EXPOSE 8000/tcp
EXPOSE 8080/tcp

RUN npm install
CMD npm start
