import { errors } from "@vinejs/vine";
import { FieldContext, ErrorReporterContract } from "@vinejs/vine/types";

export default class CustomErrorReporter implements ErrorReporterContract {
  /**
   * A flag to know if one or more errors have been
   * reported
   */
  hasErrors: boolean = false;

  /**
   * A collection of errors. Feel free to give accurate types
   * to this property
   */
  errors: any = {};

  /**
   * VineJS call the report method
   */
  report(message: string, rule: string, field: FieldContext, meta?: any) {
    this.hasErrors = true;
    this.errors[field.wildCardPath] = message;
  }

  /**
   * Creates and returns an instance of the
   * ValidationError class
   */
  createError() {
    return new errors.E_VALIDATION_ERROR(this.errors);
  }
}