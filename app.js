require('dotenv').config()
const express = require('express'),
    morgan = require('morgan')

const app = express(),
    port = 3000

app.use(morgan('dev'))

const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply("Hello, @user! I'm a bot to help you post or edit your advertisements on restay.me. \nYou can stop submitting advertisements at any time just by texting “Stop”."))
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch().then(r => {})
