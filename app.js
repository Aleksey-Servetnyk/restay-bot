require('dotenv').config()
const express = require('express'),
    morgan = require('morgan')

const app = express(),
    port = 3000

app.use(morgan('dev'))

const { Telegraf } = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const path = require("path");

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: false, // Default true
    directory: path.resolve(__dirname, 'locales')
})

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.use(i18n.middleware())
bot.start((ctx) => ctx.reply(ctx.i18n.t('hello', {ctx})))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch().then(r => {})
