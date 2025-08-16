export const sendRes = (res, statusCode) => {
  return res.status(statusCode).json(res);
};
