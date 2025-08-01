export const success = (
  res,
  data: any = null,
  message = "OK",
  status = 200
) => {
  return res.status(status).json({
    success: true,
    code: status,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const error = (
  res,
  {
    status = 500,
    message = "Une erreur est survenue.",
    code = status,
    data = null,
    errors,
  }
) => {
  return res.status(status).json({
    code,
    message,
    data,
    ...(errors ? { errors } : { data }),
  });
};
