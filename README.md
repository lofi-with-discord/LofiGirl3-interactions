# LofiGirl v3 - interactions
<img src="https://avatars.githubusercontent.com/u/79153360" width="60" height="60" alt="sharp logo" align="right">

Interaction support for LofiGirl3

it contains [application commands](https://discord.com/developers/docs/interactions/application-commands) (aka. slash commands) supports, [Message Components](https://discord.com/developers/docs/interactions/message-components) supports and [LofiGirl restapi](https://github.com/lofi-with-discord/LofiGirl3-playserver) client.

due to `discord.js v13` and other modules, this repository only supports `node.js v16`.


## Notice
> If you're interested in the translation project, please visit here:\
> https://github.com/lofi-with-discord/LofiGirl-i18n

This repository is a part of `LofiGirl v3` project.

This repository and Discord bot named `lofi girl` is not related to [this youtube channel](https://www.youtube.com/c/LofiGirl).

*Please stop asking me about is this official bot.*

## Installation
if you need self-hosting or debug some stuffs, follow these instructions

### NOTICE
**RUN [playserver](https://github.com/lofi-with-discord/lofiGirl3-playserver) BEFORE FOLLOWING THESE INSTRUCTIONS**

### Prerequirements
* `node.js` (version 16.x or later)
* `yarn` (version 1.x)
* `mariadb` or `mysql` (latest)
* [`LofiGirl3-playserver`](https://github.com/lofi-with-discord/lofiGirl3-playserver) (**it must be already running**)

### Clone this repository
```bash
git clone https://github.com/lofi-with-discord/LofiGirl3-interactions.git
cd LofiGirl3-interactions
```

### Install dependencies
```bash
yarn # it will take some times
git submodule update --init # updates localization files
```

### Install SQL schema
```bash
wget https://raw.github.com/lofi-with-discord/LofiGirl3-playserver/main/database.sql

sudo mariadb

> source database.sql
> exit
```

### Edit configuration file
```bash
cp .env.example .env
```

and edit `.env` file:
```
DISCORD_TOKEN=<discord bot token>
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=lofigirl
DATABASE_PASSWORD=
DATABASE_SCHEMA=lofigirl
CONTROL_HOST=<playserver ip or url>
CONTROL_PORT=<playserver port or ports seperated with comma>
CONTROL_PASSWORD=<playserver password>
ENVIROMENT=DEV
ENVIROMENT_DEV_GUILD=<guild id for development>
REFRESH_SLASH_COMMAND_ON_READY=true
```

### Run application
```bash
yarn build # build typescript file to javascript
yarn start # run built javascript file
```

## License
Copyright (c) 2021 Lofi with Discord

see [license](./LICENSE) file.

## Contact
Maintainer: Park Min Hyeok
* Email: pmhstudio.pmh@gmail.com
* Discord: https://discord.gg/WJRtvankkB
