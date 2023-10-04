
const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/employee.contoller")
const employee = (app,base_route) => {
    app.get(base_route,userGuard("employee.Read"),ct.getAll)
    app.get(base_route+"/:id",userGuard("employee.Read"),ct.getOne) // id params // req.params.id
    app.post(base_route,userGuard("employee.Create"),ct.create)
    app.put(base_route,userGuard("employee.Update"),ct.update)
    app.delete(`${base_route}/:id`,userGuard("employee.Delete"),ct.remove)
    app.post(`${base_route}_login`,ct.login)
    app.post(`${base_route}_set_password`,ct.setPassword)
    app.post(`${base_route}_refresh_token`,ct.refreshToken)
    
}
module.exports = employee;


// `${base_route}/:id` == base_route+"/:id"