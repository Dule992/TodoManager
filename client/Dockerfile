FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm cache verify && npm install --force

COPY . .

EXPOSE 5173

CMD ["npm","run","dev"]
