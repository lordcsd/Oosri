export const configConstants = {
  PORT: 'PORT',
  encryptor: { key: 'ENCRYPTOR_SECRET_KEY' },
  PRISMA_CLIENT: 'prismaClient',
  jwt: {
    secret: 'JWT_SECRET',
  },
  cloudinary: {
    providerName: 'Cloudinary',
    projectFolder: 'oosri',
    name: 'CLOUDINARY_NAME',
    apiKey: 'CLOUDINARY_API_KEY',
    apiSecret: 'CLOUDINARY_SECRET',
  },
  google: {
    auth: {
      clientId: 'GOOGLE_CLIENT_ID',
      clientSecret: 'GOOGLE_CLIENT_SECRET',
      callbackUrl: 'GOOGLE_CALLBACK_URL',
    },
  },
  frontend: {rootURL :'FRONTEND_ROOT'}
};
