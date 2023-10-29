import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CategoryAndBrandsResult } from './results/category-and-brand.result';
import { GetItemsDTO } from './dto/get-items.dto';
import { ItemResultDTO } from './results/get-items.result';

@Injectable()
export class ItemService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCategoriesAndBrands() {
    const categories = await this.prismaService.itemCategory.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        brands: { select: { id: true, name: true, imageUrl: true } },
      },
    });

    return CategoryAndBrandsResult.from(
      categories,
      201,
      'Categories and Brands Fetched',
    );
  }

  async getItems(queries: GetItemsDTO, userId?: string) {
    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      country,
      condition,
    } = queries;

    const [queryResult]: ItemResultDTO[] = await this.prismaService.$queryRaw`
      SELECT 
        im."url" as "media",
        i."name" as "name",
        i."condition" as "condition",
        i."price" as "price",
        seller."id" as "sellerId",
        seller."name" as "sellerName",
        seller."country" as "sellerCountry",
        seller."averageRating" as "sellerRating"
      FROM
        "Item" i
      LEFT JOIN "ItemMedia" im ON i."id" = im."itemId"
      LEFT JOIN "SellerProfile" sp ON sp."id" = i."sellerId"
      LEFT JOIN 
        (
          SELECT 
            u."firstName" || ' ' || u."lastName" as "name",
            u."id" as "id",
            u."country" as "country",
            sp."id" as "profileId",
            selleritems."averageRating" as "averageRating"
          FROM
            "User" u
          JOIN "SellerProfile" sp ON sp."id" = u."sellerProfileId"
          LEFT JOIN "Item" i ON i."sellerId" = sp."id"

          LEFT JOIN
            (
              SELECT
                AVG(br.stars) as "averageRating",
                i."sellerId" as "sellerId"
              FROM
                "Item" i
              LEFT JOIN "BuyerReview" br ON br."itemId" = i."id"
              group BY i."sellerId"
            ) as selleritems
          ON selleritems."sellerId" = sp."id"

        ) as seller
      ON seller."id" = i."sellerId"
      WHERE
          i."id" IS NOT NULL
    `;
  }
}
