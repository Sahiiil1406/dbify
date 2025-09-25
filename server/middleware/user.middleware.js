const e = require('express');
const jwt=require('jsonwebtoken');

const authenticateToken=(req,res,next)=>{
    const token=req.cookies.token || req.headers['authorization']?.split(' ')[1];
    if(!token){
        console.log('No token provided');
        return res.status(401).send({
            msg:'No token provided',    
            error: 'Unauthorized'
        });
    };
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) {
            return res.status(403).send({
                msg:'Invalid token',
                error: err.message
            });
        };
        req.user=user;
        next();
    });
};

module.exports={authenticateToken};
