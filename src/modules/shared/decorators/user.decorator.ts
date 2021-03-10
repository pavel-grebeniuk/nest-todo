import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlExecutionContext = GqlExecutionContext.create(ctx);
    const context = gqlExecutionContext.getContext();
    return context.req.user;
  },
);
