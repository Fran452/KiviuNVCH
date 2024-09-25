import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Outlet } from 'react-router-dom'
import "./Layout.scss"

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className={sidebarOpen ? "sidebarOpen active" : "sidebarOpen"}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="main">
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                {/* <div className='main__outlet__container bg-white rounded-3'> */}
                <div className='main__outlet__container bg-white'>
                    <Outlet />
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Layout