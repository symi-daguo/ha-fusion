# Use alpine for both stages
FROM node:22.12.0-alpine AS builder
WORKDIR /app

# Install build dependencies
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache python3 make g++

# copy package files first for better caching
COPY package*.json ./
RUN npm ci

# copy all other files
COPY . .

# build
RUN npm run build

# second stage
FROM node:22.12.0-alpine
WORKDIR /app

# copy necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./

# install production dependencies
RUN npm ci --only=production

# set environment
ENV PORT=5050 \
    NODE_ENV=production \
    ADDON=false \
    HASS_URL=http://homeassistant:8123 \
    TZ=Asia/Shanghai \
    HOST=0.0.0.0

EXPOSE 5050

# start the app
CMD ["node", "server.js"]
