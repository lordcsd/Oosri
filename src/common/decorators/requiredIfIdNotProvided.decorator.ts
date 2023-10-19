import { UnprocessableEntityException } from '@nestjs/common';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsRequiredIfIdNotProvided(
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsRequiredIfIdNotProvided',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: any) {
          const { id } = args.object;

          // if id not provided and this field is not provided too
          if (!id && !`${value}`.length) {
            throw new UnprocessableEntityException(
              `${propertyName} is required when id is not provided.`,
            );
          }

          return true;
        },
        defaultMessage(args: any) {
          const { propertyName } = args;

          // Custom error message when the field is required
          return `${propertyName} is required when id is not provided.`;
        },
      },
    });
  };
}
