import React, { useState, useEffect } from 'react'
import { Accordion } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode"
import Tareas from '../../components/Tareas';
import { Oval } from 'react-loader-spinner'
import "./PlanesAccion.scss"
import ModalNewProyecto from '../../components/Modales/ModalNewProceso';
import IllustrationAccess from "../../assets/img/access.png"

export const newContext = React.createContext()

function PlanesAccion() {
    const [loading, setLoading] = useState(true)
    const [loadingTar, setLoadingTar] = useState(false)
    const [error, setError] = useState(null)
    const [errorTar, setErrorTar] = useState(null)
    const [areas, setAreas] = useState([]);
    const [proyectos, setProyectos] = useState([])
    const [tareasByProyecto, setTareasByProyecto] = useState(null)
    const [idProyecto, setIdProyecto] = useState(null)
    const [titleArea, setTitleArea] = useState(null)
    const [titleProyecto, setTitleProyecto] = useState(null)
    const [descripcionProyecto, setDescripcionProyecto] = useState(null)
    const [modalProyecto, setModalProyecto] = useState(false)

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    useEffect(() => {

        const fetchAreas = async () => {
            try {
            const res = await fetch("http://164.92.77.143:3030/apis/index",{
                method: "GET"
            })
            const data = await res.json()
            setAreas(data.objeto.areas)
            } catch (error) {
            console.log(error)
            }
        }
        
        const firstFetch = () => {
            fetchProyectos()
            .then(res => {
                if(res.error !== 0){
                    setLoading(false)
                    setError(res.errorDetalle)
                } else {
                    setLoading(false)
                    setProyectos(res.objeto)
                }
            })
        }
        
        fetchAreas()
        firstFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Actualizar el listado de proyectos
    const fetchProyectos = async () => {
        try {
            const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/viewProyect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                user: USER
                })
            });
            const data = await res.json()
            return data
        } catch (error) {
            setError(error)
        }
    }

    const fetchTareasById = async(id) => {
        try {
            const res = await fetch("http://164.92.77.143:3030/apis/plan-accion/viewTask", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                user: USER,
                idProyecto: id
              })
            })
            const data = await res.json()
            return data
        } catch (error) {
        console.log(error)
        }
    }

    const handleTareaById = async (id, titleArea, titleProyecto, detalles) => {
        setLoadingTar(true)
        fetchTareasById(id)
        .then(res => {
            if(res.error !== 0){
                setLoadingTar(false)
                setErrorTar(res.errorDetalle)
            } else {
                setLoadingTar(false)
                setTareasByProyecto(res.objeto)
            }
        })
        setIdProyecto(id)
        setTitleArea(titleArea)
        setTitleProyecto(titleProyecto)
        setDescripcionProyecto(detalles)
    }

    const handleFormProyecto = (e) => {
        e.preventDefault()
        setModalProyecto(true)
    }

    return (
        <>
            <newContext.Provider 
                value={{loadingTar, setLoadingTar, errorTar, setErrorTar, proyectos, setProyectos, fetchProyectos, fetchTareasById, tareasByProyecto, setTareasByProyecto, idProyecto, setIdProyecto, areas, titleArea, titleProyecto, descripcionProyecto, setTitleProyecto, setDescripcionProyecto, USER}}>
                <ModalNewProyecto show={modalProyecto} onHide={()=>setModalProyecto(false)}/>
                <div className='planes__accion section'>
                    <div className='section__header d-flex flex-row align-items-end mb-4'>
                        <i className='bi bi-bar-chart-steps me-2'></i>
                        <h4 className='m-0'>Ciclos de auditoría</h4>
                    </div>
                    {loading ? (
                        <div className='loading__proyectos d-flex flex-column align-items-center justify-content-center'>
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
                            {error ? (
                                <div className='planes__error d-flex flex-column align-items-center justify-content-center'>
                                    <img className='mb-4' src={IllustrationAccess} alt="" />
                                    <h2>Mensaje de error:</h2>
                                    <p>{error}</p>
                                </div>
                            ) : (
                                <>
                                    {proyectos.length === 0 ? (
                                    <div className='planes__accion--empty d-flex flex-column align-items-center justify-content-center rounded-3'>
                                        <h2 className='fw-semibold mb-1 text-center'>No tienes Proyectos aún.</h2>
                                        <p className='mb-3 text-center'>Para comenzar, crea tu primer proyecto:</p>
                                        <button 
                                            className='planes__accion--empty__btn btn btn-primary rounded-pill shadow-sm fw-medium'
                                            onClick={handleFormProyecto}
                                            >Agregar proyecto
                                        </button>
                                    </div>
                                    ) : (
                                        <div className='planes__accion__main d-flex flex-column flex-md-row'>
                                            <div className='planes__accion__main__menu mb-4 mb-md-0 d-flex flex-column align-items-start justify-content-between'>
                                                <div className='container__accordion'>
                                                    <Accordion className='mb-2 mb-md-0' defaultActiveKey="0">
                                                        {areas.map((a, i) => {
                                                            return a.id_area === USER.area && <Accordion.Item key={a.id_area} eventKey={i}>
                                                                <Accordion.Header>{a.nombre_del_Area}</Accordion.Header>
                                                                <Accordion.Body className='d-flex flex-column align-items-start'>
                                                                    {proyectos.map((p, index) => {
                                                                        return a.id_area === p.fk_area && <button key={index} className='btn d-flex align-items-center' onClick={() => handleTareaById(p.id_proyecto, a.nombre_del_Area, p.nombre, p.detalles)}>
                                                                            <i className="bi bi-chevron-right me-2 active"></i><span>{p.nombre}</span>
                                                                        </button>
                                                                    })}
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        })}
                                                    </Accordion>
                                                </div>
                                                <button 
                                                    className='planes__accion__main__menu__btn btn btn-primary rounded-pill shadow-sm fw-medium'
                                                    onClick={handleFormProyecto}
                                                    >Agregar proyecto
                                                </button>
                                            </div>
                                            <Tareas />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </newContext.Provider>
        </>
    )
}

export default PlanesAccion