import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import './Ciclo.scss'
import { Accordion } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import IllustrationAccess from "../../assets/img/access.png"
import Tareas from '../../components/Tareas';
import ModalNewProceso from '../../components/Modales/ModalNewProceso';

const ciclos = [
    {
        idCiclo: 0,
        nombre: "Planeamiento"
    },
    {
        idCiclo: 1,
        nombre: "Préstamos"
    },
    {
        idCiclo: 2,
        nombre: "Tarjetas de crédito"
    },
    {
        idCiclo: 3,
        nombre: "TI - sección 2"
    },
    {
        idCiclo: 4,
        nombre: "TI - sección 4"
    },
    {
        idCiclo: 5,
        nombre: "TI - sección 6"
    },
    {
        idCiclo: 6,
        nombre: "TI - sección 7"
    },
    {
        idCiclo: 7,
        nombre: "TI - sección 8"
    },
    {
        idCiclo: 8,
        nombre: "Tecnología Informática"
    },
    {
        idCiclo: 9,
        nombre: "Depósitos"
    },
    {
        idCiclo: 10,
        nombre: "Tesorería"
    },
    {
        idCiclo: 11,
        nombre: "Contabilidad General"
    },
    {
        idCiclo: 12,
        nombre: "Comercio Exterior"
    },
    {
        idCiclo: 13,
        nombre: "Transferencia Electrónica de Fondos"
    },
    {
        idCiclo: 14,
        nombre: "Protección de usuarios de servicios financieros"
    }
]

export const newContext = React.createContext()

function Ciclo() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { state } = useLocation()

    const [cicloSelec, setCicloSelec] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [loadingTar, setLoadingTar] = useState(false)
    const [errorTar, setErrorTar] = useState(null)
    const [tareasByProyecto, setTareasByProyecto] = useState(null)
    const [idProyecto, setIdProyecto] = useState(null)
    const [titleArea, setTitleArea] = useState(null)
    const [titleProyecto, setTitleProyecto] = useState(null)
    const [descripcionProyecto, setDescripcionProyecto] = useState(null)
    const [modalProceso, setModalProceso] = useState(false)

    // Anterior areas
    const [subciclos, setSubciclos] = useState([]);
    // Anterior proyectos
    const [procesos, setProcesos] = useState([])

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    useEffect(() => {
        const fetchAreas = async () => {
            try {
            const res = await fetch("http://localhost:3030/apis/index",{
                method: "GET"
            })
            const data = await res.json()
            setSubciclos(data.objeto.areas)
            } catch (error) {
            console.log(error)
            }
        }

        const firstFetch = () => {
            fetchProcesos()
            .then(res => {
                if(res.error !== 0){
                    setLoading(false)
                    setError(res.errorDetalle)
                } else {
                    setLoading(false)
                    setProcesos(res.objeto)
                }
            })
        }

        const obj = ciclos.find(e => e.idCiclo === parseInt(id))
        if(obj === undefined){
            setCicloSelec(null)
            setLoading(false)
        } else {
            setCicloSelec(obj)
            setLoading(false)
        }
        
        fetchAreas()
        firstFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    const fetchProcesos = async () => {
        try {
            const res = await fetch("http://localhost:3030/apis/plan-accion/viewProyect", {
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
            const res = await fetch("http://localhost:3030/apis/plan-accion/viewTask", {
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

    const handleFormProceso = (e) => {
        e.preventDefault()
        setModalProceso(true)
    }

    return (
        <newContext.Provider 
            value={{loadingTar, setLoadingTar, errorTar, setErrorTar, procesos, setProcesos, fetchProcesos, fetchTareasById, tareasByProyecto, setTareasByProyecto, idProyecto, setIdProyecto, subciclos, titleArea, titleProyecto, descripcionProyecto, setTitleProyecto, setDescripcionProyecto, USER}}>
            <ModalNewProceso show={modalProceso} onHide={()=>setModalProceso(false)}/>
            <div className='ciclo section'>
                {cicloSelec === null ? "" : (
                    <div className='section__header d-flex flex-row align-items-end mb-4'>
                        <h4 className='btn__back m-0 me-2' onClick={()=>navigate(-1)}>{state.year}</h4>
                        <i className="bi bi-chevron-right me-2"></i>
                        <h4 className='m-0'>{state.title}</h4>
                    </div>
                )}
                {loading ? (
                    <div className='loading__ciclo d-flex flex-column align-items-center justify-content-center'>
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
                ): (
                    <>
                        {error ? (
                            <div className='ciclo__error d-flex flex-column align-items-center justify-content-center'>
                                <img className='mb-4' src={IllustrationAccess} alt="" />
                                <h2>Mensaje de error:</h2>
                                <p>{error}</p>
                            </div>
                        ) : (
                            <>
                                {cicloSelec === null ? (
                                    <div className='ciclo--null d-flex flex-column align-items-center justify-content-center'>
                                        <img className='mb-4' src={IllustrationAccess} alt="" />
                                        <h2 className='fw-semibold mb-2'>Not Found 404</h2>
                                        <p className='text-center'>La página que estás buscando no existe.</p>
                                        <Link className='btn shadow-sm fw-medium px-4' to={"/ciclos-de-auditoria"}>Regresar a ciclos de auditoría</Link>
                                    </div>
                                ) : (
                                    <div className='ciclo__main d-flex flex-column flex-md-row'>
                                        <div className='ciclo__main__menu mb-4 mb-md-0 d-flex flex-column align-items-start justify-content-between'>
                                            <div className='container__accordion'>
                                                <Accordion className='mb-2 mb-md-0' defaultActiveKey="0">
                                                    {subciclos.map((a, i) => {
                                                        return a.id_area === USER.area && <Accordion.Item key={a.id_area} eventKey={i}>
                                                            <Accordion.Header>{a.nombre_del_Area}</Accordion.Header>
                                                            <Accordion.Body className='d-flex flex-column align-items-start'>
                                                                {procesos.map((p, index) => {
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
                                                className='ciclo__main__menu__btn btn btn-primary rounded-pill shadow-sm fw-medium'
                                                onClick={handleFormProceso}
                                                >Agregar proceso
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
    )
}

export default Ciclo