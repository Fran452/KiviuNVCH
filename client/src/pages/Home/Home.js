import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Oval } from 'react-loader-spinner'
import "./Home.scss"
import IllustrationBienvenida from "../../assets/img/ilustration-bienvenida.png"
import { jwtDecode } from "jwt-decode"

function Home() {
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState([]);

  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)

  const fetchAreas = async () => {
    try {
      const res = await fetch("http://localhost:3030/apis/index",{
        method: "GET"
      })
      const data = await res.json()
      setAreas(data.objeto.areas)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  return (
    <div className='home section'>
      <div className='section__header d-flex flex-row align-items-end mb-4'>
        <i className='bi bi-house-door-fill me-2'></i>
        <h4 className='m-0'>Dashboard</h4>
      </div>
      <div className='home__bienvenida d-flex flex-column flex-md-row rounded-3 align-items-md-center mb-4'>
        <div className='home__bienvenida__texto'>
          <h2 className='text-white'><span>Bienvenido</span><br />{jwtParse.apirest.objeto.nombre}</h2>
          {/* <p className='text-white m-0'>Tienes <b>{tareas}</b> tareas por realizar</p> */}
        </div>
        <div className='home__bienvenida__img d-flex align-self-center'>
          <img className="position-relative" src={IllustrationBienvenida} alt="" />
        </div>
      </div>
      {loading ? (
        <div className='loading__home d-flex flex-column align-items-center justify-content-center'>
          <Oval
              visible={true}
              height="80"
              width="80"
              color="#0d6efd"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
          />
          <p className='fw-medium'>Loading...</p>
        </div>
      ) : (
        <div className='home__areas mb-4'>
          {areas.map((e,i) => {
            return <Link to={`/bi/${e.id_area}`} className="btn home__areas__area shadow-sm rounded-3 d-flex flex-row align-items-center" key={i}>
              <h4 className='p-0 m-0 text-start'>{e.nombre_del_Area}</h4>
              </Link>
          })}
        </div>
      )}
      
    </div>
  )
}

export default Home