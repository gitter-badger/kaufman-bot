"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_bot_server_1 = require("../lib/base.bot-server");
const scraper_plugin_1 = require("../plugins/scraper.plugin");
const wiki_plugin_1 = require("../plugins/wiki.plugin");
const api_ai_plugin_1 = require("../plugins/api-ai.plugin");
const TelegramBot = require('node-telegram-bot-api');
class TelegramBotServer extends base_bot_server_1.BaseBotServer {
    constructor(name) {
        super(name);
        this.name = name;
        this.botToken = this.env('TELEGRAM_TOKEN');
        this.botHookUrl = this.env('TELEGRAM_HOOK_URL');
        this.bot = new TelegramBot(this.botToken, { polling: true });
        this.plugins.push(new scraper_plugin_1.ScraperBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_FORISMATIC_URI'), this.env('SCRAPER_FORISMATIC_TIMEOUT', 10000), this.env('SCRAPER_FORISMATIC_CONTENT_SELECTOR'), this.env('SCRAPER_FORISMATIC_CONTENT_LENGTH', 1000), 'windows-1251', this.env('SCRAPER_FORISMATIC_SPY_WORDS', 'quote').split(','), this.env('SCRAPER_FORISMATIC_WHAT_CAN_I_DO_EN'), this.env('SCRAPER_FORISMATIC_WHAT_CAN_I_DO_RU')));
        this.plugins.push(new scraper_plugin_1.ScraperBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_BASHORG_URI'), this.env('SCRAPER_BASHORG_TIMEOUT', 10000), this.env('SCRAPER_BASHORG_CONTENT_SELECTOR'), this.env('SCRAPER_BASHORG_CONTENT_LENGTH', 1000), null, this.env('SCRAPER_BASHORG_SPY_WORDS', 'bashorg').split(','), this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_EN'), this.env('SCRAPER_BASHORG_WHAT_CAN_I_DO_RU')));
        this.plugins.push(new scraper_plugin_1.ScraperBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('SCRAPER_PING_URI'), this.env('SCRAPER_PING_TIMEOUT', 10000), this.env('SCRAPER_PING_CONTENT_SELECTOR'), this.env('SCRAPER_PING_CONTENT_LENGTH', 1000), null, this.env('SCRAPER_PING_SPY_WORDS', 'ping').split(','), this.env('SCRAPER_PING_WHAT_CAN_I_DO_EN'), this.env('SCRAPER_PING_WHAT_CAN_I_DO_RU')));
        this.plugins.push(new wiki_plugin_1.WikiBotPlugin(this.env('BOT_LOCALE'), this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('WIKIPEDIA_CONTENT_LENGTH', 1000), this.env('WIKIPEDIA_SPY_WORDS', 'wiki').split(',')));
        this.plugins.push(new api_ai_plugin_1.ApiAiBotPlugin(this.env('BOT_NAME_ALIASES', 'bot').split(','), this.env('APIAI_CLIENT_ACCESS_TOKEN')));
    }
}
exports.TelegramBotServer = TelegramBotServer;
