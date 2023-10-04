import moment from "moment"


export const isEmptyOrNull = (value) => {
    return (value == "" || value == null || value == undefined) ? true : false
}

export const getUser = () => {
    var user = localStorage.getItem("user")
    if(!isEmptyOrNull(user)){
        user = JSON.parse(user)
        return user
    }else{
        return null
    }
}

export const getPermission = () => {
    var permission = localStorage.getItem("permission")
    if(!isEmptyOrNull(permission)){
        permission = JSON.parse(permission)
        return permission
    }else{
        return null
    }
}

export const isPersmission = (code_permission) => { // code_permission = category.Delete
    const arrPermission = getPermission();
    if(arrPermission){
        if(arrPermission.includes(code_permission)){
            return true; // mean has permission
        }
        return false // no permission
    }else{
       return false // no permission
    }
}

export const getAccessToken = () => {
    var access_token = localStorage.getItem("access_token")
    if(!isEmptyOrNull(access_token)){
        return access_token;
    }else{
        return null
    }
}

export const getRefreshToken = () => {
    var refresh_token = localStorage.getItem("refresh_token")
    if(!isEmptyOrNull(refresh_token)){
        return refresh_token
    }else{
        return null
    }
}


export const formatDateClient = (date) => {
    if(!isEmptyOrNull(date)){
        return moment(date).format("DD/MM/YYYY hh:mm");
    }
    return null
}

export const formatDateServer = (date) => {
    if(!isEmptyOrNull(date)){
        return moment(date).format("YYYY-MM-DD");
    }
    return null
}

export const logout = () => {
    localStorage.setItem("isLogin","0")
    window.location.href="/dashboard/login"
}

export const storeUserData = (param) => {
    localStorage.setItem("isLogin","1")
    localStorage.setItem("access_token",param.access_token)
    localStorage.setItem("refresh_token",param.refresh_token)
    localStorage.setItem("permission",JSON.stringify(param.permission))
    localStorage.setItem("user",JSON.stringify(param.user))
}


