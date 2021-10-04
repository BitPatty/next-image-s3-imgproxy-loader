#!/bin/bash
NVMRC_VERSION="$(head -1 .nvmrc | sed 's/v//' | tr --delete '\n')"
nvm install
nvm use
nvm alias  default $(node --version)
nvm install-latest-npm
npm i