## KaufmanBot

[![Build Status][travis-image]][travis-url]

A simple bot for Telegram and Skype, example: [KaufmanBot on Telegram](https://telegram.me/KaufmanBot), [KaufmanBot on Skype](https://join.skype.com/bot/584ac9ef-20ce-43c6-8a68-f206358f7488?add)

### Usage
- clone or fork repository `git clone https://github.com/EndyKaufman/kaufman-bot.git`
- make sure you have [node.js](https://nodejs.org/) installed version 6+
- make sure you have NPM installed version 3+
- run `npm install` to install project dependencies
- copy `_env` to `.env` and set environments for use
- run `npm start` to fire up prod server

### Build
- run `npm run build` to build application

### Plugins
- `api-ai` - Simple usage https://api.ai service with default agent, example: `hi kaufman!`
- `wiki` - Get basic information of word from https://www.wikipedia.org, example: `kaufman wiki microsoft`
- `scraper` - Scraping content segment from remote site with css selector
- `scraper:ping` - Scraping ping results for request to site or ip, site for scraping: http://2whois.ru, example: `kaufman ping google.ru`
- `scraper:bashorg` - Joke and tell jokes, site for scraping http://bash.im, for example: `joke`
- `scraper:quotes` - Give random quotes, site for scraping https://forismatic.com, for example: `quotes`

### Run tests
- run `npm run test`

### Run on dev mode
- run `npm run watch`

### Run plugin standalone
- run `node ./bin/kaufman-bot -p -m "Hi kaufman!"` emulate user request, search answer in all plugins 
- run with plugin name `node ./bin/kaufman-bot -p api-ai -m "Hi!"` emulate user request, search only one plugin

## License

MIT

[travis-image]: https://travis-ci.org/EndyKaufman/kaufman-bot.svg?branch=master
[travis-url]: https://travis-ci.org/EndyKaufman/kaufman-bot