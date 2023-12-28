import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CloudinaryService,
  MediaFolderEnum,
} from '../../../../utils/media/cloudinary.service';
import { PrismaService } from '../../../shared/prisma.service';
import { SubmitItemDTO } from '../../dto/sumbit-items.dto';
import { SubmitItemResult } from '../../results/submit-item.result';

@Injectable()
export class SellerItemService {
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
}
