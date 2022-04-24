# B-OS Demo Application

- Technology stack: Node.js, Metarhia
- Database management system: PostgreSQL
- Frontend stack: vanilla.js

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/b-os-tech/Demo/blob/master/LICENSE)

## Concept

## Feature list

- Serve API with auto routing, HTTP(S), WS(S)
- Server code live reload with file system watch
- Auto dependency loader and plugins
- Graceful shutdown and application reload
- Minimum code size and dependencies
- Code sandboxing for security and context isolation
- Multi-threading for CPU utilization and isolation
- Serve multiple ports in threads
- Serve static files with memory cache
- Application configuration
- Simple logger and redirection from console
- Database access layer (Postgresql)
- Client persistent sessions
- Unit-tests and API tests example
- Request queue timeout and size
- API parallel execution concurrency
- API method execution timeout
- Load balancing for scaling
- Prototype polution prevention
- Better code isolation

## Usage

- You need node.js v14 or later (v16 prefered)
- Clone this repository (optionally subscribe to repo changes)
- Run `npm i` to install dependencies and generate RSA certificate
- Before running server initialize the DB:
  - First of all, make sure you have PostgreSQL installed (prefer 12.x).
  - Run database initialization script: `db/setup.sh`
- Run project: `node server.js` and stop with Ctrl+C

## License

Copyright (c) 2022 B-OS and Metarhia contributors.
This starter kit is [MIT licensed](./LICENSE).
