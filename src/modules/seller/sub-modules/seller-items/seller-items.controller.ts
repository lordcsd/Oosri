import { Controller } from '@nestjs/common';
import { SellerItemsService } from './seller-items.service';

@Controller('seller-items')
export class SellerItemsController {
  constructor(private readonly sellerItemsService: SellerItemsService) {}
}
