require('dotenv').config();
const Telegraf = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) =>
    ctx.reply(
        `Hey, ${ctx.message.from.first_name}!
  Just write me the name of country and get statistics on the cases of coronavirus. You can find a list of all countries with /help.
`,
        Markup.keyboard([
            ['US', 'Russia'],
            ['Austria', 'Ukraine'],
        ])
        .resize()
        .extra()
    )
);
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));
bot.on('text', async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);
        const formatData = `
Country: ${data[0][0].country}
Cases: ${data[0][0].cases}
Deaths: ${data[0][0].deaths} 
Recovered: ${data[0][0].recovered} `;
        ctx.reply(formatData);
    } catch {
        console.log('ERROR');
        ctx.reply("I can't find this country, please look at /help");
    }
});
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();