module.exports = (customer, knex, jwt, verify) => {
    customer.post("/customer/signup", (req, res) => {
        knex('customer')
            .insert(req.body)
            .then((data) => {
                knex.select('*')
                    .from('customer')
                    .where('customer.email', req.body.email)
                    .then((result) => {
                        delete result[0].password
                        res.send(result)
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            })
            .catch((err) => {
                res.send(err)
            })
    })



    customer.post("/customer/login", (req, res) => {
        // console.log(req.headers.cookie);

        knex('customer')
            .select('customer.email', 'customer.password',"customer.customer_id")
            .where({
                'customer.email': req.body.email,
                'customer.password': req.body.password
            })
            .then((data) => {
                if (data.length == 0) {
                    res.send('email worng')
                } else {
                    var token = jwt.sign({
                        'email': data[0].email,
                        'password': data[0].password,
                        "customer_id":data[0].customer_id
                    }, 'prabhakar', { expiresIn: "24h" },
                        (err, token) => {
                            if (!err) {
                                res.cookie('KEY', token)
                                knex.select('*')
                                    .from('customer')
                                    .where('customer.email', req.body.email)
                                    .then((result) => {
                                        delete result[0].password
                                        let data = { customer: { schema: result[0] } }
                                        data['accessToken'] = token
                                        data['expiresIn'] = '24h'
                                        res.send(data)
                                    })
                                    .catch((err) => {
                                        res.send(err)
                                    })


                            } else {
                                console.log('token is not create');

                            }

                        })

                }
            })
            .catch((err) => {
                console.log(err);

            })
    })
    customer.get('/customer/:id', (req, res) => {
        let token = req.headers.cookie.slice(4)
        console.log(token);
        jwt.verify(token, 'prabhakar', (err, data) => {
            if (!err) {
                knex('customer')
                    .where("customer_id", req.params.id)
                    .then((data) => {
                        delete data[0].password
                        res.send(data)
                    })
                    .catch((err) => {
                        res.send(err);

                    })
            } else {
                res.send('verify problom');

            }
        })
    })
    customer.put('/customer/update', (req, res) => {
        let token = req.headers.cookie.slice(4)
        let token1 = jwt.verify(token, 'prabhakar', (err, data) => {
            if (!err) {
                console.log(data.email)
                knex('customer')
                    .where('customer.email', data.email)
                    .update({
                        'name': req.body.name,
                        'email': req.body.email,
                        'password': req.body.password,
                        'day_phone': req.body.day_phone,
                        'eve_phone': req.body.eve_phone,
                        'mob_phone': req.body.mob_phone
                    })
                    .then((data1) => {
                        console.log("update susscful")
                        res.send("ok")
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            } else {
                res.send('verify problomb')
            }

        })
    })

    customer.put('/customer/address', (req, res) => {
        let token = req.headers.cookie.slice(4)
        let token1 = jwt.verify(token, 'prabhakar', (err, data) => {
            if (!err) {
                knex('customer')
                    .where('customer.email', data.email)
                    .update({
                        "address_1": req.body.address_1,
                        "address_2": req.body.address_2,
                        "city": req.body.city,
                        "region": req.body.region,
                        "postal_code": req.body.postal_code,
                        "country": req.body.country,
                        "shipping_region_id": req.body.shipping_region_id
                    })
                    .then((data) => {
                        res.send("update susscful")
                    })
                    .catch((err) => {
                        res.send(err)
                    })

            } else {
                res.send("verify problam")
            }
        })
    })
    customer.put("/customer/creditCard", (req, res) => {
        let token = req.headers.cookie.slice(4)
        let accessToken = jwt.verify(token, 'prabhakar', (err, data) => {
            if (!err) {
                knex('customer')
                    .where('customer.email', data.email)
                    .update({
                        "credit_card": req.body.credit_card
                    })
                    .then((data) => {
                        res.send("ok")
                    })
                    .catch((err) => {
                        res.send(err)
                    })
            } else {
                console.log('verify problam');

            }
        })

    })
}

