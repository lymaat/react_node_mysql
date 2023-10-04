
const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/order.contoller")
const order = (app,base_route) => {
    app.get(base_route,userGuard,ct.getAll)
    app.get(`${base_route}/:id`,userGuard,ct.getOne) // id params // req.params.id
    app.post(base_route,userGuard,ct.create)
    app.put(base_route,userGuard,ct.update)
    app.delete(`${base_route}/:id`,userGuard,ct.remove)
}
module.exports = order;