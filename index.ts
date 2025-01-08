import { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } from "grammy";
import "dotenv/config";
import { getRandomQuestion } from "./utilities";

const bot = new Bot(process.env.TELEGRAM_BOT_KEY);

bot.command("start", async (ctx) => {
  const keyboard = new Keyboard()
    .text("HTML")
    .text("CSS")
    .row()
    .text("JavaScript")
    .text("Vue")
    .resized();

  await ctx.reply(`
    Привет! Я - Interview Assistant Bot \nЯ помогаю подготовиться к собеседованию
  `);

  await ctx.reply("С чего начнем? Выбери категорию в меню 👇", {
    reply_markup: keyboard,
  });
});

bot.hears(["HTML", "CSS", "JavaScript", "Vue"], async (ctx) => {
  const category = ctx.message.text;
  const question = getRandomQuestion(category);

  const inlineKeyboard = new InlineKeyboard().text(
    "Узнать ответ",
    JSON.stringify({
      type: category,
      questionId: question.id,
    })
  );

  await ctx.reply(question.text, {
    reply_markup: inlineKeyboard,
  });
});

bot.on("callback_query:data", async (ctx) => {
  if (ctx.callbackQuery.data === "cancel") {
    await ctx.reply("Отменено");
    await ctx.answerCallbackQuery();

    return;
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.start();
