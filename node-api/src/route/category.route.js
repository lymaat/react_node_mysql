
const ct = require("../controller/category.controller")
const {userGuard} = require("../controller/auth.controller")
const category = (app,base_route) => {
    app.get(base_route,userGuard("category.Read"),ct.getAll)
    app.get(`${base_route}/:id`,userGuard("category.Read"),ct.getOne) // id params // req.params.id
    app.post(base_route,userGuard("category.Create"),ct.create)
    app.put(base_route,userGuard("category.Update"),ct.update)
    app.delete(`${base_route}/:id`,userGuard("category.Delete"),ct.remove)
}
module.exports = category;
