import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthService } from './auth.service';
import { CheckAdminType } from '../../../../common/decorators/check-admin-group.decorator';
import { ADMIN_TYPE } from '../../../../common/enum/admin-types.enum';
import { CreateAdminResult } from './result/create-admin.result';
import { CreateAdminDTO } from './dto/create-admin.dto';
import { GetCurrentUser } from '../../../../common/decorators/user.decorator';
import { GetCurrentUserId } from '../../../../common/decorators/get-current-user-id.decorator';
import { AdminLoginResult } from './result/admin-login.result';
import { LoginDTO } from '../../../auth/dto/register.dto';
import { Public } from '../../../../common/decorators/public.decorator';

@Controller('admin-auth')
@ApiTags('Admin Auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @Post('create-admin')
  @CheckAdminType(ADMIN_TYPE.SUPER_ADMIN)
  @ApiResponse({ type: CreateAdminResult, status: 201 })
  @ApiBearerAuth()
  async createAdmin(
    @Body() payload: CreateAdminDTO,
    @GetCurrentUserId() createdBy: number,
  ) {
    return this.authService.create(payload, createdBy);
  }

  @Post('login')
  @ApiResponse({
    status: 201,
    type: AdminLoginResult,
  })
  @Public()
  async login(@Body() payload: LoginDTO) {
    return this.authService.login(payload);
  }
}
