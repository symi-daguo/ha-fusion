# ha-fusion

[English](README_EN.md) | 简体中文

一个现代化、易用且高性能的 [Home Assistant](https://www.home-assistant.io/) 自定义仪表盘

<https://www.youtube.com/watch?v=D8mWruSuPOM>

[![预览](/static/preview.png)](https://www.youtube.com/watch?v=D8mWruSuPOM)

如果您觉得这个项目有用，请给我们的仓库点个 🌟！如果您非常喜欢，也可以考虑赞助我们！❤️

---

## 📣 预发布版本说明

本项目目前处于**预发布测试阶段**。这意味着可能缺少一些基本功能，部分特性尚未完成，还存在一些待解决的问题。我们欢迎各种反馈、错误报告和功能建议！

---

## 目录

- [安装说明](#安装说明)
  - [插件方式安装](#插件方式安装)
  - [Docker 安装](#docker-安装)
- [配置说明](#配置说明)
- [URL 参数说明](#url-参数说明)
- [键盘快捷键](#键盘快捷键)
- [调试](#调试)
- [开发](#开发)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 安装说明

### 插件方式安装

对于 "Operating System" 或 "Supervised" 安装方式，您可以将 ha-fusion ���为插件安装：

1. **添加仓库**：首先，将 ha-fusion 插件仓库添加到您的 Home Assistant 实例中。点击下方按钮或手动添加仓库 URL：<https://github.com/symi-daguo/addon-ha-fusion>

   [![在您的 Home Assistant 实例中打开并显示添加插件仓库对话框](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsymi-daguo%2Faddon-ha-fusion)

2. **安装插件**：添加仓库后，刷新插件商店页面。在列表中找到 "Fusion" 并安装。

### Docker 安装

如果您使用的是 "Container" 或 "Core" 安装方式，可以通过 Docker 安装 ha-fusion：

1. **Docker Compose 文件**：将修改后的 [docker-compose.yml](https://github.com/symi-daguo/ha-fusion/blob/main/docker-compose.yml) 文件放置在合适的目录中。

2. **创建容器**：
   在终端中运行以下命令启动容器：

   ```bash
   cd path/to/docker-compose.yml
   docker-compose up -d ha-fusion
   ```

#### 更新

要更新到最新版本的 ha-fusion，运行以下命令：

```bash
docker-compose pull ha-fusion
docker-compose up -d ha-fusion
```

<details>
<summary>
   <b>其他安装方式</b>
</summary>

如果不使用 docker-compose，更新容器需要额外的步骤。每次更新时，都需要先停止当前容器，删除它，拉取新镜像，然后重新执行 docker run 命令。

```bash
docker run -d \
  --name ha-fusion \
  --network bridge \
  -p 5050:5050 \
  -v /path/to/ha-fusion:/app/data \
  -e TZ=Asia/Shanghai \
  -e HASS_URL=http://homeassistant:8123 \
  --restart always \
  ghcr.io/symi-daguo/ha-fusion
```

#### Kubernetes

如果您想使用 Kubernetes，请参阅 [Chart README.md](https://github.com/symi-daguo/ha-fusion/tree/main/charts/ha-fusion)

</details>

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 | 示例 |
|--------|------|--------|-------|
| TZ | 时区设置 | Asia/Shanghai | Asia/Shanghai |
| HASS_URL | Home Assistant 的访问地址 | http://homeassistant:8123 | http://192.168.1.100:8123 |
| PORT | ha-fusion 服务端口 | 5050 | 5050 |

### 数据持久化

数据目录 `/app/data` 用于存储配置文件和其他持久化数据。建议将此目录映射到主机以保持数据持久化。

## URL 参数说明

这些功能仅在插件配置或使用 Docker 时暴露端口的情况下有效。注意：使用 Ingress 时，无法读取 URL 参数。

### 视图

要在页面加载时设置特定视图，添加 "view" 参数。例如，如果您有一个"卧室"视图，在 URL 后添加查询字符串 `?view=卧室`。

### 菜单

要禁用菜单按钮，在 URL 后添加查询字符串 `?menu=false`。这在您想避免仪表盘被意外更改时很有用，比如在壁挂式平板电脑上。

## 键盘快捷键

| 按键                | 描述     |
| ------------------- | -------- |
| **f**               | 过滤     |
| **esc**             | 退出     |
| **cmd + s**         | 保存     |
| **cmd + z**         | 撤销     |
| **cmd + shift + z** | 重做     |

## 调试

要调试任何错误，如果您使用的是插件，请��看"日志"标签页；如果使用 Docker，请使用 `docker logs ha-fusion`。要检查前端问题，请打开浏览器的控制台。

## 开发

要开始为项目做贡献，您首先需要安装 node。同时建议安装 pnpm。如果您不熟悉 Svelte，建议在 <https://learn.svelte.dev> 完成教程。

```bash
# 前置条件 (macos)
brew install node pnpm

# 安装
git clone https://github.com/symi-daguo/ha-fusion.git
cd ha-fusion
pnpm install

# 环境配置
cp .env.example .env
code .env

# 服务器
npm run dev -- --open

# 依赖管理
pnpm outdated
pnpm update

# 代码检查
npm run check
npm run lint
npm run format
```

## 贡献指南

我们非常欢迎您的贡献！无论是修复错误、添加新功能，还是改进文档，您的帮助都将使项目变得更好。

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加一些特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
