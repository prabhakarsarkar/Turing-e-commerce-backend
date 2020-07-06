module.exports = (shipping,knex)=>{
    shipping.get('/shipping/regions',(req,res)=>{
        knex.select('*')
        .from('shipping_region')
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    shipping.get('/shipping/regions/:shipping_region_id',(req,res)=>{
        knex('shipping')
        .where('shipping_region_id',req.params.shipping_region_id)
        .then((data)=>{
            if(data.length>0){
                res.send(data)
            }else{
                res.send('this shipping_region_id is validit')
            }
            
        })
        .catch((err)=>{
            res.send(err)
        })
    })
}