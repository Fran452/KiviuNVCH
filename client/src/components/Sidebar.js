import React, { useState } from 'react'
import {Link, useLocation, useNavigate} from "react-router-dom"
import Logo from "../assets/img/logo-v2.png"
import "./Sidebar.scss"
import Avatar from "../assets/img/avatar.jpg"
import { jwtDecode } from "jwt-decode"

const lista = [
  { label: "Dashboard", icon: "bi-house-door-fill", to: "/home" },
  { label: "Planes de Acción", icon: "bi-bar-chart-steps", to: "/planes-de-accion" },
  { label: "OKR", icon: "bi-list-check", to: "/okr" },
  { label: "Asistente IA", icon: "bi-lightning-charge-fill", to: "/asistente-ia" },
  { label: "DatIN", icon: "bi-bar-chart-fill", to: "/dat-in" }
]

function Sidebar({sidebarOpen, setSidebarOpen}) {
  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)

  const [list, setList] = useState(lista)
  const [navbarMob, setNavbarMob] = useState(false)
  
  const handleMenu = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleMenuMob = () => {
    setNavbarMob(!navbarMob)
  }
  
  const { pathname } = useLocation()

  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/")
  }

  return (
    <>
      <div className="navbar--mob d-md-none position-absolute shadow-sm d-flex flex-row justify-content-between">
        <Link to="/home">
          <img src={Logo} alt="Logo" />
        </Link>
        <button onClick={handleMenuMob} className="navbar--mob__btn btn border-0 p-0">
          <i className="bi bi-filter-left"></i>
        </button>
      </div>
      <div className={`${navbarMob ? "d-grid" : "d-none"} d-md-none navbar--mob__content`}>
        <div className='d-flex flex-row-reverse'>
          <button onClick={handleMenuMob} className="navbar--mob__content__btn btn border-0 p-0">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className='navbar--mob__content__list d-flex flex-column justify-content-evenly align-items-start'>
          <button className='navbar--mob__content__list__avatar btn border-0 p-0 d-flex flex-row align-items-center'>
            <div className='me-2'>
              <img className='rounded-circle' src={Avatar} alt="" />
            </div>
            <p className='fw-medium m-0 me-2'>{jwtParse.apirest.objeto.nombre}</p>
          </button>
          <ul className="navbar--mob__content__list__menu list-group">
            {list.map((e,i) => {
              return <li key={i}>
                <Link to={e.to} onClick={handleMenuMob}>
                  <i className={`bi ${e.icon} pe-2`}></i>
                  <span className='fw-medium'>{e.label}</span>
                </Link>
              </li>
            })}
          </ul>
          <button onClick={handleLogOut} className='navbar--mob__content__list__logout btn p-0'>
            <i className='bi bi-power pe-2'></i>
            <span className='fw-medium'>Log Out</span>
          </button>
        </div>
      </div>
      <div className="sidebar d-none d-md-block position-relative">
        <button className="sidebar__btn btn border-0 position-absolute p-0" onClick={handleMenu}>
          <i className="bi bi-filter-left"></i>
        </button>
        <div className='sidebar__content d-flex flex-column align-items-center justify-content-between position-relative h-100'>
          <Link to="/home" className={`${sidebarOpen ? "invisible" : "d-block"} sidebar__content__logo`}>
            <img src={Logo} alt="Logo" />
          </Link>
          <ul className='sidebar__content__list list-group'>
            {list.map((e, i)=>{
              return <li key={i} className={`${pathname === e.to ? "bg-white" : ""} ${sidebarOpen ? "active item--small" : "sidebar__content__list__item"}`}>
                <Link to={e.to} className={`${pathname === e.to ? "bg-blue-500" : "text-white"} fw-medium`}>
                  <i className={`bi ${e.icon} ${sidebarOpen ? "" : "pe-2"}`}></i>
                  {!sidebarOpen && <span className="fw-medium">{e.label}</span>}
                </Link>
              </li>
            })}
          </ul>
          <button onClick={handleLogOut} className='sidebar__content__logout btn text-white align-self-start'>
            <i className='bi bi-power pe-2'></i>
            {!sidebarOpen && <span >Log Out</span>}
          </button>
        </div>
      </div>
    </>
    
  )
}

export default Sidebar