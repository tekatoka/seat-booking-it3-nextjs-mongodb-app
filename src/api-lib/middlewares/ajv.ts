import Ajv, { JSONSchemaType } from 'ajv';
import { Request, Response, NextFunction } from 'express';

export function validateBody<T>(schema: JSONSchemaType<T>) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);

  return (req: Request, res: Response, next: NextFunction) => {
    const valid = validate(req.body);
    if (valid) {
      return next();
    } else {
      const error = validate.errors ? validate.errors[0] : null;
      if (error) {
        return res.status(400).json({
          error: {
            message: `"${error.instancePath.substring(1)}" ${error.message}`,
          },
        });
      } else {
        return res.status(400).json({
          error: {
            message: 'Invalid data',
          },
        });
      }
    }
  };
}
