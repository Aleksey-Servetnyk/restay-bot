require('dotenv').config()
const express = require('express'),
    morgan = require('morgan')

const app = express(),
    port = 3000

app.use(morgan('dev'))

const {Telegraf, Markup, Extra} = require('telegraf')
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

let LANG = ''

//app.use(Telegraf.memorySession())
bot.use(i18n.middleware())
i18n.middleware(locale = 'ru')


bot.start(async (ctx) => {
    //ctx.i18n.locale('ru')
    //await ctx.reply(ctx.i18n.t('hello', {ctx}))
    await ctx.reply('Can you choose language?', buttons)
})
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
                break
            case 'bR':
                ctx.i18n.locale('ru')
                await ctx.reply(ctx.i18n.t('hello', {ctx}))
                break
            default:
                break
        }
    })}


bot.launch().then(r => {
})

