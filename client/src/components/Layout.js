import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from "./Navbar"
// import Footer from "./Footer"
import { Outlet } from 'react-router-dom'
import "./Layout.scss"
import FormPlanesAccion from './FormPlanesAccion'

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [form, setForm] = useState(false)

    return (
        <div className={sidebarOpen ? "sidebarOpen active" : "sidebarOpen"}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="main">
                <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                <div className='d-flex flex-column flex-md-row overflow-auto'>
                    <FormPlanesAccion form={form} setForm={setForm}/>
                    <div className='main__outlet__container bg-white rounded-3'>
                        <Outlet context={[form, setForm]}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout