export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  const status = err.status || 400;

  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};
