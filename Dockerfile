# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN apk add --update --no-cache make gcc g++ python3 && ln -sf python3 /usr/bin/python
RUN npm install -g pnpm
RUN pnpm install --prod

COPY . .

CMD ["node", "src/index.js"]