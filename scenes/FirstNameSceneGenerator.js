const Scene = require('telegraf/scenes/base')

class FirstNameSceneGenerator {

    constructor() {
    }

    FirstNameScene() {
        const firstName = new Scene('firstName')
        firstName.enter(async (ctx) => {
            await ctx.reply('What is your first name? We need your real name.')
        })
        firstName.on('text', async (ctx) => {
            const result = ctx.message.text
            if (result.length <= 20) await ctx.reply('thanks')
            else {
                await ctx.reply('You entered an invalid value, please enter it again. If you need a help, please leave us a message https://restay.me/contact-us/')
                await ctx.scene.reenter()
            }
        })
        firstName.on('You entered an invalid value, please enter it again. If you need a help, please leave us a message https://restay.me/contact-us/')
        return firstName
    }
}
