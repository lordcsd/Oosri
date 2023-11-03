import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma.service';
import {
  CloudinaryService,
  MediaFolderEnum,
} from '../../../../utils/media/cloudinary.service';
import {
  UpsertBrandDTO,
  UpsertCategoryDTO,
  UpsertItemColorDTO,
} from './dto/category-item.dto';
import {
  UpsertBrandResult,
  UpsertCategoryResult,
} from './result/upsert-category.result';
import { BaseResult } from '../../../../results/base.result';
import { UpsertItemColorResult } from './result/upsert-item-color.result';

@Injectable()
export class AdminItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async upsertCategory(payload: UpsertCategoryDTO) {
    const { image, ...nameAndId } = payload;
    const { name, id } = nameAndId;

    if (!Object.keys(payload).length) {
      throw new UnprocessableEntityException('Please Provide Some Fields');
    }

    if (!name && !id) {
      throw new UnprocessableEntityException(
        'For new categories please provide a name at least',
      );
    }

    const fetched = await this.prisma.itemCategory.findMany({
      where: {
        OR: Object.keys(nameAndId).map((key) => ({ [key]: nameAndId[key] })),
      },
    });

    const idValid = fetched.find((one) => one.id == id);

    if (id && !idValid) {
      throw new NotFoundException('Invalid Item id');
    }

    if (idValid && idValid.imageUrl) {
      await this.cloudinary.deleteMedia(idValid.imageProviderId);
    }

    const nameInUse = fetched.find((one) => one.name == name);
    if ((nameInUse && id && id != nameInUse.id) || (nameInUse && !id)) {
      throw new ConflictException('Name Already in use');
    }

    const uploadedImage =
      image &&
      (await this.cloudinary.uploadMedia(
        image,
        MediaFolderEnum.CATEGORY_IMAGE,
      ));

    const category = id
      ? await this.prisma.itemCategory.update({
          where: { id },
          data: {
            ...nameAndId,
            ...(uploadedImage && {
              imageUrl: uploadedImage.url,
              imageProviderId: uploadedImage.public_id,
            }),
          },
          select: { id: true, name: true, imageUrl: true },
        })
      : await this.prisma.itemCategory.create({
          data: {
            name,
            ...(uploadedImage && {
              imageUrl: uploadedImage.url,
              imageProviderId: uploadedImage.public_id,
            }),
          },
        });

    return UpsertCategoryResult.from(category, 'Category Upserted', 201);
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.itemCategory.findFirst({
      where: { id },
      select: {
        id: true,
        imageProviderId: true,
        brands: { select: { id: true } },
      },
    });

    if (!category) {
      throw new NotFoundException('Invalid category id');
    }

    if (category.brands.length) {
      throw new NotAcceptableException(
        'Category is already in use, update instead',
      );
    }

    await this.prisma.itemCategory.delete({ where: { id } });

    if (category.imageProviderId) {
      await this.cloudinary.deleteMedia(category.imageProviderId);
    }

    return new BaseResult(200, 'Category deleted');
  }

  async upsertBrand(payload: UpsertBrandDTO) {
    const { image, ...others } = payload;
    const { name, id, categoryId } = others;

    if (!Object.keys(payload).length) {
      throw new UnprocessableEntityException('Please Provide Some Fields');
    }

    if ((!name && !id) || (!name && !id && !categoryId)) {
      throw new UnprocessableEntityException(
        'For new brands please provide a name at least and category',
      );
    }

    const fetched = await this.prisma.itemBrand.findMany({
      where: {
        OR: Object.keys(others).map((key) => ({ [key]: others[key] })),
      },
    });

    const idValid = fetched.find((one) => one.id == id);
    if (id && !idValid) {
      throw new NotFoundException('Invalid Item id');
    }

    if (idValid && idValid.imageUrl) {
      await this.cloudinary.deleteMedia(idValid.imageProviderId);
    }

    const nameInUse = fetched.find((one) => one.name == name);
    if ((nameInUse && id && id != nameInUse.id) || (nameInUse && !id)) {
      throw new ConflictException('Name Already in use');
    }

    const uploadedImage =
      image &&
      (await this.cloudinary.uploadMedia(image, MediaFolderEnum.BRAND_IMAGE));

    const brand = id
      ? await this.prisma.itemBrand.update({
          where: { id },
          data: {
            ...others,
            ...(uploadedImage && {
              imageUrl: uploadedImage.url,
              imageProviderId: uploadedImage.public_id,
            }),
          },
          select: { id: true, name: true, imageUrl: true, categoryId: true },
        })
      : await this.prisma.itemBrand.create({
          data: {
            name,
            categoryId,
            ...(uploadedImage && {
              imageUrl: uploadedImage.url,
              imageProviderId: uploadedImage.public_id,
            }),
          },
        });

    return UpsertBrandResult.from(brand, 201, 'Brand Upserted');
  }

  async deleteBrand(id: number) {
    const brand = await this.prisma.itemBrand.findFirst({
      where: { id },
      select: {
        id: true,
        imageProviderId: true,
        items: { select: { id: true } },
      },
    });

    if (!brand) {
      throw new NotFoundException('Invalid brand id');
    }

    if (brand.items.length) {
      throw new NotAcceptableException(
        'Brand already has items, update instead',
      );
    }

    await this.prisma.itemBrand.delete({ where: { id } });
    if (brand.imageProviderId) {
      await this.cloudinary.deleteMedia(brand.imageProviderId);
    }

    return new BaseResult(200, 'Brand deleted');
  }

  async upsertColor(payload: UpsertItemColorDTO) {
    const { id, name, hexcode } = payload;

    if (!Object.keys(payload).length) {
      throw new UnprocessableEntityException('Please provide update fields');
    }

    if (!id && (!name || !hexcode)) {
      throw new UnprocessableEntityException(
        'Name and Hexcode must be provided for new colors',
      );
    }

    const fetched = await this.prisma.itemColor.findMany({
      where: {
        OR: [
          ...(name ? [{ name }] : []),
          ...(id ? [{ id }] : []),
          ...(hexcode ? [{ hexcode }] : []),
        ],
      },
    });

    const exist = id && fetched.find((one) => one.id == id);
    if (id && !exist) {
      throw new NotFoundException('Invalid Id');
    }

    const nameInUse = name && fetched.find((one) => one.name == name);
    if (nameInUse && nameInUse.id != exist.id) {
      throw new ConflictException('Color name aleady in use');
    }

    const hexcodeInUse =
      hexcode && fetched.find((one) => one.hexcode == hexcode);
    if (hexcodeInUse && hexcodeInUse.id == exist.id) {
      throw new ConflictException('Hexcode aleady in use');
    }

    const color = id
      ? await this.prisma.itemColor.update({
          where: { id },
          data: payload,
          select: { id: true, name: true, hexcode: true, createdAt: true },
        })
      : await this.prisma.itemColor.create({ data: { name, hexcode } });

    return UpsertItemColorResult.from(color, 'Item Color upserted', 200);
  }

  async deleteItemColor(id: number) {
    const color = await this.prisma.itemColor.findFirst({
      where: { id },
      select: { id: true, items: { select: { id: true } } },
    });

    if (!color) {
      throw new NotFoundException('Invalid brand id');
    }

    if (color.items.length) {
      throw new NotAcceptableException(
        'Color already has items, update instead',
      );
    }

    await this.prisma.itemColor.delete({ where: { id } });

    return new BaseResult(200, 'Color deleted');
  }
}
