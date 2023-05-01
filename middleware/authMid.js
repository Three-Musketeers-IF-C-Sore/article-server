const jwt = require("jsonwebtoken");

exports.authMid = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
          message: "Unauthorized"
        })
    }

    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
    next(); 

  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
}