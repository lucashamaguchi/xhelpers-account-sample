import * as Joi from "@hapi/joi";

export const completeSignupPayload = Joi.object({
  identityFilename: Joi.string().description("identity file path s3"),
  selfieFilename: Joi.string().description("selfie file path s3"),

  fullName: Joi.string().description("full name"),
  documentNumber: Joi.string().description("document number"),
  cpf: Joi.string().description("cpf"),
  birthDate: Joi.date().description("birthdate"),
  motherName: Joi.string().description("mother name"),
  street: Joi.string().description("address street"),
  number: Joi.string().description("address number"),
  complement: Joi.string().allow("").optional().description("address complement"),
  neighborhood: Joi.string().description("address neighborhood"),
  city: Joi.string().description("address city"),
  state: Joi.string().description("address state"),
  zipCode: Joi.string().description("address zipCode"),
});
