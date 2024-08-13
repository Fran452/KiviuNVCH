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
import { DataInContext } from '../../context/DataInContext'
import { Modal } from 'react-bootstrap';
import Avatar from '../../assets/img/avatar-2.png'

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

  const { arrTresMetricas, setArrTresMetricas, indicadorID, setIndicadorID } = useContext(DataInContext)

  const [arrMetrica, setArrMetrica] = useState(null)
  const [arrLabels, setArrLabels] = useState(null)

  useEffect(() => {
    let arrMet = []
    let arrLabel = []
    arrTresMetricas.forEach((e) => {
      arrMet.push(parseInt(e.dato_metrica))
      arrLabel.push(new Date(e.fecha_Metrica).getDate() + "-" + (new Date(e.fecha_Metrica).getMonth()+1) + "-" + new Date(e.fecha_Metrica).getFullYear())
    })
    arrMet.reverse()
    arrLabel.reverse()
    setArrMetrica(arrMet)
    setArrLabels(arrLabel)
  },[arrTresMetricas])

  const handleClose = () => {
      props.onHide()
      setArrTresMetricas([])
      setIndicadorID({})
  }

  const data = {
    labels: arrLabels,
    datasets : [
      {
        label: indicadorID.nombre_indicador,
        data: arrMetrica,
        backgroundColor: 'rgba(13, 110, 253, 100)',
        borderWidth: 1
      }
    ]
  }

  const options = {

  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" className='d-flex flex-row'>
            <h3 className='m-0'>Información del indicador</h3>
            <button className='btn' onClick={handleClose}><i className="bi bi-x-lg fw-bold"></i></button>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='preview mb-4'>
              <div className='preview__title d-flex flex-column mb-4'>
                {/* <h4 className='mb-0 text-muted'>{indicadorID.Areas.nombre_del_Area}</h4> */}
                <h2 className='mb-0 me-2 '>{indicadorID.nombre_indicador}</h2>
                <p className='mb-0'><span className='text-muted'>Descripción: </span>{indicadorID.detalles_metrica}</p>
                <p className='mb-0'><span className='text-muted'>Frecuencia:</span>
                  {FRECUENCIAS.map((e, i) => {
                    return e.id === parseInt(indicadorID.tipo_recordartorio) && <span key={i}> {e.tipo}</span>
                  })}
                </p>
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
                      <div className='d-flex flex-row'>
                          <p className='me-2 d-flex flex-row mb-0'><i className="bi bi-calendar-event me-1"></i>
                          {new Date(e.fecha_Metrica).getDate() + "-" + (new Date(e.fecha_Metrica).getMonth()+1) + "-" + new Date(e.fecha_Metrica).getFullYear()}
                          </p>
                          <p className='d-flex flex-row mb-0'><i className="bi bi-clock me-1"></i>
                          {new Date(e.fecha_Metrica).getHours() + "-" + new Date(e.fecha_Metrica).getMinutes() + "-" + new Date(e.fecha_Metrica).getSeconds()}
                          </p>
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
    </Modal>    
  )
}

export default ModalShowIndicadores