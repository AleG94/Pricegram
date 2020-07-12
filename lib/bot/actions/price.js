'use strict';
const scenes = require('../scenes');

module.exports = async ctx => {
  const productId = ctx.match[1];

  await ctx.answerCbQuery();
  await ctx.scene.enter(scenes.setTargetPrice.id, { productId: productId });
};
