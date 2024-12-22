# ha-fusion

English | [简体中文](README.md)

A modern, easy-to-use and performant custom [Home Assistant](https://www.home-assistant.io/) dashboard

## Preview

[![preview](https://raw.githubusercontent.com/symi-daguo/ha-fusion/main/static/preview.png)](https://www.youtube.com/watch?v=D8mWruSuPOM)

If you find this project useful, be sure to give our repository a ⭐! If you love it, please consider donating! ❤️

## Features

- 🎨 Modern design style
- 📱 Fully responsive layout
- ⚡ High-performance rendering
- 🔧 Simple and easy configuration
- 🌍 Chinese-first support (Default Simplified Chinese interface, no additional setup needed)
- 🎯 Optimized for Home Assistant
- 🖥️ Fullscreen mode support (Can be toggled in settings)

---

## 📣 Pre-beta

The project is currently in **pre-beta** stage. Basic functionality has been completed, including:

- ✅ Chinese interface optimization (Defaults to Simplified Chinese, other languages can be selected in settings)
- ✅ Fullscreen display support
- ✅ Basic interface layout
- ✅ Docker container support
- ✅ Home Assistant add-on support

We are continuously improving and adding new features. General feedback, bug reports and feature requests are welcome!

---

## Table of Contents

- [Installation](#installation)
  - [Add-on Installation](#add-on-installation)
  - [Docker Installation](#docker-installation)
- [Configuration](#configuration)
- [URL Parameters](#url-parameters)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Debug](#debug)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Add-on Installation

For "Operating System" or "Supervised" installation methods, you can install ha-fusion as an add-on:

1. **Add Repository**: First, add the ha-fusion add-on repository to your Home Assistant instance. Click the button below or manually add the repository URL: <https://github.com/symi-daguo/ha-fusion>

   [![Open your Home Assistant instance and show the add add-on repository dialog](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fsymi-daguo%2Fha-fusion)

2. **Install Add-on**: After adding the repository, refresh the add-on store page. Locate ha-fusion in the list and proceed with the installation.

### Docker Installation

You can install ha-fusion via Docker using the following methods:

1. **Using Docker Compose**

Create a `docker-compose.yml` file:

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

Then run:
```bash
docker-compose up -d
```

2. **Using Docker Command Line**

```bash
docker run -d \
  --name ha-fusion \
  -p 5050:5050 \
  -v /path/to/data:/app/data \
  -e HASS_URL=http://localhost:8123 \
  ghcr.io/symi-daguo/ha-fusion:v2024.12.0
```

### Update

To update to the latest version, you can use the following commands:

1. **Using Docker Compose**
```bash
docker-compose pull ha-fusion
docker-compose up -d
```

2. **Using Docker Command Line**
```bash
docker pull ghcr.io/symi-daguo/ha-fusion:v2024.12.0
docker stop ha-fusion
docker rm ha-fusion
docker run -d \
  --name ha-fusion \
  -p 5050:5050 \
  -v /path/to/data:/app/data \
  -e HASS_URL=http://localhost:8123 \
  ghcr.io/symi-daguo/ha-fusion:v2024.12.0
```

<details>
<summary>
   <b>Other Installation Methods</b>
</summary>

Without docker-compose, updating the container involves additional steps. For each update, it's necessary to first stop the current container, remove it, pull the new image, and then execute the docker run command again.

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

If you prefer to use Kubernetes, see [Chart README.md](https://github.com/symi-daguo/ha-fusion/tree/main/charts/ha-fusion)

</details>

## Configuration

### Environment Variables

| Variable | Description | Default Value | Example |
|----------|-------------|---------------|---------|
| TZ | Timezone setting | Asia/Shanghai | Asia/Shanghai |
| HASS_URL | Home Assistant access URL | http://homeassistant:8123 | http://192.168.1.100:8123 |
| PORT | ha-fusion service port | 5050 | 5050 |

### Data Persistence

The data directory `/app/data` is used to store configuration files and other persistent data. It's recommended to map this directory to the host for data persistence.

## URL Parameters

These features will only function if you have exposed a port in the add-on configuration or by using Docker. Note that when using Ingress, query strings cannot be read.

### View

To set a particular view when the page loads, add the "view" parameter. For example, if you have a "Bedroom" view, append the query string `?view=Bedroom` to the URL.

### Menu

To disable the menu button, append the query string `?menu=false` to the URL. This is useful when you want to avoid unwanted changes to your dashboard, such as on wall-mounted tablets.

## Keyboard Shortcuts

| Key                 | Description |
| ------------------- | ----------- |
| **f**               | filter      |
| **esc**             | exit        |
| **cmd + s**         | save        |
| **cmd + z**         | undo        |
| **cmd + shift + z** | redo        |

## Debug

To debug any errors, check the "Log" tab if you're using the addon, or use `docker logs ha-fusion` for Docker setups. To inspect frontend issues, open the browser's console.

## Development

To begin contributing to the project, you'll first need to install node. It's also recommended to install pnpm. If you're unfamiliar with Svelte, consider doing the tutorial at <https://learn.svelte.dev>

```bash
# prerequisites (macos)
brew install node pnpm

# install
git clone https://github.com/symi-daguo/ha-fusion.git
cd ha-fusion
pnpm install

# environment
cp .env.example .env
code .env

# server
npm run dev -- --open

# dependencies
pnpm outdated
pnpm update

# lint
npm run check
npm run lint
npm run format
```

## Contributing

We welcome your contributions! Whether it's fixing bugs, adding new features, or improving documentation, your help will make the project better.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details 