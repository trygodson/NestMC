import { AuthGuard } from '@nestjs/passport';

export class LoacalAuthGuard extends AuthGuard('local') {}
