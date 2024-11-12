const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ranjana@1234567s';

function verifyToken(req, res, next) {
  let token ;
  let authHeader = req.headers.Authorization || req.headers.authorization
  if(authHeader && authHeader.startsWith("Bearer")){
    token = authHeader.split(" ")[1]
    if(!token){
         return res.status(401).json({message : "No Token , authorization denie"})
    }
    try {
      const decode = jwt.verify(token , process.env.JWT_SECRET)
      req.user = decode;
      console.log("The decoded user is :",  req.user)
      next()
    } catch (error) {
      res.status(400).json({message : "token in not valid"})
    }
    
  }
  else{
    return  res.status(401).json({message : "authorization failed"})
  }
  
  // if (!token) {
  //   return res.status(401).json({ msg: 'Authorization failed, token missing' });
  // }

  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET);
  //   req.userId = decoded.id;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ msg: 'Invalid token' });
  // }
}

module.exports = verifyToken;