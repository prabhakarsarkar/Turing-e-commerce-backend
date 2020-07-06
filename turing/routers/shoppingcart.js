module.exports = (shoppingcart, knex) => {
    shoppingcart.get("/d", (req, res) => {
        let cartId = ''
        let string = 'abcdefghigklmnopqrstuvxyzADNDKD123456789QWE'
        for (let i = 0; i < 12; i++) {
            cartId += string.charAt(Math.floor(Math.random() * string.length))
        }
        var cart_id = ({ 'cart_id': cartId })
        res.send(cart_id);


    })
    shoppingcart.post('/add', (req, res) => {
        let cart_id = req.body.cart_id
        let product_id = req.body.product_id
        let attributes = req.body.attributes
        knex.
            select('*')
            .from('shopping_cart')
            .where('cart_id', cart_id)
            .andWhere('product_id', product_id)
            .andWhere('attributes', attributes)
            .then((data) => {
                if (data.length == 0) {
                    knex('shopping_cart')
                        .insert({
                            'cart_id': cart_id,
                            'product_id': product_id,
                            'attributes': attributes,
                            'quantity': req.body.quantity,
                            'added_on': new Date()
                        })
                        .then((data) => {
                            knex
                                .select('item_id',
                                    'name', 'attributes',
                                    'shopping_cart.product_id', 'image', 'price', 'quantity')
                                .from('shopping_cart')
                                .join('product', function () {
                                    this.on('product.product_id', 'shopping_cart.product_id')
                                })
                                .then((data) => {
                                    res.send(data)
                                }).catch((err) => {
                                    res.send(err)
                                })

                        }).catch((err) => {
                            res.send(err)
                        })
                } else {
                    let quantity = data[0].quantity + 1
                    knex('shopping_cart')
                        .update({ quantity: quantity })
                        .then((data) => {
                            knex
                                .select('item_id',
                                    'name', 'attributes',
                                    'shopping_cart.product_id', 'image',
                                    'price', 'quantity')
                                .from('shopping_cart')
                                .join('product', function () {
                                    this.on('product.product_id', 'shopping_cart.product_id')
                                })
                                .then((data) => {
                                    let update = []
                                    for (i of data) {
                                        let subtotal = i.quantity * i.price
                                        i.subtotal = subtotal
                                        update.push(i)

                                    } res.send(update)

                                }).catch((err) => {
                                    res.send(err)
                                })

                        }).catch((err) => {
                            res.send(err)
                        })

                }
            })
            .catch((err) => {
                res.send(err)
            })
    })

    shoppingcart.get('/cart/:cart_id', (req, res) => {
        let id = req.params.cart_id
        console.log(id);

        knex
            .select('item_id',
                'name', 'attributes',
                'shopping_cart.product_id', 'image',
                'price', 'quantity')
            .from('shopping_cart')
            .join('product', function () {
                this.on('product.product_id', 'shopping_cart.product_id')
            })
            .where('shopping_cart.cart_id', id)
            .then((data) => {
                let data1 = []
                for (i of data) {
                    console.log(i.quantity);

                    let subtotal = i.quantity * i.price
                    i.subtotal = subtotal
                    data1.push(i)
                }
                res.send(data1)
            })
            .catch((err) => {
                res.send(err)
            })


    })
    shoppingcart.put("/update/:id", (req, res) => {
        let quantity = req.body.quantity

        knex('shopping_cart')
            .where('item_id', req.params.id)
            .update(
                'quantity', quantity
            )
            .then(() => {
                // console.log("ok");

                knex.select(
                    "item_id",
                    "product.name",
                    "shopping_cart.attributes",
                    "product.price",
                    'quantity'

                )
                    .from("shopping_cart")
                    .join("product", function () {
                        this.on('product.product_id', 'shopping_cart.product_id')
                    })
                    .where('shopping_cart.item_id', req.params.id)
                    .then((data1) => {
                        let arr = []
                        for (i of data1) {
                            let subtotal = i.price * i.quantity
                            i.subtotal = subtotal

                            arr.push(i)


                        }
                        res.send(arr)

                    })
                    .catch((err) => { res.send(err) })


            }).catch((err) => { res.send(err) })

    })

    shoppingcart.delete("/delete/:id", (req, res) => {
        let cart_id = req.params.id
        console.log(cart_id);
        knex('shopping_cart')
            .where('shopping_cart.cart_id', cart_id)
            .del()
            .then((data) => {
                res.send("delete")
            })

    })
    shoppingcart.get("/amount/:id", (req, res) => {
        let cart_id = req.params.id
        console.log(cart_id);

        knex
            .select(

                'price',
                'quantity'
            )
            .from('shopping_cart')
            .join('product', function () {
                this.on('product.product_id', 'shopping_cart.product_id')
            })
            .where('shopping_cart.cart_id', cart_id)
            .then((data) => {
                let arr = []
                for (i of data) {
                    let total_amount = i.quantity * i.price
                    i.total_amount = total_amount
                    arr.push(i)

                }
                res.send(arr)
            })
            .catch((err) => {
                res.send(err)
            })

    })

    shoppingcart.get('/lee/:id', (req, res) => {
        let item_id = req.params.id
        knex.schema
            .hasTable('save_later')
            .then((exists) => {
                if (!exists) {
                    return knex.schema.createTable('save_later', (t) => {
                        console.log('ok');

                        t.integer('item_id').primary();
                        t.string('cart_id');
                        t.integer('product_id');
                        t.string('attributes');
                        t.string('quantity');
                        t.string('buy_now');
                        t.datetime('added_on');


                    })
                } else {
                    console.log("yes");
                    knex('shopping_cart')
                        .select(
                            'shopping_cart.item_id',
                            'shopping_cart.cart_id',
                            'shopping_cart.product_id',
                            'shopping_cart.attributes',
                            'shopping_cart.quantity',
                            'shopping_cart.buy_now',
                            'shopping_cart.added_on'
                        )
                        .where('shopping_cart.item_id', item_id)
                        .then((data) => {
                            if (data.length > 0) {
                                knex('save_later')
                                    .insert(data[0])
                                    .then(() => {
                                        res.send('ok')
                                    }).catch((err) => {
                                        res.send(err)
                                    })
                            } else {
                                res.send('this data is not exists')
                            }
                        }).catch((err) => {
                            res.send(err)
                        })



                }
            })
    })
    shoppingcart.get('/move/:id', (req, res) => {
        let item_id = req.params.id
        knex.schema
        .hasTable('cart')
        .then((exists)=>{
            if(!exists){
                return knex.schema.createTable('cart',(t)=>{

                    t.integer('item_id').primary();
                    t.string('cart_id');
                    t.integer('product_id');
                    t.string('attributes');
                    t.string('quantity');
                    t.string('buy_now');
                    t.datetime('added_on');

                })
            }else{
                console.log("allredy exists");
                knex.select('*')
                .from('save_later')
                .where('item_id',item_id)
                .then((data)=>{
                   if(data.length>0){
                       knex('cart')
                       .insert(data[0])
                       .then((result)=>{
                           console.log("data insert in done");
                        knex('save_later')
                        .where('item_id',item_id)
                        .del()
                        .then((delet)=>{
                            res.send('delete successfull')
                        })
                           
                       })
                   }else{
                       res.send('this item not exists')
                   }
                })

            }
        })
    })
    shoppingcart.get("/later/:id", (req, res) => {
        var cart_id = req.params.id
        console.log(cart_id);

        knex
            .select(
                'item_id',
                'name',
                'save_later.attributes',
                'price'
            )
            .from('save_later')
            .join('product', function () {
                this.on('product.product_id', 'save_later.product_id')
            })
            .where('save_later.cart_id', cart_id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    shoppingcart.delete("/deletee/:id1", (req, res) => {
        let item_id = req.params.id1
        knex('shopping_cart')
            .where('shopping_cart.item_id', item_id)
            .del()
            .then((data) => {
                res.send('delete successfull')
            })
            .catch((err) => {
                res.send(err)
            })
    })
}
