import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class DefaultCategoryPipe implements PipeTransform {
  transform(value: any) {
    if (!value.categories.length) {
      value.categories = ['other'];
      return value;
    }
    value.categories = value.categories.map((category) =>
      category === '' ? 'other' : category.toLowerCase().trim(),
    );
    return value;
  }
}
