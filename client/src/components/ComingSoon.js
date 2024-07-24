import React from 'react'
import { Link } from "react-router-dom"
import illustrationComingSoon from "../assets/img/comingsoon.png"
import "./ComingSoon.scss"

function ComingSoon() {
  return (
    <div className='coming__soon d-flex flex-column align-items-center justify-content-center'>
        <img className='mb-4' src={illustrationComingSoon} alt="" />
        <h2 className='fw-semibold mb-2'>Coming soon...</h2>
        <p className='text-center'>¡Estamos alistando todo para esta sección muy pronto!</p>
        <Link className='btn shadow-sm fw-medium' to={"/home"}>Home</Link>
    </div>
  )
}

export default ComingSoon