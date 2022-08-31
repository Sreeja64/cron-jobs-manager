FROM node:14.17.3

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd /app/client && npm install && npm run build && npm run generate && mv dist/ ../

EXPOSE 3000

RUN mkdir -p /var/lib/db && chmod 777 /var/lib/db

CMD ["npm", "run", "start"]