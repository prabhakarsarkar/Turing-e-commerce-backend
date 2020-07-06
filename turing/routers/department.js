module.exports = (departments, knex) => {

    departments.get('/department', (req, res) => {
        knex.select("*").from("department")
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
                console.log(err);

            })
    })
    departments.get('/department/:id', (req, res) => {
        knex.select('*')
            .from('department')
            .where("department_id", req.params.id)
            .then((data) => {
                res.send(data)
            })
            .catch((err) => {
                res.send(err)
            })
    })
}

