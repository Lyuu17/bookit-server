import { CanActivate, ExecutionContext, Injectable, Type, mixin } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';
import { PropertiesService } from './properties.service';

/* https://stackoverflow.com/a/62046792 */
export const PropertiesGuard = (reqParam: string): Type<CanActivate> => {
  @Injectable()
  class PropertiesGuardMixin implements CanActivate {
    constructor(private readonly propertiesService: PropertiesService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user, params } = context.switchToHttp().getRequest();
      const id = params[reqParam];

      const { adminUsers } = await this.propertiesService.findOne(id);
      return [...adminUsers].map(id => id.toString()).includes(user.userId) || user.roles?.includes(Role.ADMIN);
    }
  }

  const guard = mixin(PropertiesGuardMixin);
  return guard;
}