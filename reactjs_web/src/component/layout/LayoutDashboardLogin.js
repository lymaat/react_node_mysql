import React from 'react'
import {Outlet} from "react-router-dom"
function LayoutDashboardLogin() {
  return (
    <div>
        <div>
            <Outlet />
        </div>
    </div>
  )
}

export default LayoutDashboardLogin
