FROM node:14

WORKDIR /app

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y git build-essential

COPY ./ /app
RUN npm install

EXPOSE 3100

CMD ["sh", "/app/entrypoint-dev.sh"]
