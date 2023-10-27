import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDTO, RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { UserRegisterResultDTO } from './results/register.result';
import { BuyerLoginResult, SellerLoginResult } from './results/login.result';

@Controller('auth/buyer')
@ApiTags('Buyer Auth')
export class AuthBuyerController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiResponse({
    type: UserRegisterResultDTO,
    status: 200,
  })
  async registerBuyer(@Body() payload: RegisterDTO) {
    return await this.authService.register(payload, false);
  }

  @Post('login')
  @Public()
  @ApiResponse({ type: BuyerLoginResult, status: 200 })
  async loginBuyer(@Body() payload: LoginDTO) {
    return await this.authService.login(payload);
  }
}

@Controller('auth/seller')
@ApiTags('Seller Auth')
export class AuthSellerController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiResponse({
    type: UserRegisterResultDTO,
    status: 200,
  })
  async registerSeller(@Body() payload: RegisterDTO) {
    return await this.authService.register(payload, true);
  }

  @Post('login')
  @Public()
  @ApiResponse({ type: SellerLoginResult, status: 200 })
  async loginSeller(@Body() payload: LoginDTO) {
    return await this.authService.login(payload, true);
  }
}
