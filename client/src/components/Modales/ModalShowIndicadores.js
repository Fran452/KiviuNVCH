import React, { useContext, useState, useEffect } from 'react'
import { 
  Chart as ChartJS,
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend
} from "chart.js";
import { Bar } from 'react-chartjs-2'
import { Modal } from 'react-bootstrap';
import Avatar from '../../assets/img/avatar-2.png'
import { jwtDecode } from "jwt-decode"
import './ModalShowIndicador.scss'
import { Oval } from 'react-loader-spinner'

import { DataInContext } from '../../context/DataInContext'

const FRECUENCIAS = [
  { id: 1, tipo: "Semanal" },
  { id: 2, tipo: "Quincenal" },
  { id: 3, tipo: "Mensual" },
  { id: 4, tipo: "Trimestral" }
]

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

function ModalShowIndicadores(props) {

  const { arrTresMetricas, setArrTresMetricas, indicadorID, setIndicadorID, areaSelec, handleShowIndicador } = useContext(DataInContext)

  const [arrMetrica, setArrMetrica] = useState(null)
  const [arrLabels, setArrLabels] = useState(null)
  const [formMetrica, setFormMetrica] = useState(false)
  const [formEditMetrica, setFormEditMetrica] = useState(false)

  const [loadingMet, setLoadingMet] = useState(false)

  const [newLog, setNewLog] = useState({
    log: ""
  })

  const [editLog, setEditLog] = useState({
    log: ""
  })
  const [errorNewLog, setErrorNewLog] = useState({})
  const [errorLogFetch, setErrorLogFetch] = useState(null)

  const [idMetrica, setIdMetrica] = useState(null)

  const auth = localStorage.getItem("token")
  const jwtParse = jwtDecode(auth)
  const USER = jwtParse.apirest.objeto

  useEffect(() => {
    if(loadingMet){
      handleShowIndicador(indicadorID.id_indicador)
      setLoadingMet(false)
    }
    let arrMet = []
    let arrLabel = []
    arrTresMetricas.forEach((e) => {
      arrMet.push(parseInt(e.dato_metrica))
      arrLabel.push((e.fecha_Metrica.slice(0,10)).replace(/-/g, '/').split("/").reverse().join("/"))
    })
    arrMet.reverse()
    arrLabel.reverse()
    setArrMetrica(arrMet)
    setArrLabels(arrLabel)
  },[arrTresMetricas, loadingMet])

  const handleClose = () => {
      props.onHide()
      setArrTresMetricas([])
      setIndicadorID({})
      setErrorNewLog({})
      setNewLog({
        log: ""
      })
      setErrorLogFetch(null)
      setFormMetrica(false)
  }

  const data = {
    labels: arrLabels,
    datasets : [
      {
        label: indicadorID.nombre_indicador,
        data: arrMetrica,
        backgroundColor: indicadorID.color,
        borderWidth: 1
      }
    ]
  }

  const options = {

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewLog({
      ...newLog,
      [name]: value,
    })
  }

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditLog({
      ...editLog,
      [name]: value,
    })
  }

  const validateFormLog = (data) => {
    const errors = {}
    if(!data.log.trim()) {
        errors.log = "Escriba el log."
    }
    return errors;
  }

  const newMetrica = async (e) => {
    e.preventDefault()
    const errorLog = validateFormLog(newLog)
    setErrorNewLog(errorLog)
    if(Object.keys(errorLog).length === 0){
      const obj = {
        fk_indicador: parseInt(indicadorID.id_indicador),
        dato_metrica: parseInt(newLog.log),
        user: USER
      }
      try {
        const res = await fetch("http://164.92.77.143:3030/apis/dateIn/newMetrica", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          setErrorLogFetch(data.errorDetalle)
        } else {
            setNewLog({
                log: ""
            })
            console.log("Se ingresó la métrica")
            setFormMetrica(false)
            setLoadingMet(true)
        }
      } catch (error) {
        setErrorLogFetch(error)
      }
    }
  }

  const handleShowForm = () => {
    setFormMetrica(true)
  }

  const handleCloseForm = () => {
    setFormMetrica(false)
    setFormEditMetrica(false)
    setErrorNewLog({})
    setNewLog({
      log: ""
    })
    setEditLog({
      log: ""
    })
    setErrorLogFetch(null)
    setIdMetrica(null)
  }

  // Editar métrica
  const showEditMetrica = (id) => {
    const obj = arrTresMetricas.find(e => e.id_metrica === id)
    setEditLog({
      log: obj.dato_metrica
    })
    setIdMetrica(id)
    setFormEditMetrica(true)
  }

  const modMetrica = async (e) => {
    e.preventDefault()
    const errorLog = validateFormLog(editLog)
    setErrorNewLog(errorLog)
    if(Object.keys(errorLog).length === 0){
      const obj = {
        idMetrica: parseInt(idMetrica),
        dato_metrica: parseInt(editLog.log),
        user: USER
      }
      try {
        const res = await fetch("http://164.92.77.143:3030/apis/dateIn/editMetrica", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        })
        const data = await res.json()
        if(data.error !== 0) {
          setErrorLogFetch(data.errorDetalle)
        } else {
            setEditLog({
              log: ""
            })
            console.log("Se corrigió la métrica")
            setFormEditMetrica(false)
            setIdMetrica(null)
            setLoadingMet(true)
        }
      } catch (error) {
        setErrorLogFetch(error)
      }
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      className='modal__showindicador'
    >
      {loadingMet ? (
        <Modal.Body>
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
        </Modal.Body>
      ) : (
        <>
          <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row'>
              <h3 className='m-0'>Información del indicador</h3>
              <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='preview'>
                <div className='d-flex flex-row align-items-center justify-content-between'>
                  <div className='preview__title d-flex flex-column mb-4'>
                    <h4 className='mb-0 text-muted'>{areaSelec}</h4>
                    <h2 style={{color:indicadorID.color}} className='mb-0 me-2'>{indicadorID.nombre_indicador}</h2>
                    <p className='mb-0'><span className='text-muted'>Descripción: </span>{indicadorID.detalles_metrica}</p>
                    <p className='mb-0'><span className='text-muted'>Frecuencia:</span>
                      {FRECUENCIAS.map((e, i) => {
                        return e.id === parseInt(indicadorID.tipo_recordartorio) && <span key={i}> {e.tipo}</span>
                      })}
                    </p>
                  </div>
                  <button onClick={handleShowForm} className='btn btn-primary rounded-pill shadow-sm fw-medium px-4'>Agregar métrica</button>
                </div>
                
                <div className='preview__logs d-flex flex-row'>
                  <div className='preview__logs__lista me-4'>
                    {arrTresMetricas.map((e, i) => {
                    return <div key={i} className='preview__logs__lista__log shadow-sm rounded-3 border border-light'>
                        <div className='d-flex flex-row align-items-center'>
                            <img className='me-1' src={Avatar} alt="" />
                            <p className='mb-0'>{e.Empleados.nombre}</p>
                        </div>
                        <p className='d-flex flex-row mb-0'><i className='bi bi-bar-chart-fill me-2'></i>{e.dato_metrica}</p>
                        <div className='d-flex flex-row justify-content-between'>
                            <p className='me-2 d-flex flex-row mb-0'><i className="bi bi-calendar-event me-1"></i>
                            {(e.fecha_Metrica.slice(0,10)).replace(/-/g, '/').split("/").reverse().join("/")}
                            </p>
                            <p className='d-flex flex-row mb-0'><i className="bi bi-clock me-1"></i>
                            {(e.fecha_Metrica.slice(11,16))}
                            </p>
                        </div>
                        <div className='preview__logs__lista__log__btn p-2 active'>
                          <button onClick={()=>showEditMetrica(e.id_metrica)} className='btn__edit btn bg-success rounded-circle mb-2 text-white' ><i className="bi bi-pencil text-white"></i></button>
                        </div>
                      </div>
                    })}
                  </div>
                  <div className='preview__logs__grafica'>
                    <Bar 
                      data = {data}
                      options = {options}
                    />
                  </div>
                </div>
              </div>
          </Modal.Body>
          {editLog && <>
            {formEditMetrica && <Modal.Footer>
                  <div className='form__metrica d-flex flex-row align-items-center w-100'>
                    <form onSubmit={modMetrica} className='d-flex flex-column flex-md-row justify-content-between align-items-center w-100'>
                      <div className='form__input d-flex flex-row align-items-center me-3'>
                        <label className='me-1 col-12 col-md-3 col-form-label'>Modifica el valor:</label>
                        <div className='d-flex flex-column col-12 col-md-9'>
                          <input
                            onChange={handleChangeEdit}
                            type="number"  
                            name="log" 
                            autoFocus
                            className="input--arrows form-control form-control-sm"
                            value={editLog.log}
                          />
                          {errorNewLog.log && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorNewLog.log}</span>}
                          {errorLogFetch && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorLogFetch}</span>}
                        </div>
                      </div>
                      <button type="submit" className='btn__metrica btn btn-primary rounded-pill shadow-sm fw-medium'>Modificar métrica</button>
                    </form>
                    <button className='btn' onClick={handleCloseForm}><i className="bi bi-x-lg fw-bold"></i></button>
                  </div>
                </Modal.Footer>
                }
          </>}
          {formMetrica && <Modal.Footer>
            <div className='form__metrica d-flex flex-row align-items-center w-100'>
              <form onSubmit={newMetrica} className='d-flex flex-column flex-md-row justify-content-between align-items-center w-100'>
                <div className='form__input d-flex flex-row align-items-center me-3'>
                  <label className='me-1 col-12 col-md-3 col-form-label'>Ingresa el valor:</label>
                  <div className='d-flex flex-column col-12 col-md-9'>
                    <input
                      onChange={handleChange}
                      type="number"  
                      name="log" 
                      autoFocus
                      className="input--arrows form-control form-control-sm"
                      value={newLog.log}
                    />
                    {errorNewLog.log && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorNewLog.log}</span>}
                    {errorLogFetch && <span className='formDataIn__error d-flex flex-row align-items-center px-1 my-1'><i className="bi bi-exclamation-circle me-1"></i>{errorLogFetch}</span>}
                  </div>
                </div>
                <button type="submit" className='btn__metrica btn btn-primary rounded-pill shadow-sm fw-medium'>Insertar métrica</button>
              </form>
              <button className='btn' onClick={handleCloseForm}><i className="bi bi-x-lg fw-bold"></i></button>
            </div>
          </Modal.Footer>
          }
        </>
      )}
    </Modal>    
  )
}

export default ModalShowIndicadores