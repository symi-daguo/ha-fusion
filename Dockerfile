# Use alpine for both stages
FROM node:22.12.0-alpine AS builder
WORKDIR /app

# Install build dependencies and configure npm
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories && \
    apk add --no-cache python3 make g++ && \
    npm config set registry https://registry.npmmirror.com/

# copy package files first for better caching
COPY package*.json ./
RUN npm install

# copy all other files
COPY . .

# build
RUN npm run build

# second stage
FROM node:22.12.0-alpine
WORKDIR /app

# Install production dependencies and configure npm
RUN npm config set registry https://registry.npmmirror.com/

# copy necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./

# Create data directory with correct permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app/data

# install production dependencies
RUN npm install --production

# set environment
ENV PORT=5050 \
    NODE_ENV=production \
    ADDON=false \
    HASS_URL=http://homeassistant:8123 \
    TZ=Asia/Shanghai \
    HOST=0.0.0.0

# Switch to non-root user
USER node

EXPOSE 5050

# start the app
CMD ["node", "server.js"]
