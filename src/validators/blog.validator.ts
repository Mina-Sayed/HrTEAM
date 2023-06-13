import Joi, { ValidationError } from "joi";
import { LikesArr } from "../types/likes";
import { IBlog } from "../models/blog";


export const blogValidator = (blog: IBlog, reqType: any) =>
{
  try {
    const schema = Joi.object({
      title: Joi.string().alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.forbidden(),
      }),
      description: Joi.string().alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.forbidden(),
      }),
      meta: Joi.string().alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.forbidden(),
      }),
      keywords: Joi.array().items(Joi.string()),
      keywordDescription: Joi.string().alter({
        post: (schema: any) => schema.required(),
        put: (schema: any) => schema.forbidden(),
      }),
      comments: Joi.array().items(Joi.object()),
      likes: Joi.array().items({
        user: Joi.object().required(),
      }),
      blogType: Joi.string().valid("event", "blog"),
      startDate: Joi.alternatives().conditional("blogType", {
        is: "event",
        then: Joi.date().required(),
        otherwise: Joi.forbidden(),
      }),
      endDate: Joi.alternatives().conditional("blogType", {
        is: "event",
        then: Joi.date().required(),
        otherwise: Joi.forbidden(),
      }),
      likeType: Joi.string().valid(...LikesArr),
      image: Joi.string(),
      company: Joi.object(),
    });

    const result = schema.tailor(reqType).validate(blog);
    if (!result.hasOwnProperty("error")) {
      result.error = {} as ValidationError;
    }
    return result;
  } catch (e) {
    console.log(e);
    return { error: e }; // return a validation result object with an error property
  }
};