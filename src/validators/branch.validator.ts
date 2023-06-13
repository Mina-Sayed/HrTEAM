import Joi from "joi";


export function validateBranch(branch: any)
{
    const shiftSchema = Joi.object({
        start_h: Joi.number().min(0).max(23).required(),
        start_mins: Joi.number().min(0).max(59).default(0),
        end_h: Joi.number().min(0).max(23).required()
            .when("start_h",
                {
                    is: Joi.number(),
                    then: Joi.number().greater(Joi.ref("start_h")),
                }),
        end_mins: Joi.number().min(0).max(59).default(0),
    });
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        company: Joi.object().alter({
            post: (schema: {
                required: () => any
            }) => schema.required(),
        }),
        // shifts: Joi.array().items({
        //     work: shiftSchema,
        //     breaks: Joi.array().items(shiftSchema),
        //     overtimes: Joi.array().items(shiftSchema),
        // }),
        fixedHolidays: Joi.array().items(Joi.date()),
        lat: Joi.number().alter({
            post: (schema: {
                required: () => any
            }) => schema.required(),
        }),
        long: Joi.number().alter({
            post: (schema: {
                required: () => any
            }) => schema.required(),
        }),

    });
    return schema.validate(branch);
};