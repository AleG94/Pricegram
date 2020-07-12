'use strict';

module.exports = async (err, ctx) => {
  console.error(err);

  const message = 'Sorry, an unexpected error occurred.';

  if (ctx.scene) {
    await ctx.scene.leave();
  }

  if (ctx.updateType === 'message') {
    await ctx.reply(message);
  } else if (ctx.updateType === 'callback_query') {
    await ctx.editMessageText(message);
  }
};
