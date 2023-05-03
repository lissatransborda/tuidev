import { Request } from "express";
import { ValidationError, validationResult } from "express-validator";

function validateResult(request: Request): Array<ValidationError> | null {
  const result = validationResult(request);

  if (!result.isEmpty()) {
    return result.array();
  }

  return null;
}

export { validateResult };
