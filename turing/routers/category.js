module.exports = (categories, knex) => {
    categories.get("/category", (req, res) => {
        knex.select('*').from('category')
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    categories.get('/category/:id', (req, res) => {
        knex('category')
            .where('category_id', req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    categories.get("/product/:id", (req, res) => {
        knex.select("category.category_id", "department_id", "name")
            .from("category")
            .join("product_category", "category.category_id", "=", "product_category.category_id")
            .where("product_category.product_id", req.params.id)
            .then((data) => {
                res.send(data)
            }).catch((err) => {
                res.send(err);

            })
    })
    categories.get("/category/department/:department_id", (req, res) => {
        knex.select('*').from('category')
            .where("department_id", req.params.department_id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                console.log(err);

            })
    })
}
