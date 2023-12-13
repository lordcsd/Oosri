import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { CategoryAndBrandsResult } from './results/category-and-brand.result';
import { GetItemsDTO } from './dto/get-items.dto';
import { ItemResultDTO, ManyItemsResult } from './results/get-items.result';
import { ITEM_SUBMISSION_STATUS, Prisma } from '@prisma/client';
import { GetCartResult } from './results/add-item-to-cart.result';
import { checkoutSelect } from './types/checkout-select';
import { SubmitItemDTO } from './dto/sumbit-items.dto';
import {
  CloudinaryService,
  MediaFolderEnum,
} from '../../utils/media/cloudinary.service';
import { SubmitItemResult } from './results/submit-item.result';
import { GetColorsDTO } from './dto/get-colors.dto';
import { ItemColorsResult } from './results/get-colors.result';
import { AddItemsToCartDTO, ItemDTO, RateItemDTO } from './dto/item.dto';

@Injectable()
export class ItemService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async submitItem(payload: SubmitItemDTO, sellerId: number) {
    const { media, units, ..._payload } = payload;

    const color = await this.prismaService.itemColor.findFirst({
      where: { id: _payload.colorId },
    });

    if (!color) {
      throw new NotFoundException('Invalid Color id');
    }
    const brand = await this.prismaService.itemBrand.findFirst({
      where: { id: _payload.brandId },
    });

    if (!brand) {
      throw new NotFoundException('Invalid brand id');
    }

    const itemExist = await this.prismaService.item.findFirst({
      where: { ..._payload, releasedUnits: units, unitsLeft: units },
    });

    if (itemExist) {
      throw new ConflictException(
        'Item with same details already exist, please update instead',
      );
    }

    const uploads = async () => {
      const uploads = await Promise.all(
        media.map((_media) =>
          this.cloudinary.uploadMedia(_media, MediaFolderEnum.PRODUCT_MEDIA),
        ),
      );
      return uploads.map(({ url, public_id: providerId }) => ({
        url,
        providerId,
      }));
    };

    const { colorId, brandId, ...others } = _payload;

    const item = await this.prismaService.item.create({
      data: {
        ...others,
        releasedUnits: units,
        unitsLeft: units,
        initialPrice: others.price,
        colorId,
        brandId,
        sellerId,
        ...(media &&
          media.length && {
            media: {
              createMany: {
                data: await uploads(),
              },
            },
          }),
      },
      include: { media: true },
    });

