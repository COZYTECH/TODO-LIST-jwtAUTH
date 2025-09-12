import joi from "joi";

export const signUpSchema = joi.object({
  email: joi.string().min(5).max(60).required(),
  password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
export const loginInSchema = joi.object({
  email: joi.string().min(5).max(60).required(),
  password: joi.string().required().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
export const changePasswordSchema = joi.object({
  oldPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  newPassword: joi
    .string()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
