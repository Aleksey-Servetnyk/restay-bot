/**
 * Позвольте мне сначала объяснить, как create***Scene работает. Он принимает два аргумента:
 * sceneType- is sceneId - строковый идентификатор сцены;
 * nextScene- это обернутая done функция обратного вызова, которую мы вызываем после завершения сцены,
 * при ее вызове принудительно используется текущий ctx. nextScene используется для управления потоком
 * нашей сцены, поскольку она ожидает возврата нового идентификатора сцены. Если это произойдет,
 * текущее состояние ctx.wizard.state автоматически передается вызову ctx.scene.enter.
 * Если он возвращает значение, допускающее значение NULL, то вызывается ctx.scene.leave().
 *
 * Теперь наша сцена действительно имеет смысл, она объединяет несколько сцен в большой сценарий.
 * И теперь мы можем разделить логику каждой сцены в отдельный файл.
 * Именование сцен и переходы выполняются в одном месте, они могут быть как простыми, так и сложными.
 *
 * В качестве дополнительной функции я добавил проверку на каждый шаг,
 * так что эта функция шага срабатывает только в том случае,
 * если было сообщение или щелчок кнопки обратного вызова от пользователя
 * (не срабатывает, если какое-то старое сообщение было отредактировано и т. д.).
 */

// reportStageWizard.js
import { createEntryScene } from '../scenes/entryData';
import { createContactDataScene } from '../scenes/contactData';
import { createOrderDataScene } from '../scenes/orderData';
import { createActionTimeScene } from '../scenes/actionTimeScene';
import { ENTRY_SCENE, CONTACT_DATA_SCENE, ORDER_DATA_SCENE, ACTION_TIME_SCENE } from '../scenes/sceneTypes';
import {Composer, Stage} from "telegraf";

const bot = new Composer();

const stage = new Stage([
    // the following line defines ENTRY_SCENE, when scenario finishes, depending on hasCreds flag, it either switches to CONTACT_DATA_SCENE, or skips it to go straight for ORDER_DATA_SCENE
    createEntryScene(ENTRY_SCENE, (ctx) => (ctx.session.hasCreds ? ORDER_DATA_SCENE : CONTACT_DATA_SCENE)),
    // simple linear scenario, switch scenes one by one
    createContactDataScene(CONTACT_DATA_SCENE, () => ORDER_DATA_SCENE),
    createOrderDataScene(ORDER_DATA_SCENE, () => ACTION_TIME_SCENE),
    // once done, we send the data, gathered during scenario and leave scene
    createActionTimeScene(ACTION_TIME_SCENE, async (ctx) => {
        const { fio, date, time, clientName, actionType } = ctx.wizard.state;
        await sendReport({ date, time, clientName, actionType, fio, payment: '?' });
        await ctx.reply('Thank you for your report');
    }),
]);

bot.use(stage.middleware());
bot.command('test', Stage.enter(ENTRY_SCENE));
