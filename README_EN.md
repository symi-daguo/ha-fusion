# ha-fusion

English | [简体中文](README.md)

A modern, easy-to-use and performant custom [Home Assistant](https://www.home-assistant.io/) dashboard

## Preview

[![Preview](https://raw.githubusercontent.com/symi-daguo/ha-fusion/main/static/preview.png)](https://www.youtube.com/watch?v=D8mWruSuPOM)

If you find this project useful, please give our repository a ⭐! If you really like it, consider sponsoring us! ❤️

## Features

- 🎨 Modern design
- 📱 Fully responsive layout
- ⚡ High-performance rendering
- 🔧 Simple configuration
- 🌍 Chinese-first support (Simplified Chinese UI by default)
- 🎯 Optimized for Home Assistant
- 🖥️ Full-screen mode support (can be toggled in settings)

---

## 📣 Pre-release Notes

This project is currently in **pre-release testing phase**. Basic features are complete, including:

- ✅ Chinese UI optimization (default to Simplified Chinese, other languages available in settings)
- ✅ Full-screen display support
- ✅ Basic interface layout
- ✅ Docker container support
- ✅ Home Assistant add-on support

We are continuously improving and adding new features. All feedback, bug reports, and feature suggestions are welcome!

---

## Table of Contents

- [Installation](#installation)
  - [Add-on Installation](#add-on-installation)
  - [Docker Installation](#docker-installation)
- [Configuration](#configuration)
- [URL Parameters](#url-parameters)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Debugging](#debugging)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Add-on Installation

For "Operating System" or "Supervised" installations, you can install ha-fusion as an add-on:

1. **Add Repository**: First, add the ha-fusion add-on repository to your Home Assistant instance. Click the button below or manually add the repository URL: <https://github.com/symi-daguo/addon-ha-fusion>

   [![Open your Home Assistant instance and show the add add-on repository dialog](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsymi-daguo%2Faddon-ha-fusion)

2. **Install Add-on**: After adding the repository, refresh the add-on store page. Find "Fusion" in the list and install it.

### Docker Installation

You can install ha-fusion using Docker in the following ways:

1. **Using Docker Compose**

Create a `docker-compose.yml` file:

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
      - HASS_URL=http://localhost:8123
    restart: always
```

Then run:
```bash
# Create data directory
mkdir -p data

# Start service
docker-compose up -d
```

2. **Using Docker CLI**

```bash
# Create data directory
mkdir -p data

# Run container
docker run -d \
  --name ha-fusion \
  --network bridge \
  -p 5050:5050 \
  -v ${PWD}/data:/app/data \
  -e TZ=Asia/Shanghai \
  -e HASS_URL=http://localhost:8123 \
  --restart always \
  ghcr.io/symi-daguo/ha-fusion:latest
```

### Updating

To update to the latest version, you can use the following commands:

1. **Using Docker Compose**
```bash
docker-compose pull ha-fusion
docker-compose up -d
```

2. **Using Docker CLI**
```bash
docker pull ghcr.io/symi-daguo/ha-fusion:latest
docker stop ha-fusion
docker rm ha-fusion
docker run -d \
  --name ha-fusion \
  --network bridge \
  -p 5050:5050 \
  -v ${PWD}/data:/app/data \
  -e TZ=Asia/Shanghai \
  -e HASS_URL=http://localhost:8123 \
  --restart always \
  ghcr.io/symi-daguo/ha-fusion:latest
```

<details>
<summary>
   <b>Other Installation Methods</b>
</summary>

If not using docker-compose, updating the container requires additional steps. Each time you update, you need to stop the current container, remove it, pull the new image, and then re-run the docker run command.

```bash
docker run -d \
  --name ha-fusion \
  --network bridge \
  -p 5050:5050 \
  -v ${PWD}/data:/app/data \
  -e TZ=Asia/Shanghai \
  -e HASS_URL=http://localhost:8123 \
  --restart always \
  ghcr.io/symi-daguo/ha-fusion:latest
```

#### Kubernetes

If you want to use Kubernetes, please refer to the [Chart README.md](https://github.com/symi-daguo/ha-fusion/tree/main/charts/ha-fusion)

</details>

## Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| TZ | Timezone setting | Asia/Shanghai | Asia/Shanghai |
| HASS_URL | Home Assistant access URL | http://localhost:8123 | http://192.168.2.12:8123 |
| PORT | ha-fusion service port | 5050 | 5050 |

### Data Persistence

The `/app/data` directory is used to store configuration files and other persistent data. It is recommended to map this directory to the host to maintain data persistence.

## URL Parameters

These features are only available when the port is exposed in the add-on configuration or when using Docker. Note: URL parameters cannot be read when using Ingress.

### Views

To set a specific view on page load, add the "view" parameter. For example, if you have a "bedroom" view, add the query string `?view=bedroom` to the URL.

### Menu

To disable the menu button, add the query string `?menu=false` to the URL. This is useful when you want to prevent accidental dashboard changes, such as on wall-mounted tablets.

## Keyboard Shortcuts

| Key                 | Description |
| ------------------ | ----------- |
| **f**              | Filter      |
| **esc**            | Exit        |
| **cmd + s**        | Save        |
| **cmd + z**        | Undo        |
| **cmd + shift + z**| Redo        |

## Debugging

To debug any errors, check the "Logs" tab if you're using the add-on; if using Docker, use `docker logs ha-fusion`. To check frontend issues, open your browser's console.

## Development

To start contributing to the project, you'll first need to install node. Installing pnpm is also recommended. If you're not familiar with Svelte, it's recommended to complete the tutorial at <https://learn.svelte.dev>.

```bash
# Prerequisites (macos)
brew install node pnpm

# Installation
git clone https://github.com/symi-daguo/ha-fusion.git
cd ha-fusion
pnpm install

# Environment setup
cp .env.example .env
code .env

# Server
npm run dev -- --open

# Dependencies
pnpm outdated
pnpm update

# Code checks
npm run check
npm run lint
npm run format
```

## Contributing

We welcome your contributions! Whether it's fixing bugs, adding new features, or improving documentation, your help will make the project better.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details