import { setTimeout } from 'timers';
import { EventEmitter } from 'events';
import { IBotPlugin, IBotMessage, IBotServer, IBot, IWebServer } from './interfaces';
import { checkWordsInMessage } from './utils';

export class BaseBotServer implements IBotServer {
    protected bot: IBot;
    protected webServer: IWebServer
    protected botToken: string;
    protected botHookUrl: string;
    protected plugins: IBotPlugin[];
    constructor(protected name?: string) {
        if (this.plugins === undefined) {
            this.plugins = [];
        }
    }
    protected get namePrefix() {
        return !this.name ? '' : this.name.toUpperCase() + '_';
    }
    protected env(name: string, defaultValue: any = '') {
        if (process.env[this.namePrefix + name]) {
            return process.env[this.namePrefix + name]
        } else {
            return defaultValue;
        }
    }
    public startPlugin(message: string, pluginName: string, locale: string) {
        const event = new EventEmitter();
        const msg: IBotMessage = {
            text: message,
            chat: {
                id: 'random',
                type: 'private'
            },
            from: {
                language_code: locale
            },
        };
        let founded = false;
        let i = 0;
        const len = this.plugins.length;
        for (i = 0; i < len; i++) {
            if (
                !founded &&
                (pluginName === null && this.plugins[i].check(this.bot, msg)) ||
                (pluginName !== null && this.plugins[i].name === pluginName)
            ) {
                founded = true;
                this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
                    if (answer) {
                        this.checkHardBotAnswers(msg, answer).on('message', (hardBotAnswer: string) => {
                            if (hardBotAnswer) {
                                answer = hardBotAnswer;
                            }
                            event.emit('message', answer);
                        });
                    } else {
                        this.notFound(msg).on('message', (notFoundAnswer: string) => {
                            event.emit('message', answer);
                        })
                    }
                });
                break;
            }
        }
        if (!founded) {
            event.emit('message', 'bot.empty');
        }
        return event;
    }
    public startEndpoint(server: IWebServer) {
        this.webServer = server;
        this.processUpdate();
        this.processHook();
        this.processMessages();
    }
    protected get actionUrl() {
        return `/bot${this.botToken}`;
    }
    protected processHook() {
        if (this.botHookUrl) {
            this.bot.setWebHook(this.botHookUrl + this.actionUrl);
        }
    }
    protected processUpdate() {
        this.webServer.app.post(this.actionUrl, (req: any, res: any) => {
            this.bot.processUpdate(req.body);
            res.sendStatus(200);
        });
    }
    protected processMessages() {
        this.bot.on('message', (msg: IBotMessage) => {
            let founded = false;
            let i = 0;
            const len = this.plugins.length;
            for (i = 0; i < len; i++) {
                if (!founded && this.plugins[i].check(this.bot, msg)) {
                    founded = true;
                    setTimeout(() =>
                        this.plugins[i].process(this.bot, msg).on('message', (answer: string) => {
                            if (answer) {
                                this.checkHardBotAnswers(msg, answer).on('message', (hardBotAnswer: string) => {
                                    if (hardBotAnswer) {
                                        answer = hardBotAnswer;
                                    }
                                    this.bot.sendMessage(msg.chat.id, answer, { originalMessage: msg, parse_mode: 'Markdown' });
                                });
                            } else {
                                this.notFound(msg).on('message', (notFoundAnswer: string) => {
                                    this.bot.sendMessage(msg.chat.id, notFoundAnswer, { originalMessage: msg, parse_mode: 'Markdown' });
                                });
                            }
                        })
                        , 100);
                    break;
                }
            }
        });
    }
    protected checkHardBotAnswers(msg: IBotMessage, answer: string) {
        const event = new EventEmitter();
        const methodName: string = answer.replace('bot.request:', '');
        const answers: string[] = [];
        setTimeout(() => {
            let founded = false;
            if (methodName !== answer) {
                let j = 0;
                const len = this.plugins.length;
                for (j = 0; j < len; j++) {
                    if (checkWordsInMessage(methodName, ['answerWhatCanIdo'])) {
                        founded = true;
                        answers.push(this.plugins[j].answerWhatCanIdo(this.bot, msg));
                    }
                }
            }
            if (founded) {
                event.emit('message', answers.join('\n'));
            } else {
                event.emit('message', false);
            }
        }, 100);
        return event;
    }
    protected notFound(msg: IBotMessage) {
        const event = new EventEmitter();
        setTimeout(() => {
            let founded = false;
            let j = 0;
            const len = this.plugins.length;
            for (j = 0; j < len; j++) {
                if (!founded && this.plugins[j]['name'] === 'api-ai') {
                    founded = true;
                    msg.text = 'bot.response:notFound';
                    this.plugins[j].process(this.bot, msg).on('message', (answer: string) => {
                        event.emit('message', answer);
                    });
                    break;
                }
            }
            if (!founded) {
                event.emit('message', 'Error! ApiAiPlugin not founded :(');
            }
        }, 100);
        return event;
    }
}
