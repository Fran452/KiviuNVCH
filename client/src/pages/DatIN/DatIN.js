import React, { useEffect, useState } from 'react'
import { DataInContext } from '../../context/DataInContext';
import FormDatIn from '../../components/FormDatIN/FormDatIn'
import './DatIN.scss'
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import { Modal } from 'react-bootstrap';
import IllustrationAccess from "../../assets/img/access.png"
import ModalShowIndicadores from '../../components/Modales/ModalShowIndicadores'
import ModalEditIndicador from '../../components/Modales/ModalEditIndicador';

function DatIN() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [indicadores, setIndicadores] = useState([])
  const [addIndicador, setAddIndicador] = useState(false)
  const [modalIndicador, setModalIndicador] = useState(false)
  const [arrTresMetricas, setArrTresMetricas] = useState([])
  
  const [indicadorID, setIndicadorID] = useState({})
  const [editIndicador, setEditIndicador] = useState(null)
  const [areaSelec, setAreaSelec] = useState(null)
  
  const [ModalEditInd, setModalEditInd] = useState(false)
  const [modalDeleteIndicador, setModalDeleteIndicador] = useState(false)

  const [idIndicador, setIdIndicador] = useState(null)
 

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
      const res = await fetch("http://164.92.77.143:3030/apis/dateIn", {
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
      setModalIndicador(true)
      const res = await fetch("http://164.92.77.143:3030/apis/dateIn/ultimas3Metricas", {
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
      setAreaSelec(obj.Areas.nombre_del_Area)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditIndicador = (id) => {
    const obj = indicadores.find(e => e.id_indicador === id)
    setEditIndicador(JSON.stringify(obj))
    setModalEditInd(true)
  }

  // ELIMINAR INDICADOR
  const showModalDeleteIndicador = (i) => {
    setIdIndicador(i)
    setModalDeleteIndicador(true)
  }

  const handleDeleteIndicador = async () => {
    const obj = {
      idIndicador: parseInt(idIndicador)
    }
    try {
      const res = await fetch("http://164.92.77.143:3030/apis/dateIn/deleteIndicador", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
      })
      const data = await res.json()
      if(data.error !== 0){
        console.log(data.errorDetalle)
      } else {
        setModalDeleteIndicador(false)
        setLoading(true)
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
    } catch (error) {
      console.log(error)
    } 
  }

  return (
    <>
      <DataInContext.Provider value={{ arrTresMetricas, setArrTresMetricas, indicadorID, setIndicadorID, areaSelec, editIndicador, handleShowIndicador, setLoading, fetchIndicadores, setError, setIndicadores }}>
        <ModalShowIndicadores show={modalIndicador} onHide={()=>setModalIndicador(false)} />
        <ModalEditIndicador show={ModalEditInd} onHide={()=>setModalEditInd(false)} />
      </DataInContext.Provider>
      {/* Modal Eliminar Indicador */}
      <Modal className='modal__delete__proyecto' show={modalDeleteIndicador} onHide={() => setModalDeleteIndicador(false)} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title><h3>Eliminar proyecto</h3></Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Está seguro de eliminar este proyecto?</Modal.Body>
        <Modal.Footer>
          <button className='btn btn-secondary rounded-pill' onClick={() => setModalDeleteIndicador(false)}>Cancelar</button>
          <button className='btn btn-danger rounded-pill' onClick={handleDeleteIndicador}>Borrar</button>
        </Modal.Footer>
      </Modal>
      {/* Fin Modal Eliminar Indicador */}
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
                          return <div key={i} className='datin__main__container'>
                              <div onClick={()=>handleShowIndicador(e.id_indicador)} className='datin__main__indicador d-flex flex-column justify-content-between shadow-sm rounded-3 border border-light-subtle'>
                                <div className='p-3'>
                                  <p className='mb-1'>{e.Areas.nombre_del_Area}</p>
                                  <h4 style={{color:e.color}} className='mb-0'>{e.nombre_indicador}</h4>
                                </div>
                                <div style={{backgroundColor:e.color}} className='datin__main__indicador__fecha px-3 py-2 d-flex flex-row rounded-bottom-3 align-items-center justify-content-between'>
                                  <p className='text-white mb-0'>{e.Empleados.nombre}</p>
                                  <div className='d-flex flex-row text-white align-items-center'>
                                    <i className="bi bi-calendar-event me-1"></i>
                                    <p className='mb-0'>{new Date(e.fecha_del_recodatorio.replace(/-/g, '/')).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                              <div className='datin__main__container__buttons p-3 active'>
                                  <button onClick={()=>handleEditIndicador(e.id_indicador)} className='btn__edit btn bg-success rounded-circle mb-2 text-white' ><i className="bi bi-pencil"></i></button>
                                  <button onClick={()=>showModalDeleteIndicador(e.id_indicador)} className='btn__delete btn bg-danger rounded-circle text-white' ><i className="bi bi-trash3"></i></button>
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