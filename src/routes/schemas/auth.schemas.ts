import * as Joi from "@hapi/joi";

export const loginPayload = Joi.object({
  email: Joi.string().email().max(256).required().description("Email"),
  password: Joi.string().max(50).required().description("Password"),
})
  .label("loginPayload")
  .description("Login");
