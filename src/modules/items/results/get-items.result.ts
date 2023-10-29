import { ITEM_CONDITION } from '@prisma/client';

export class ItemResultDTO {
  media: string[];
  liked: boolean;
  name: string;
  condition: ITEM_CONDITION;
  price: number;
  sellerId: string;
  sellerName: string;
  sellerCountry: string;
  sellerRating: number;
}
