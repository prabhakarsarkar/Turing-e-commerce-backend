
module.exports = (orders, knex, verifytoken, jwt) => {
  orders.post('/orders', verifytoken, (req, res) => {
    let token = req.headers.cookie.slice(4)
    jwt.verify(token, "prabhakar", (err, verifydata) => {
      if (!err) {
        //  console.log(data);

        knex.select('*')
          .from("shopping_cart")
          .where("shopping_cart.cart_id", req.body.id)
          .join("product", function () {
            this.on("product.product_id", "shopping_cart.product_id")
          })
          .then((data) => {
            console.log(data);
            knex('orders')
              .insert({
                "total_amount": data[0].quantity * data[0].price,
                "created_on": new Date(),
                'customer_id': verifydata.customer_id,
                "shipping_id": req.body.shipping_id,
                "tax_id": req.body.tax_id
              })
              .then((result) => {
                // res.send("insert")
                console.log(data[0].price);

                knex("order_detail")
                  .insert({
                    "unit_cost": data[0].price,
                    "quantity": data[0].quantity,
                    "product_name": data[0].name,
                    "attributes": data[0].attributes,
                    "product_id": data[0].product_id,
                    "order_id": result[0]
                  })
                  .then(() => {
                    console.log("done");
                    knex('shopping_cart')
                      .where('shopping_cart.cart_id', req.body.id)
                      .del()
                      .then((data1) => {
                        console.log("delete");
                        res.send({ 'orders': result[0] })

                      }).catch((err) => {
                        res.send(err)
                      })

                  }).catch((err) => {
                    res.send(err)
                  })

              }).catch((err) => {
                res.send(err)
              })

          }).catch((err) => {
            res.send(err)
          })

      } else { console.log("token is not avbelibel") }
    })

  })
  orders.get('/orders/:orders_id', verifytoken, (req, res) => {
    let token = req.headers.cookie.slice(4)
    jwt.verify(token, "prabhakar", (err, verifytoken) => {
      if (!err) {
        knex
          .select('*')
          .from("order_detail")
          .where('item_id', req.params.orders_id)
          .then((data) => {
            var arr = []
            for (i of data) {
              let subtotal = data[0].quantity * data[0].unit_cost
              i.subtotal = subtotal
              arr.push(i)
            }
            res.send(arr)
          }).catch((err) => {
            res.send(err)
          })

      } else {
        res.send("token is not avleble")
      }

    })

  })

  orders.get("/order/incustomer", verifytoken, (req, res) => {
    let token = req.headers.cookie.slice(4)
    jwt.verify(token,"prabhakar",(err,verifytoken)=>{
      if(!err){
        knex("orders")
        .select('*')
        .where("customer_id",verifytoken.customer_id)
        .then((data)=>{
          res.send(data)
        })
        .catch((err)=>{
          res.send(err)
        })
      }
    })

  })
  orders.get("/orders/shortdetail/:id",verifytoken,(req,res)=>{
    let token = req.headers.cookie.slice(4)
    jwt.verify(token,"prabhakar",(err,verifytoken)=>{
      if(!err){
        knex
        .select(
          'orders.order_id',
          'orders.total_amount',
          "orders.created_on",
          'orders.shipped_on',
          "orders.status",
          'order_detail.product_name as name'
        )
        .from('orders')
        .join('order_detail',function(){
          this.on("order_detail.order_id",'orders.order_id')})
          .where('orders.order_id',req.params.id)
          .then((data)=>{
            res.send(data)
          })
          .catch((err)=>{
            res.send(err)
          })
      }
    })
  })
}