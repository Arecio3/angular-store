// gets ran when their is an error with API
function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    //   Jwt authentication error
    return res.status(401).json({ message: "User not authorized"});
  }
    // validation error
  if (err.name === 'ValidationError') {
      return res.status(401).json({message: err})
  }
//   Default server error
  return res.status(500).json(err)
};

module.exports = errorHandler;