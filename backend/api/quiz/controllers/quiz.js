'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  // async create(ctx) {
  //   let entity;
  //   if (ctx.is('multipart')) {
  //     const { data, files } = parseMultipartData(ctx);
  //     data.userID = ctx.state.user.id;
  //     entity = await strapi.services.quiz.create(data, { files });
  //   } else {
  //     ctx.request.body.userID = ctx.state.user.id;
  //     entity = await strapi.services.quiz.create(ctx.request.body);
  //   }
  //   return sanitizeEntity(entity, { model: strapi.models.quiz });
  // },


  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [quiz] = await strapi.services.quiz.find({
      id: ctx.params.id,
      'userID': ctx.state.user.id,
    });

    if (!quiz) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.quiz.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.quiz.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.quiz });
  },

  async delete(ctx) {
    const { id } = ctx.params;

    let entity;

    const [quiz] = await strapi.services.quiz.find({
      id: ctx.params.id,
      'userID': ctx.state.user.id,
    });

    if (!quiz) {
      return ctx.unauthorized(`You can't delete this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.quiz.delete({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.quiz.delete({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.quiz });
  },
};
