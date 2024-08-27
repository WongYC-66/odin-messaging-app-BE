var jwt = require('jsonwebtoken')

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>


// middleware jwt function, verifyToken
exports.verifyTokenExist = (req, res, next) => {
  const bearerHeader = req.headers['authorization']

  if (bearerHeader == undefined) {
    // forbidden
    return res.sendStatus(401)  // no token sent
  }

  const bearerToken = bearerHeader.split(' ')[1]
  if (!bearerToken)
    return res.sendStatus(401)  // no token sent

  req.token = bearerToken
  next()
};

exports.extractToken = function (req) {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader)
    return ''

  const bearerToken = bearerHeader.split(' ')[1]
  if (!bearerToken)
    return ''

  return bearerToken
};