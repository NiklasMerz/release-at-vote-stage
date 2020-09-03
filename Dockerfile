FROM node:alpine

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/src/main.js"]
