# ha-fusion

[English](#ha-fusion-en) | 简体中文

一个现代化、易用且高性能的 [Home Assistant](https://www.home-assistant.io/) 自定义仪表盘

## 功能特点

- 🚀 高性能，快速响应
- 🎨 美观的界面设计
- 📱 完美支持移动端
- 🌐 多语言支持
- 🎮 全屏显示模式
- 🛠️ 丰富的自定义选项

## 安装

### 插件方式

1. 在 Home Assistant 中添加自定义存储库:
   ```
   https://github.com/symi-daguo/ha-fusion
   ```

2. 在 Home Assistant 的加载项商店中安装 "ha-fusion"

### Docker 方式

1. **快速启动**
   ```bash
   docker run -d \
     --name ha-fusion \
     -p 5050:5050 \
     -e HASS_URL=http://YOUR_HASS_IP:8123 \
     -v ${PWD}/data:/app/data \
     --restart always \
     ghcr.io/symi-daguo/ha-fusion:latest
   ```

2. **使用 docker-compose**
   ```yaml
   version: '3'
   services:
     ha-fusion:
       container_name: ha-fusion
       image: ghcr.io/symi-daguo/ha-fusion:latest
       ports:
         - "5050:5050"
       volumes:
         - ./data:/app/data
       environment:
         - TZ=Asia/Shanghai
         - HASS_URL=http://YOUR_HASS_IP:8123
       restart: always
   ```

   保存为 `docker-compose.yml` 后运行:
   ```bash
   docker-compose up -d
   ```

## 更新日志

### v2024.12.5
- ✨ 新增全屏显示功能
- 🌐 优化中文本地化支持
- 🔄 移除 YouTube 功能以提升国内用户体验
- 📝 更新文档支持中英双语

## 开发指南

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 本地开发
1. 克隆仓库
```bash
git clone https://github.com/symi-daguo/ha-fusion.git
cd ha-fusion
```

2. 安装依赖
```bash
pnpm install
```

3. 创建环境配置
```bash
cp .env.example .env
```
编辑 `.env` 文件，设置您的 Home Assistant URL

4. 启动开发服务器
```bash
pnpm run dev
```

### Docker 开发
1. 构建镜像
```bash
docker build -t ha-fusion .
```

2. 运行容器
```bash
docker run -d \
  --name ha-fusion \
  -p 5050:5050 \
  -e HASS_URL=http://YOUR_HASS_IP:8123 \
  -v ${PWD}/data:/app/data \
  --restart always \
  ha-fusion
```

<h1 id="ha-fusion-en">ha-fusion</h1>

A modern, user-friendly, and high-performance custom dashboard for [Home Assistant](https://www.home-assistant.io/)

## Features

- 🚀 High Performance
- 🎨 Beautiful UI Design
- 📱 Mobile-Friendly
- 🌐 Multi-language Support
- 🎮 Fullscreen Mode
- 🛠️ Rich Customization Options

## Installation

### Add-on Method

1. Add custom repository in Home Assistant:
   ```
   https://github.com/symi-daguo/ha-fusion
   ```

2. Install "ha-fusion" from the Home Assistant add-on store

### Docker Method

1. **Quick Start**
   ```bash
   docker run -d \
     --name ha-fusion \
     -p 5050:5050 \
     -e HASS_URL=http://YOUR_HASS_IP:8123 \
     -v ${PWD}/data:/app/data \
     --restart always \
     ghcr.io/symi-daguo/ha-fusion:latest
   ```

2. **Using docker-compose**
   ```yaml
   version: '3'
   services:
     ha-fusion:
       container_name: ha-fusion
       image: ghcr.io/symi-daguo/ha-fusion:latest
       ports:
         - "5050:5050"
       volumes:
         - ./data:/app/data
       environment:
         - TZ=Asia/Shanghai
         - HASS_URL=http://YOUR_HASS_IP:8123
       restart: always
   ```

   Save as `docker-compose.yml` and run:
   ```bash
   docker-compose up -d
   ```

## Changelog

### v2024.12.5
- ✨ Added fullscreen display feature
- 🌐 Optimized Chinese localization
- 🔄 Removed YouTube feature to enhance domestic user experience
- 📝 Updated documentation with bilingual support

## Development Guide

### Requirements
- Node.js >= 18
- pnpm >= 8

### Local Development
1. Clone repository
```bash
git clone https://github.com/symi-daguo/ha-fusion.git
cd ha-fusion
```

2. Install dependencies
```bash
pnpm install
```

3. Create environment configuration
```bash
cp .env.example .env
```
Edit `.env` file to set your Home Assistant URL

4. Start development server
```bash
pnpm run dev
```

### Docker Development
1. Build image
```bash
docker build -t ha-fusion .
```

2. Run container
```bash
docker run -d \
  --name ha-fusion \
  -p 5050:5050 \
  -e HASS_URL=http://YOUR_HASS_IP:8123 \
  -v ${PWD}/data:/app/data \
  --restart always \
  ha-fusion
```
