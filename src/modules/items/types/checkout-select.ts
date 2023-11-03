import { Prisma } from '@prisma/client';

export const checkoutSelect = {
  id: true,
  items: {
    select: {
      id: true,
      units: true,
      createdAt: true,
      item: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          condition: true,
          color: { select: { id: true, name: true , hexcode: true} },
          sellerId: true,
          createdAt: true,
          brand: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              category: {
                select: { id: true, name: true, imageUrl: true },
              },
            },
          },
        },
      },
    },
  },
};
