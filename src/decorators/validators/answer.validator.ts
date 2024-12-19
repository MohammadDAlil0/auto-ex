import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
  
// Custom Constraint
@ValidatorConstraint({ async: false })
export class IsAnswerValidConstraint implements ValidatorConstraintInterface {
    validate(answer: number, args: ValidationArguments) {
        const object = args.object as any;
        const options = object.options;
        return Array.isArray(options) && answer <= options.length && answer >= 1;
    }

    defaultMessage() {
        return `Answer is out of the range`;
    }
}

// Custom Decorator
export function IsAnswerValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsAnswerValidConstraint,
        });
    };
}
  