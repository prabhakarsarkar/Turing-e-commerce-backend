module.exports = (tax, knex) => {
    tax.get('/all_tax', (req, res) => {
        knex.select('*')
            .from('tax')
            .then((data) => {
                res.send(data)

            }).catch((err) => {
                res.send(err)
            })

    })
    tax.get('/tax/:tax_id',(req,res)=>{
        knex('tax')
        .where('tax_id',req.params.tax_id)
        .then((data)=>{
            res.send(data)

        }).catch((err)=>{
            res.send(err)
        })
    })
}