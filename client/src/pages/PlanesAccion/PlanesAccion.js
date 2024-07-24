import React, { useState, useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import "./PlanesAccion.scss"
import ModalPlanes from "../../components/ModalPlanes"
import { jwtDecode } from "jwt-decode"

export const loadingContext = React.createContext()

function PlanesAccion() {
  const [loading, setLoading] = useState(true)
  const [areas, setAreas] = useState([]);
  const [tareas, setTareas] = useState([])
  const [modal, modalShow] = useState(false)
  const [tareaObj, setTareaObj] = useState(null)

  const fetchAreas = async () => {
    try {
      const res = await fetch("/apis/index",{
        method: "GET"
      })
      const data = await res.json()
      setAreas(data.objeto.areas)
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    
    const reqBody = {
      user: jwtParse.apirest.objeto
    }
  
    const fetchTareas = async () => {
      try {
        const res = await fetch("/apis/plan-accion", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(reqBody)
        })
        const data = await res.json()
        setTareas(data.objeto)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    
    fetchAreas()
    fetchTareas()
  }, [loading])
 
  const handleForm = (e) => {
    e.preventDefault()
    modalShow(true)
  }

  const handleUpdate = (value) => {
    setLoading(value)
  }

  const handleEditTask = (i) => {
    const obj = tareas.find((e) => e.id_tarea === i)
    setTareaObj(JSON.stringify(obj))
    modalShow(true)
  }

  const handleDeleteTask = async (i) => {
    const obj = {
      idTarea: parseInt(i)
    }
    try {
      const res = await fetch("http://localhost:3030/apis/plan-accion/deleteTask", {
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
        setLoading(true)
      }
    } catch (error) {
      console.log(error)
    }

    // await fetch("http://localhost:3030/apis/plan-accion/deleteTask", {
    //   method: "PUT",
    //   headers: {
    //       "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(obj)
    // })
    // .then(res => res.json())
    // .then(data => {
    //   console.log(data)
    // })
    // .catch (err => {
    //   console.log(err)
    // })
    
  }

  return (
    <>
      <loadingContext.Provider value={{handleUpdate, tareaObj, setTareaObj}}>
        <ModalPlanes show={modal} onHide={()=>modalShow(false)} />
      </loadingContext.Provider>
      <div className='planes__accion section'>
        <div className='section__header d-flex flex-row align-items-end mb-4'>
          <i className='bi bi-bar-chart-steps me-2'></i>
          <h4 className='m-0'>Planes de Acción</h4>
        </div>
        {loading ? (
          <div className='loading__tareas d-flex flex-column align-items-center justify-content-center'>
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
            {tareas.length > 0 ? (
              <div className='planes__accion__tareas d-flex flex-column'>
                <div className='planes__accion__tareas__header d-flex flex-row justify-content-between align-items-center mb-4'>
                  <h3 className='m-0 invisible'>Área</h3>
                  <button className=' btn btn-primary' onClick={handleForm}>Agregar tarea</button>
                </div>
                <div className='planes__accion__tareas__main d-flex flex-column flex-md-row w-100'>
                  {/* <div className='d-flex flex-row flex-md-column me-0 mb-4 me-md-4 mb-md-0'>
                    {areas.map((e,i) => {
                      return <button className="btn__area btn btn-primary rounded-pill text-nowrap me-2 mb-md-2 me-md-0" key={i}>{e.nombre_del_Area}</button>
                    })}
                  </div> */}
                  <div className='planes__accion__tareas__main__tabla'>
                    <table className="table table-striped align-middle table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">Tareas</th>
                          <th scope="col">Inicio</th>
                          <th scope="col">Final</th>
                          <th scope="col">Notas</th>
                          <th scope="col">Responsable</th>
                          <th scope="col">Equipo de apoyo</th>
                          <th scope="col">Prioridad</th>
                          <th scope="col">Estado</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody className='table__tbody'>
                        {tareas.map((e,i) => {
                          return <tr key={i}>
                            <td className='table__tbody__nombre'>{e.nombre}</td>
                            <td className='table__tbody__fechaInicial'>{new Date(e.fecha_inicio.replace(/-/g, '/')).toLocaleDateString()}</td>
                            <td className='table__tbody__fechaFinal'>{new Date(e.fecha_final.replace(/-/g, '/')).toLocaleDateString()}</td>
                            <td className='table__tbody__notas'>{e.notas}</td>
                            <td className='table__tbody__notas'>{e.Empleados.mail}</td>
                            <td className='table__tbody__equipo'>
                              {e.fk_area_apoyo === 1 && <span className='table__tbody__equipo'>Finanzas</span>}
                              {e.fk_area_apoyo === 2 && <span className='table__tbody__equipo'>Recursos Humanos</span>}
                              {e.fk_area_apoyo === 3 && <span className='table__tbody__equipo'>Ventas</span>}
                            </td>
                            <td className='table__tbody__prioridad'>
                              {e.prioridad === 1 && <span className='table__tbody__prioridad--baja rounded-pill text-white badge'>baja</span>}
                              {e.prioridad === 2 && <span className='table__tbody__prioridad--media rounded-pill text-white badge'>media</span>}
                              {e.prioridad === 3 && <span className='table__tbody__prioridad--alta rounded-pill text-white badge'>alta</span>}
                              </td>
                            <td className='table__tbody__estado'>
                              {e.estado === 1 && <span className='table__tbody__estado--pendiente rounded-pill text-white badge'>Pendiente</span>}
                              {e.estado === 2 && <span className='table__tbody__estado--proceso rounded-pill text-white badge'>En proceso</span>}
                              {e.estado === 3 && <span className='table__tbody__estado--completada rounded-pill text-white badge'>Completada</span>}
                              {e.estado === 4 && <span className='table__tbody__estado--espera rounded-pill text-white badge'>En espera</span>}
                              {e.estado === 5 && <span className='table__tbody__estado--cancelada rounded-pill text-white badge'>Cancelada</span>}
                              {e.estado === 6 && <span className='table__tbody__estado--bloqueada rounded-pill text-white badge'>Bloqueada</span>}
                            </td>
                            <td className='table__tbody__buttons d-flex flex-row'>
                              <button onClick={(() => handleEditTask(e.id_tarea))} className='btn bg-success rounded-circle text-white me-2'><i className="bi bi-pencil"></i></button>
                              <button onClick={(() => handleDeleteTask(e.id_tarea))} className='btn bg-danger rounded-circle text-white'><i className="bi bi-trash3"></i></button>
                            </td>
                          </tr>
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
              </div>
            ) : (
            <div className='planes__accion__tareas--empty rounded-3 d-flex flex-column align-items-center justify-content-center'>
              <h2 className='fw-semibold mb-1 text-center'>No tienes Planes de Acción aún.</h2>
              <p className='mb-4 text-center'>Para comenzar, crea tu primer proyecto:</p>
              <button 
              onClick={handleForm} 
              className='planes__accion__tareas--empty__btn btn rounded-pill shadow-sm fw-medium'>Agregar Proyecto
              </button>
            </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default PlanesAccion