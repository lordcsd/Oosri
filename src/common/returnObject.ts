export const returnObject = (
  data: any,
  message: string,
  status: 200 | 201,
) => ({
  data,
  message,
  status,
});
