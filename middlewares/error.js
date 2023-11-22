const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: false,
    message: "Not found",
  });
};

const internalErrorHandler = (err, req, res) => {
  return res.status(500).json({
    status: false,
    message: err.message,
  });
};

module.exports = {
  notFoundHandler,
  internalErrorHandler,
};
