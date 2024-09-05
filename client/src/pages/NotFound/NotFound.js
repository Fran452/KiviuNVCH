import React from 'react'
import { Link } from "react-router-dom"
import IllustrationAccess from "../../assets/img/access.png"
import "./NotFound.scss"

function NotFound() {
  return (
    <div className='not__found d-flex flex-column align-items-center justify-content-center'>
        <img className='mb-4' src={IllustrationAccess} alt="" />
        <h2 className='fw-semibold mb-2'>Not Found 404</h2>
        <p className='text-center'>La página que estás buscando no existe.</p>
        <Link className='btn shadow-sm fw-medium' to={"/home"}>Regresar al home</Link>
    </div>
  )
}

export default NotFound