import React from 'react'
import {Link} from "react-router-dom"
import Logo from "../../assets/img/nbch.png"
import Avatar from "../../assets/img/avatar-3.jpg"
import "./Navbar.scss"

import { jwtDecode } from "jwt-decode"

function Navbar({sidebarOpen, setSidebarOpen}) {
  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)

  return (
    <div className='navbar'>
        <div className="navbar__content d-none d-md-flex align-items-center justify-content-between w-100 p-0">
          <Link to="/home" className={`ms-5 ${sidebarOpen ? "d-block" : "invisible"}`}>
            <img src={Logo} alt="Logo" />
          </Link>
          <button className='btn border-0 p-0 d-flex flex-row align-items-center'>
            <div className='me-2'>
              <img className='rounded-circle' src={Avatar} alt="" />
            </div>
            <p className='fw-medium m-0 me-2'>{jwtParse.apirest.objeto.nombre}</p>
            {/* <i className="bi bi-chevron-down text-white"></i> */}
          </button>
        </div>
    </div>
  )
}

export default Navbar