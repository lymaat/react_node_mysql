
const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/product.controller")
const product = (app,route_name) =>{
    app.get(`${route_name}`,ct.getlist)
    app.get(`${route_name}/:id`,ct.getone)
    app.post(`${route_name}`,userGuard(),ct.create)
    app.put(`${route_name}`,userGuard(),ct.update)
    app.delete(`${route_name}`,userGuard(),ct.remove)
    app.post(`${route_name}/change_status`,userGuard,ct.changeProductStatus)
}
module.exports = product;