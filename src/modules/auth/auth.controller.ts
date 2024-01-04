import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDTO, RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserRegisterResultDTO } from './results/register.result';
import { BuyerLoginResult, SellerLoginResult } from './results/login.result';
import { UserProfileResult } from './results/user-profile.dto';
import { CheckUserType } from '../../common/decorators/check-user-group.decorator';
import { USER_TYPE } from '../../common/enum/user-types.enum';

import { GetCurrentUserId } from '../../common/decorators/get-current-user-id.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/me')
  @ApiBearerAuth()
  @CheckUserType(USER_TYPE.BUYER, USER_TYPE.SELLER)
  @ApiResponse({
    status: 201,
    type: UserProfileResult,
  })
  async getUserProfile(@GetCurrentUserId() userId: number) {
    return await this.authService.getProfile(userId);
  }

  @Post('buyer/register')
  @Public()
  @ApiResponse({
    type: UserRegisterResultDTO,
    status: 200,
  })
  async registerBuyer(@Body() payload: RegisterDTO) {
    return await this.authService.register(payload, false);
  }

  @Post('buyer/login')
  @Public()
  @ApiResponse({ type: BuyerLoginResult, status: 200 })
  async loginBuyer(@Body() payload: LoginDTO) {
    return await this.authService.login(payload);
  }

  @Post('seller/register')
  @Public()
  @ApiResponse({
    type: UserRegisterResultDTO,
    status: 200,
  })
  async registerSeller(@Body() payload: RegisterDTO) {
    return await this.authService.register(payload, true);
  }

  @Post('seller/login')
  @Public()
  @ApiResponse({ type: SellerLoginResult, status: 200 })
  async loginSeller(@Body() payload: LoginDTO) {
    return await this.authService.login(payload, true);
  }

  // Google Auth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // Initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request): Promise<void> {
    // Handles the Google OAuth2 callback
    // Redirect or respond as needed after successful login
  }
}
