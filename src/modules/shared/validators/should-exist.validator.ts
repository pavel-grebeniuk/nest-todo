import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type constraintsType = {
  constraints?: {
    service: new (...args: any[]) => any;
    reverse?: boolean;
    prop?: string;
  }[];
};

@Injectable()
@ValidatorConstraint({ async: true })
export class ShouldExistValidator implements ValidatorConstraintInterface {
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(value: any, { constraints }: constraintsType) {
    const [{ service, reverse = false, prop = 'id' }] = constraints;
    const injectedService = this.moduleRef.get(service, { strict: false });
    const instance = await injectedService.findOneActive({
      [prop]: value,
    });
    return reverse ? !instance : !!instance;
  }

  defaultMessage({ constraints }: constraintsType) {
    const [{ reverse = false }] = constraints;
    return reverse ? 'ALREADY_EXISTS' : 'DOES_NOT_EXIST';
  }
}
