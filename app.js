require('dotenv').config()
//import { GLOBAL_LANGUAGE } from './config/global_data'
    //let gl_lang = require('./config/global_data')
const express = require('express'),
    morgan = require('morgan')

const app = express(),
    port = 3000

app.use(morgan('dev'))

const {Telegraf, Markup, Extra, Stage, session} = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const path = require("path");

/*
const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: false, // Default true
    directory: path.resolve(__dirname, 'locales')
})
*/

//i18n.loadLocale('en', {greeting: 'Hello!'})

const bot = new Telegraf(process.env.BOT_TOKEN)
//const FirstNameSceneGenerator = require('./scenes/FirstNameSceneGenerator')
//const firstNameSceneGenerator = new FirstNameSceneGenerator()
//const firstNameScene = firstNameSceneGenerator.FirstNameScene()
//const stage = new Stage([firstNameScene])

const i18n = new TelegrafI18n({
    useSession: false,
    defaultLanguageOnMissing: false, // implies allowMissing = true
    directory: path.resolve(__dirname, 'locales')
})


const buttons = Extra.markup(
    Markup.inlineKeyboard(
        [
            Markup.callbackButton('English', 'bE', false),
            Markup.callbackButton('Russian', 'bR', false)
        ]
    )
)



//app.use(Telegraf.memorySession())
bot.use(i18n.middleware())
//i18n.middleware(locale = 'ru')
bot.use(session())
//bot.use(stage.middleware())

bot.start(async (ctx) => {
    //ctx.i18n.locale('ru')
    //await ctx.reply(ctx.i18n.t('hello', {ctx}))
    await ctx.reply('Can you choose your favorite language?', buttons)
})
/*
bot.command('scenes', async (ctx) => {
    ctx.scene.enter('firstNameScene')
})
*/
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

addBtnAction('bE')
addBtnAction('bR')


/**
 * Language switching function
 * @param id_btn id language button
 */
function addBtnAction(id_btn) {
    bot.action(id_btn, async (ctx) => {
        switch (id_btn) {
            case 'bE':
                ctx.i18n.locale('en')
                await ctx.reply(ctx.i18n.t('hello', {ctx}))
                    //gl_lang = 'en'
                break
            case 'bR':
                ctx.i18n.locale('ru')
                await ctx.reply(ctx.i18n.t('hello', {ctx}))
                //gl_lang = 'ru'
                break
            default:
                //global.language = gl_lang
                break
        }
    })}


bot.launch().then(r => {
})