    return SubmitItemResult.from(item, 'Item Submitted', 200);
  }

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

  async getItems(queries: GetItemsDTO, userId: number | null = null) {
    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      country,
      condition,
      sortBy,
      sortDirection,
      page,
      limit,
    } = queries;

    const whereQueries: string[] = [
      `i."status" != '${ITEM_SUBMISSION_STATUS.ADMIN_REJECTED}'`,
      `i."price" >= ${minPrice} `,
    ];

    categoryId && whereQueries.push(`brand."categoryId" = ${categoryId}`);
    brandId && whereQueries.push(`i."brandId" = ${brandId}`);
    maxPrice && whereQueries.push(`i."price" <= ${maxPrice}`);
    country && whereQueries.push(`seller."country" ILIKE '${country}'`);
    condition && whereQueries.push(`i."condition" = '${condition}'`);
    search &&
      whereQueries.push(
        `(${search
          .split(' ')
          .map((f) => f.trim())
          .filter(Boolean)
          .map((strn) => `i."name" ILIKE '%${strn}%'`)
          .join(' OR ')})`,
      );

    const sql = `
      SELECT 
        i.id as "id",
        i."name" as "name",
        i."condition" as "condition",
        i."price" as "price",
        i."brandId" as "brandId",
        brand."categoryId" as "categoryId",
        seller."id" as "sellerId",
        seller."name" as "sellerName",
        seller."country" as "sellerCountry",
        seller."averageRating" as "sellerRating",
        (${!!userId} = true AND fav."userId" = ${userId} AND fav."liked" = true) as "liked",
        i."releasedUnits" - i."unitsLeft" as "unitsSold",
        i."createdAt" as "createdAt",
        media."urls" AS  "media"
      FROM "Item" i

      LEFT JOIN 
        (
          SELECT 
            u."id" as "userId",
            bpti."A" = u."buyerProfileId" AND bpti."B" = i."id" as "liked"
          FROM
          "_BuyerProfileToItem" bpti
          LEFT JOIN "User" u ON bpti."A" = u."buyerProfileId"
          LEFT JOIN "Item" i ON bpti."B" = i."id"
        ) as fav
      ON fav."liked" = true

      LEFT JOIN 
        (
          SELECT
            ib."categoryId" as "categoryId",
            ib."id" as "id"
          FROM
          "ItemBrand" ib
        ) as brand
      ON brand."id" = i."brandId"

      LEFT JOIN
        (
          SELECT 
            ARRAY_AGG(im."url") as "urls",
            im."itemId" as "itemId"
          FROM "ItemMedia" im 
          GROUP BY im."itemId"
        ) as media
      ON media."itemId" = i."id"

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
                ROUND(AVG(COALESCE(br.stars,0)),2) as "averageRating",
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
          ${whereQueries.join(' AND ')}
      GROUP BY  
        i."name", i."condition", i."price", seller."id",
        seller."name", seller."country", seller."averageRating",
        media."urls", i."brandId", brand."categoryId",i.id,
        fav."userId", fav."liked", i."releasedUnits", i."unitsLeft"
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT ${limit} OFFSET (${(page - 1) * limit})
    `;

    const queryResult: ItemResultDTO[] =
      await this.prismaService.$queryRawUnsafe(sql);

    const baseWhere: Prisma.ItemWhereInput = {
      ...((categoryId || brandId) && {
        brand: {
          ...(brandId && { id: brandId }),
          ...(categoryId && { categoryId }),
        },
      }),
      price: { gte: minPrice, ...(maxPrice && { lte: maxPrice }) },
      ...(country && {
        seller: {
          user: {
            country: { contains: country, mode: Prisma.QueryMode.insensitive },
          },
        },
      }),
      ...(condition && { condition }),
      status: { not: ITEM_SUBMISSION_STATUS.ADMIN_REJECTED },
    };

    const where = search
      ? search
          .split(' ')
          .map((f) => f.trim())
          .filter(Boolean)
          .map((str) => ({
            ...baseWhere,
            name: { contains: str, mode: Prisma.QueryMode.insensitive },
          }))
      : [baseWhere];

    const total = await this.prismaService.item.count({ where: { OR: where } });

    for (const item of queryResult) {
      item.liked = Boolean(item.liked);
    }

    return ManyItemsResult.from(queryResult, {
      page,
      limit,
      status: 201,
      message: 'Items Fetched',
      total,
    });
  }

  private async upsertUserCart(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: {
            checkouts: {
              where: { isCart: true },
              select: checkoutSelect,
            },
          },
        },
      },
    });

    return (
      user?.buyerProfile?.checkouts[0] ||
      (await this.prismaService.checkout.create({
        data: { buyer: { connect: { id: user.buyerProfileId } } },
        select: checkoutSelect,
      }))
    );
  }

  async addItemToCart(payload: AddItemsToCartDTO, userId: number) {
    const cart = await this.upsertUserCart(userId);
    const itemIds = payload.items.map(({ id }) => id);

    const itemsNotAlreadyInCart = itemIds.filter(
      (itemId) => !cart.items.find((_item) => itemId == _item.item.id),
    );

    const items = await this.prismaService.item.findMany({
      where: { id: { in: itemsNotAlreadyInCart }, unitsLeft: { gte: 1 } },
    });

    const notFoundOrUnavailable = itemIds.filter(
      (id) => !items.find((one) => one.id == id),
    );
    if (notFoundOrUnavailable.length) {
      throw new NotFoundException(
        `Items with ids: ${notFoundOrUnavailable.join()}, were either out of stock or invalid`,
      );
    }

    if (itemsNotAlreadyInCart.length) {
      const invalidIds = itemIds.filter(
        (id) =>
          itemsNotAlreadyInCart.includes(id) &&
          !items.find((item) => item.id == id),
      );
      if (invalidIds.length) {
        throw new NotFoundException(
          `item ids ${invalidIds.join()} are invalid`,
        );
      }
    } else {
      return GetCartResult.from(cart, 201, 'Items Already Added');
    }

    // check if items have enough units
    const insufficient: { id: number; left: number; required: number }[] = [];
    for (const fetchedItem of items) {
      const _item = payload.items.find((one) => one.id == fetchedItem.id);
      if (_item && fetchedItem.unitsLeft < _item.units) {
        insufficient.push({
          id: _item.id,
          left: fetchedItem.unitsLeft,
          required: _item.id,
        });
      }
    }

    if (insufficient.length) {
      throw new UnprocessableEntityException(
        insufficient
          .map(
            ({ id, left, required }) =>
              `You required ${required} units of item with id ${id}, but only ${left} is left`,
          )
          .join(),
      );
    }

    await this.prismaService.$transaction([
      this.prismaService.checkout.update({
        where: { id: cart.id },
        data: {
          items: {
            createMany: {
              data: items.map((item) => ({
                itemId: item.id,
                units: payload.items.find((_item) => _item.id == item.id)
                  ?.units,
              })),
            },
          },
        },
        select: checkoutSelect,
      }),
      ...items.map((item) =>
        this.prismaService.item.update({
          where: { id: item.id },
          data: {
            unitsLeft: {
              decrement: payload.items.find((_item) => _item.id == item.id)
                .units,
            },
          },
        }),
      ),
    ]);

    const updatedCart = await this.upsertUserCart(userId);

    return GetCartResult.from(updatedCart, 201, 'Cart Updated');
  }

  async getCart(id: number) {
    const cart = await this.upsertUserCart(id);
    return GetCartResult.from(cart, 201, 'Cart Fetched');
  }

  async removeFromCart(ids: number[], userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      include: {
        buyerProfile: {
          include: {
            checkouts: {
              where: { isCart: true },
              take: 1,
              select: checkoutSelect,
            },
          },
        },
      },
    });

    const [_cart] = user.buyerProfile.checkouts;

    if (!_cart || !_cart.items.length) {
      throw new NotFoundException('Sorry Your Cart is empty');
    }

    const itemIdsNotInCart = ids.filter(
      (id) => !_cart.items.find(({ item }) => item.id == id),
    );

    if (itemIdsNotInCart.length) {
      throw new NotFoundException(
        `item ids not in the cart ${itemIdsNotInCart.join()}`,
      );
    }

    await this.prismaService.checkoutItem.deleteMany({
      where: { itemId: { in: ids } },
    });

    const cart = await this.upsertUserCart(userId);

    return GetCartResult.from(cart, 201, 'Items Removed');
  }

  async updateCartItemUnit(payload: AddItemsToCartDTO, userId: number) {
    const { items } = payload;
    let cart = await this.upsertUserCart(userId);

    const invalidItems = items.filter(
      (item) => !cart.items.find((_item) => _item.item.id == item.id),
    );

    if (invalidItems.length) {
      throw new NotFoundException(
        `Items with ids: ${invalidItems.map(
          ({ id }) => id,
        )}, were not on the cart`,
      );
    }

    const insufficientUnits: { id: number; left: number; required: number }[] =
      [];

    for (const item of items) {
      const cartItem = cart.items.find((_item) => _item.item.id == item.id);
      if (cartItem.units + cartItem.item.unitsLeft < item.units) {
        insufficientUnits.push({
          id: item.id,
          left: cartItem.item.unitsLeft + cartItem.units,
          required: item.units,
        });
      }
    }

    if (insufficientUnits.length) {
      throw new UnprocessableEntityException(
        insufficientUnits
          .map(
            ({ id, left, required }) =>
              `You required ${required} units of item with id ${id}, but only ${left} is left`,
          )
          .join(),
      );
    }
    await this.prismaService.$transaction([
      // update cart items
      ...items.map((item) => {
        const cartItem = cart.items.find((_item) => _item.item.id == item.id);
        return this.prismaService.checkoutItem.update({
          where: { id: cartItem.id },
          data: { units: item.units },
        });
      }),
      // update seller items
      ...items.map((item) => {
        const cartItem = cart.items.find((_item) => _item.item.id == item.id);

        const unitsDifference = item.units - cartItem.units;

        return this.prismaService.item.update({
          where: { id: cartItem.item.id },
          data: {
            // return excesses or take more if necessary
            unitsLeft: cartItem.item.unitsLeft - unitsDifference,
          },
        });
      }),
    ]);

    cart = await this.upsertUserCart(userId);
    return GetCartResult.from(cart, 201, 'Cart Updated');
  }

  async getColors({ search }: GetColorsDTO) {
    const where: Prisma.ItemColorWhereInput = {
      ...(search && {
        name: { contains: search, mode: Prisma.QueryMode.insensitive },
      }),
    };

    const colors = await this.prismaService.itemColor.findMany({
      where,
      select: {
        id: true,
        name: true,
        hexcode: true,
      },
    });

    return ItemColorsResult.from(colors, 201, 'Item colors fetched');
  }

  async rateItem(itemId: number, userId: number, payload: RateItemDTO) {
    const buyerAndProfile = await this.prismaService.user.findFirst({
      where: {
        id: userId,
        buyerProfile: {
          checkouts: { some: { items: { some: { item: { id: itemId } } } } },
        },
      },
      include: {
        buyerProfile: {
          include: {
            checkouts: {
              where: { items: { some: { item: { id: itemId } } } },
              include: { items: { include: { item: true, review: true } } },
            },
          },
        },
      },
    });
  }
}
