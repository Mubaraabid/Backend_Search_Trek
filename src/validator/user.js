import joi from "joi";
import EHttpStatusCode from "../enums/HttpStatusCode.js"

const userValidator = {

  signUpValidator: (req, res, next) => {
    const schema = joi.object({
      userName: joi.string().min(3).max(20).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      degree: joi.string().min(3).max(20).required(),
      institute: joi.string().min(3).max(20).required(),
      DOB:  joi.date().iso().required(),
      phone: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    });
    const validate = schema.validate(req.body);
    
    if (validate.error) {
      return res
        .status(EHttpStatusCode.BAD_REQUEST)
        .json({ message: validate.error.details[0].message });
    }
    next();
  },

  loginValidator:(req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });
    const validate = schema.validate(req.body);
    
    if (validate.error) {
      return res
        .status(EHttpStatusCode.BAD_REQUEST)
        .json({ message: validate.error.details[0].message });
    }
    next();
  },

  update: (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string().min(3).max(20).required(),
        gender: joi.string().min(3).max(20).required(),
        bio: joi.string().min(10).max(200).required(),
        // DOB:  joi.date().iso().required(),
    });
    const validate = schema.validate(req.body);
    if (validate.error) {
      return res
        .status(EHttpStatusCode.BAD_REQUEST)
        .json({ message: validate.error.details[0].message });
    }
    next();
  },
};
export default userValidator;
