FROM node:21.5.0

ENV TZ Asia/Tokyo

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

RUN npm run build
# CMD ["npm", "run", "dev", "-p", "4000"]に変更
CMD ["sh", "-c", "while :; do npm run dev -p 4000; done"]
