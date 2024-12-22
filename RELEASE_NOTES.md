# v2024.12.0 - 第一个正式版本

## ✨ 新特性
- 优化中文界面显示和交互体验
- 添加全屏模式支持，可在设置中切换
- 支持 Docker 容器部署
- 支持 Home Assistant 插件安装
- 默认使用中文界面，无需额外配置

## 🔧 主要改进
- 优化构建流程，使用国内镜像源加快构建速度
- 优化数据目录挂载和权限设置
- 更新文档链接指向新仓库
- 完善中文翻译

## 📦 安装方式

### 1. Docker Compose

```yaml
version: '3'
services:
  ha-fusion:
    image: ghcr.io/symi-daguo/ha-fusion:v2024.12.0
    container_name: ha-fusion
    ports:
      - "5050:5050"
    volumes:
      - ./data:/app/data
    environment:
      - HASS_URL=http://localhost:8123
    restart: always
```

### 2. Docker 命令行

```bash
docker run -d \
  --name ha-fusion \
  -p 5050:5050 \
  -v /path/to/data:/app/data \
  -e HASS_URL=http://localhost:8123 \
  ghcr.io/symi-daguo/ha-fusion:v2024.12.0
```

## 📝 注意事项
- 首次使用请确保正确配置 HASS_URL 环境变量
- 建议将数据目录挂载到主机以保持配置持久化
- 详细���置说明请参考 [README.md](https://github.com/symi-daguo/ha-fusion/blob/main/README.md)

## 🔗 相关链接
- [详细文档](https://github.com/symi-daguo/ha-fusion/blob/main/README.md)
- [问题反馈](https://github.com/symi-daguo/ha-fusion/issues)
- [Docker 镜像](https://github.com/symi-daguo/ha-fusion/pkgs/container/ha-fusion) 