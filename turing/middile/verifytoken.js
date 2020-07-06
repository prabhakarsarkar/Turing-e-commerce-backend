module.exports=(req,res,next)=>{
    var token=req.headers.cookie;
    if(token!==undefined){
        if(token.startsWith('KEY=')){
            next()
        }else{
            console.log('err in getting token in VerifyToken.js')
        }

    }else{
        console.log("no token");
        
    }
}

