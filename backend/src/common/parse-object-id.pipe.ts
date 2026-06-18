import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value) || new Types.ObjectId(value).toHexString() !== value) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
