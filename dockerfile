FROM node:18.10.0-alpine AS development 

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./prisma ./prisma

RUN yarn install --only=development

RUN yarn prisma generate

COPY . .

RUN yarn build

FROM node:18.10.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./prisma ./prisma

COPY package*.json ./

RUN yarn install --only=production

RUN yarn prisma generate

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]