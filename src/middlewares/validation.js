import Joi from "joi"
import BadRequestError from "../utils/BadRequestError";
export const createEmployeeValidation= (req, res, next) =>{
    const schema = Joi.object({
        name: Joi.string().required(),
        national_id: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
        phone_number: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        email: Joi.string().email().required(),
        date_of_birth: Joi.date().required(),
        status: Joi.string().required(),
        position: Joi.string().required()
    })
  const { error } = schema.validate(req.body);
  if(error) throw new BadRequestError(error.details[0].message)
  next();
}

export const resetPasswordValidation= (req, res, next) =>{
  const schema = Joi.object({
      email: Joi.string().email().required(),
      firstPassword: Joi.string().required(),
      secondPassword: Joi.string().required()
  })
const { error } = schema.validate(req.body);
if(error) throw new BadRequestError(error.details[0].message)
next();
}

export const createManagerValidation= (req, res, next) =>{
  const schema = Joi.object({
      name: Joi.string().required(),
      national_id: Joi.string().length(16).required(),
      phone_number: Joi.string().length(10).pattern(/^[0-9]+$/),
      email: Joi.string().email().required(),
      date_of_birth: Joi.date().required(),
      status: Joi.string().required(),
      position: Joi.string().required(),
      password: Joi.string().required()
  })
const { error } = schema.validate(req.body);
if(error) throw new BadRequestError(error.details[0].message)
next();
}