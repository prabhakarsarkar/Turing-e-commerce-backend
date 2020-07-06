module.exports = (products, knex) => {
    products.get("/products", (req, res) => {
        knex
            .select('*')
            .from('product')
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })

    })
    products.get("/search/:name", (req, res) => {
        knex.select("*").from("product")
            .where("name", req.params.name)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(data)
            })
    })

    products.get('/products/:product_id', (req, res) => {
        knex('product')
            .where("product_id  ", '=', req.params.product_id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    products.get("/product/inCategory/:id", (req, res) => {
        knex.select('*')
            .from('product')
            .join('product_category', function () {
                this.on("product.product_id", '=', 'product_category.product_id')
            })
            .where('product_category.category_id', req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })

    products.get("/product/inDrpartment/:id", (req, res) => {
        knex('product as p')
            .select('p.product_id', 'p.name',
                'p.description', 'p.price', 'p.discounted_price', 'p.thumbnail')
            .join('product_category'
                , 'product_category.product_id', '=', 'p.product_id')
            .join('category', 'category.category_id', '=', 'product_category.category_id')
            .where('category.department_id', req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })


    })
    products.get("/product/:product_id/details", (req,res) => {
        knex('product as p')
            .select('p.product_id', 'p.name',
                'p.description', 'p.price', 
                'p.discounted_price', 'p.image', 'p.image_2')
            .where('p.product_id',req.params.product_id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
    products.get('/p/:id',(req,res)=>{
        knex('category')
        .select("category.category_id",'department.department_id',
        'department.name as department_name','category.name as category_name')
        .join('product_category','product_category.category_id','=',
        'category.category_id')
        .join('department','department.department_id','=','category.department_id')
        .where("product_id",req.params.id)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    products.post('/review',(req,res)=>{
        
    })

    
}
