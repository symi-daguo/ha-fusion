# first stage, can't use alpine for building armv7
FROM node:22 AS builder
WORKDIR /app

# copy all files
COPY . .

# install dependencies and build
RUN npm install && \
    npm run build

# second stage
FROM node:22-alpine
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
