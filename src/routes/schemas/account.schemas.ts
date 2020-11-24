import * as Joi from "@hapi/joi";

export const accountCreate = Joi.object({
  name: Joi.string().max(256).required().description("Name"),
  email: Joi.string().email().max(256).required().description("Email"),
  phone: Joi.string().max(20).description("Phone"),
  acceptTerms: Joi.boolean()
    .default(true)
    .description("acceptTerms"),
  password: Joi.string().max(50).required().description("Password"),
})
  .label("accountCreate")
  .description("Account New");

export const accountUpdate = Joi.object({
  name: Joi.string().max(256).description("Name"),
  phone: Joi.string().max(20).description("Phone"),
})
  .label("accountUpdate")
  .description("Account Update");

export const accountRecover = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
})
  .label("accountRecover")
  .description("Account Recover");

export const forgotPassword = Joi.object({
  email: Joi.string().required(),
})
  .label("forgotPassword")
  .description("Forgot Password");

export const accountConfirmEmail = Joi.object({
  token: Joi.string().required(),
  email: Joi.string().required(),
})
  .label("accountConfirmEmail")
  .description("Account Confirm Email");
