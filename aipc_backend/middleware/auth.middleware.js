const jwt = require('jsonwebtoken');
// const log = require('log-to-file');

// module.exports = (req, res, next) => {
module.exports = (req, res, next) => {
    if (req.headers.authorization && typeof req.headers.authorization === 'string') {  
        // log(JSON.stringify(req.headers, null, 3), 'headers.log')

        if(req.headers.authorization.split('Bearer').length == 1)          
        {
            return res.send(ResponseObj.fail('you are not authorise'))
        }
        const token = req.headers.authorization.split('Bearer')[1].replace(' ', '')
        
        if (token != null) {
            let accessDenied = false
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            jwt.verify(token, jwtSecretKey, function(err, decoded) {
                if(err)
                {
                    return res.send(ResponseObj.fail('you are not authorise'))
                }
                else
                {
                  req.user = decoded
                  next()
                }
          });
            // const verified = jwt.verify(token, jwtSecretKey);
            // console.log(verified)
            // if(verified)
            // {
            //     accessDenied = true
            // }
            // if (!accessDenied) return res.send(UNAUTHORISED)
        } else  return res.send(ResponseObj.fail('you are not authorise'))

    } else return  res.send(ResponseObj.fail('you are not authorise'))

    // next()
    
}

function typeConversion(user) {
    if (typeof user === 'string') return [user]
        else if (user.length > 0) return user
            else  ResponseObj.fail('you are not authorise')

    }