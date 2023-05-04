# syntax=docker/dockerfile:1

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]

RUN apk add --update --no-cache make gcc g++ python3
RUN npm ci --omit=dev
RUN apk del make gcc g++ python3

COPY . .

CMD ["node", "src/index.js"]