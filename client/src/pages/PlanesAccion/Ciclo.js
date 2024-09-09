import React, { useEffect, useState } from 'react'
// import { useLocation, Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import './Ciclo.scss'
import { Accordion } from 'react-bootstrap';
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import IllustrationAccess from "../../assets/img/access.png"
import Tareas from '../../components/Tareas';
import ModalNewCiclo from '../../components/Modales/ModalNewCiclo';


export const newContext = React.createContext()

function Ciclo() {
    // const { id } = useParams()
    // const navigate = useNavigate()
    const { state } = useLocation()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [loadingTar, setLoadingTar] = useState(false)
    const [errorTar, setErrorTar] = useState(null)
    const [tareasByCiclo, setTareasByCiclo] = useState(null)
    const [idCiclo, setIdCiclo] = useState(null)
    const [yearSelec, setYearSelec] = useState(null)
    const [titleCiclo, setTitleCiclo] = useState(null)
    const [descripcionCiclo, setDescripcionCiclo] = useState(null)
    const [modalCiclo, setModalCiclo] = useState(false)

    const [expandedRow, setExpandedRow] = useState(null);

    // Anterior areas > subciclos
    // const [areas, setAreas] = useState([]);
    // Anterior proyectos
    const [ciclos, setCiclos] = useState([])

    //subtareas
    const [subtareas, setSubtareas] = useState([])

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    useEffect(() => {
        // const fetchAreas = async () => {
        //     try {
        //     const res = await fetch("http://localhost:3030/apis/index",{
        //         method: "GET"
        //     })
        //     const data = await res.json()
        //     setAreas(data.objeto.areas)
        //     } catch (error) {
        //     console.log(error)
        //     }
        // }

        const firstFetch = () => {
            fetchCiclos()
            .then(res => {
                if(res.error !== 0){
                    setLoading(false)
                    setError(res.errorDetalle)
                } else {
                    setLoading(false)
                    setCiclos(res.objeto)
                }
            })
        }
        
        // fetchAreas()
        firstFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const fetchCiclos = async () => {
        try {
            const res = await fetch("http://localhost:3040/apis/plan-accion/viewCiclos", {
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
            const res = await fetch("http://localhost:3040/apis/plan-accion/viewTask", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                user: USER,
                idCiclo: id
              })
            })
            const data = await res.json()
            return data
        } catch (error) {
        console.log(error)
        }
    }

    const handleTareaById = async (id, year, titleProyecto, detalles) => {
        setLoadingTar(true)
        fetchTareasById(id)
        .then(res => {
            if(res.error !== 0){
                setLoadingTar(false)
                setErrorTar(res.errorDetalle)
            } else {
                setLoadingTar(false)
                setTareasByCiclo(res.objeto)
            }
        })
        setIdCiclo(id)
        setYearSelec(year)
        setTitleCiclo(titleProyecto)
        setDescripcionCiclo(detalles)
        setSubtareas([])
        setExpandedRow(null)
    }

    const handleFormProceso = (e) => {
        e.preventDefault()
        setModalCiclo(true)
    }

    return (
        <newContext.Provider 
            value={{subtareas, setSubtareas, loadingTar, setLoadingTar, errorTar, setErrorTar, ciclos, setCiclos, fetchCiclos, fetchTareasById, tareasByCiclo, setTareasByCiclo, yearSelec, setYearSelec, idCiclo, setIdCiclo, titleCiclo, descripcionCiclo, setTitleCiclo, setDescripcionCiclo, USER, expandedRow, setExpandedRow}}>
            <ModalNewCiclo show={modalCiclo} onHide={()=>setModalCiclo(false)}/>
            <div className='ciclo section'>
                {/* {cicloSelec === null ? "" : (
                    <div className='section__header d-flex flex-row align-items-end mb-4'>
                        <h4 className='btn__back m-0 me-2' onClick={()=>navigate(-1)}>{state.year}</h4>
                        <i className="bi bi-chevron-right me-2"></i>
                        <h4 className='m-0'>{state.title}</h4>
                    </div>
                )} */}
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
                                {state === null ? (
                                    <h1>Year equals null</h1>
                                ) : (
                                    <div className='ciclo__main d-flex flex-column flex-md-row'>
                                        <div className='ciclo__main__menu mb-4 mb-md-0 d-flex flex-column align-items-start justify-content-between'>
                                            <div className='container__accordion'>
                                                <Accordion className='mb-2 mb-md-0' defaultActiveKey="0">
                                                    <Accordion.Item eventKey='0'>
                                                        <Accordion.Header>{state.year}</Accordion.Header>
                                                        <Accordion.Body className='d-flex flex-column align-items-start'>
                                                            {ciclos.map((c,i) => {
                                                                return <button
                                                                    key={i} 
                                                                    className='btn d-flex align-items-center' 
                                                                    onClick={() => handleTareaById(c.id_ciclo, state.year, c.nombre, c.detalles)}
                                                                    >
                                                                        <i className="bi bi-chevron-right me-2 active"></i><span>{c.nombre}</span>
                                                                </button>
                                                            })}
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                            </div>
                                            <button 
                                                className='ciclo__main__menu__btn btn btn-primary rounded-pill shadow-sm fw-medium'
                                                onClick={handleFormProceso}
                                                >Agregar ciclo
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