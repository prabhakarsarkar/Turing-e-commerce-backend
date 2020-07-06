module.exports = (attribute, knex) => {
    attribute.get('/attribute', (req, res) => {
        knex.select('*').from('attribute')
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })

    attribute.get('/attribute/:attribute_id', (req, res) => {
        knex('attribute')
            .where("attribute_id", req.params.attribute_id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    attribute.get('/attribute/values/:id', (req, res) => {
        knex.select('attribute_value_id', 'value')
            .from('attribute_value')
            .where("attribute_id", req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    attribute.get('/p', (req, res) => {
        knex.select('*').from('product_attribute').then((data) => {
            res.send(data)
        })
    })
    attribute.get("/attributes/inProduct/:id", (req, res) => {
        knex.select("product_id", "name as attribute_name",
            "value as attribute_value", "product_attribute.attribute_value_id")
            .from('attribute_value')
            .join('attribute', function () {
                this.on('attribute_value.attribute_id', '=', 'attribute.attribute_id')
            })
            .join('product_attribute', function () {
                this.on('product_attribute.attribute_value_id'
                    , '=', 'attribute_value.attribute_value_id')
            })
            .where("product_id", req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })

} 
