// scenes/contactData.js
import { composeWizardScene } from '../utils/SceneFactory';

export const createContactDataScene = composeWizardScene(
    (ctx) => {
        ctx.reply('Please enter your credentials');
        return ctx.wizard.next();
    },
    (ctx, done) => {
        ctx.wizard.state.credentials = ctx.message.text;
        return done();
    },
);
