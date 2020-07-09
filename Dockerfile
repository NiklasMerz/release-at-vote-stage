FROM node:slim

COPY . .

RUN npm install --production

ENTRYPOINT ["node", "/src/main.js"]
