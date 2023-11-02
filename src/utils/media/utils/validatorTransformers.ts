import { UnprocessableEntityException } from '@nestjs/common';
import { FormImageStruct } from '../../../common/dtos/imageUpload.dto';

export const TransformBooleanStringToBoolean = ({ value }) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (value && typeof value == 'string') {
    if (value.trim().toLocaleLowerCase() === 'true') {
      return true;
    } else if (value.trim().toLocaleLowerCase() === 'false') {
      return false;
    }
  }
  return '';
};

export const TransformNumberStringToNumber = ({ value }) => {
  if (Array.isArray(value)) {
    return value.map((_value) =>
      typeof _value == 'string' ? Number(_value) : _value,
    );
  } else if (!Array.isArray(value) && typeof value === 'string') {
    return Number(value);
  }
  return value;
};

export const SortStringArrayAlphabetically = ({ value }) => {
  return value && Array.isArray(value)
    ? value.sort((a, b) => a.localeCompare(b))
    : value;
};
export const TransformStringToJSONArray = ({ value, key }) => {
  if (!value) {
    throw new UnprocessableEntityException(`${key}: Must not be empty`);
  }
  try {
    if (Array.isArray(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const splitAsString = value.split(',');

      const isJSONArrayString = value.constructor === [].constructor;

      if (
        Array.isArray(splitAsString) &&
        splitAsString.length > 0 &&
        !isJSONArrayString
      ) {
        return splitAsString;
      }

      if (isJSONArrayString) {
        return JSON.parse(value);
      }
    }

    throw new Error('validation failed');
  } catch (err) {
    throw new UnprocessableEntityException(
      `${key}: Must be an array, JSON array or comma separated string`,
    );
  }
};

export const TransformSortStringArray = ({ value }) => {
  if (typeof value == 'string') {
    value = [value];
  }
  return value.sort((a, b) => a.localeCompare(b));
};

export const TransformSingleItemToArray = ({ value }) => {
  return Array.isArray(value) ? value : [value];
};

export const TransformUnrapImageObj = ({
  value,
  key,
}: {
  value: FormImageStruct;
  key: string;
}) => {
  if (!value) {
    return value;
  }

  const { originalName, encoding, busBoyMimeType, buffer, size } = value;

  if (!originalName || !encoding || !busBoyMimeType || !buffer || !size) {
    throw new UnprocessableEntityException(`${key}: Must be valid Image array`);
  }

  if (
    originalName &&
    encoding &&
    busBoyMimeType &&
    buffer &&
    size &&
    !value['']
  ) {
    return [value];
  }

  const images = [];

  const unwrap = (branch) => {
    const subBranch = branch[''];
    delete branch[''];
    images.push(branch);
    if (subBranch) {
      return unwrap(subBranch);
    }
  };

  unwrap(value);
  return images;
};
