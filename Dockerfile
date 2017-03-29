FROM node:argon

RUN mkdir /app
RUN mkdir /logs

WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
EXPOSE 3005

VOLUME /data/db

CMD [ "npm", "start"]
