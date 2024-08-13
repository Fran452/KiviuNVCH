import React, { useEffect, useState } from 'react'
import { DataInContext } from '../../context/DataInContext';
import FormDatIn from '../../components/FormDatIN/FormDatIn'
import './DatIN.scss'
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import IllustrationAccess from "../../assets/img/access.png"
import ModalShowIndicadores from '../../components/Modales/ModalShowIndicadores'

function DatIN() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [indicadores, setIndicadores] = useState([])
  const [addIndicador, setAddIndicador] = useState(false)
  const [modalIndicador, setModalIndicador] = useState(false)
  const [arrTresMetricas, setArrTresMetricas] = useState([])
  const [indicadorID, setIndicadorID] = useState({})

  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)
  const USER = jwtParse.apirest.objeto

  useEffect(() => {
    const firstFetch = () => {
      fetchIndicadores()
      .then(res => {
        if(res.error !== 0){
          setLoading(false)
          setError(res.errorDetalle)
        } else {
          setLoading(false)
          setIndicadores(res.objeto)
        }
      })
    }
    firstFetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const fetchIndicadores = async () => {
    try {
      const res = await fetch("http://localhost:3030/apis/dateIn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: USER
        })
      })
      const data = await res.json()
      return data
    } catch (error) {
      setError(error)
    }
  }

  const handleNewIndicador = () => {
    setAddIndicador(true)
  }

  const handleShowIndicador = async (id) => {
    try {
      const res = await fetch("http://localhost:3030/apis/dateIn/ultimas3Metricas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fkIndicador: id
        })
      })
      const data = await res.json()
      setArrTresMetricas(data.objeto)
      const obj = indicadores.find(e => e.id_indicador === id)
      setIndicadorID(obj)
    } catch (error) {
      console.log(error)
    }
    setModalIndicador(true)
  }

  return (
    <>
      <DataInContext.Provider value={{ arrTresMetricas, setArrTresMetricas, indicadorID, setIndicadorID }}>
        <ModalShowIndicadores show={modalIndicador} onHide={()=>setModalIndicador(false)} />
      </DataInContext.Provider>
      <div className='datin section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-fill me-2'></i>
          <h4 className='m-0'>DatIN</h4>
        </div>
        {loading ? (
          <div className='loading__datin d-flex flex-column align-items-center justify-content-center'>
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
          <>
            {addIndicador ? (
              <div className='formIn__container w-100 '>
                <div className='formIn__container__main h-100'>
                  <FormDatIn 
                    addIndicador={addIndicador} 
                    setAddIndicador={setAddIndicador} 
                    fetchIndicadores={fetchIndicadores}
                    setLoading={setLoading}
                    setError={setError}
                    setIndicadores={setIndicadores}
                  />
                </div>
              </div>
              ) : (
              <>
                {error ? (
                  <div className='datin__error d-flex flex-column align-items-center justify-content-center'>
                    <img className='mb-4' src={IllustrationAccess} alt="" />
                    <h2>Mensaje de error:</h2>
                    <p>{error}</p>
                  </div>
                ) : (
                  <>
                    {indicadores.length === 0 ? (
                      <div className='datin--empty__main d-flex flex-column align-items-center justify-content-center rounded-3'>
                        <h2 className='fw-semibold mb-1 text-center'>No tienes Indicadores para mostrar aún.</h2>
                        <p className='mb-3 text-center'>Para comenzar, ingresa tu primer indicador:</p>
                        <button className='btn__addIndicador btn btn-primary rounded-pill shadow-sm fw-medium' 
                          onClick={handleNewIndicador}>
                            Agregar indicador
                        </button>
                      </div>
                    ) : (
                      <div className='datin__main position-relative'>
                        {indicadores.map((e,i) => {
                          return <div key={i} onClick={()=>handleShowIndicador(e.id_indicador)} className='datin__main__indicador d-flex flex-column justify-content-between shadow-sm rounded-3'>
                              <div className='p-3'>
                                <p className='mb-1'>{e.Areas.nombre_del_Area}</p>
                                <h4 className='mb-0'>{e.nombre_indicador}</h4>
                              </div>
                              <div className='datin__main__indicador__fecha px-3 py-2 d-flex flex-row rounded-bottom-3 align-items-center justify-content-between'>
                                <p className='text-white mb-0'>{e.Empleados.nombre}</p>
                                <div className='d-flex flex-row text-white align-items-center'>
                                  <i className="bi bi-calendar-event me-1"></i>
                                  <p className='mb-0'>{new Date(e.fecha_del_recodatorio.replace(/-/g, '/')).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                        })}
                        <button className='position-absolute bottom-0 end-0 btn__addIndicador btn btn-primary rounded-pill shadow-sm fw-medium' 
                          onClick={handleNewIndicador}>
                            Agregar indicador
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>    
            )}
            
          </>
        )}
        
      </div>
    </>
  )
}

export default DatIN