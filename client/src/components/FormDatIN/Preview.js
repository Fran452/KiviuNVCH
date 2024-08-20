import React, { useContext, useEffect, useState } from 'react'
import { 
  Chart as ChartJS,
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend
} from "chart.js";
import { Bar } from 'react-chartjs-2'
// import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PasosContext } from '../../context/PasosContext'
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

function Preview() {
  const { userData, logData } = useContext(PasosContext)
  const [arrMetrica, setArrMetrica] = useState(null)
  const [arrLabels, setArrLabels] = useState(null)

  // const actualDay = new Date().toLocaleDateString("es-ES", { day: 'numeric' }).substring(0,3) + " " + new Date().toLocaleDateString("es-ES", { month: 'long' }).slice(0,3);
 
  const actualDay = new Date().toLocaleString("es-ES", {day: 'numeric', month: '2-digit', year: 'numeric'})
  const actualHour = new Date().toLocaleString("es-ES", {minute: '2-digit', hour: '2-digit', second: '2-digit'});

  useEffect(() => {
    let arrMet = []
    let arrLabel = []
    // lastThree.forEach((e) => {
    //   arrMet.push(parseInt(e.dato_metrica))
    //   arrLabel.push(new Date(e.fecha_Metrica.replace(/-/g, '/')).toLocaleDateString())
    // })
    // arrMet.reverse()
    // arrLabel.reverse()
    arrMet.push(parseInt(logData.log))
    arrLabel.push(actualDay)
    setArrMetrica(arrMet)
    setArrLabels(arrLabel)
  },[])
  

  const data = {
    labels: arrLabels,
    datasets : [
      {
        label: userData.indicador,
        data: arrMetrica,
        backgroundColor: 'rgba(13, 110, 253, 100)',
        borderWidth: 1
      }
    ]
  }

  const options = {

  }

  // const renderTooltip = (props) => (
  //   <Tooltip id="button-tooltip" {...props}>
  //     {userData.descripcion}
  //   </Tooltip>
  // );

  return (
    <div className='preview mb-4'>
      <div className='preview__title d-flex flex-column mb-4'>
        <h4 className='mb-0 text-muted'>{userData.area}</h4>
        <h2 className='mb-0 me-2 '>{userData.indicador}</h2>
        <p className='mb-0'><span className='text-muted'>Descripción: </span>{userData.descripcion}</p>
        {/* Nombre indicador */}
        {/* <div className='d-flex flex-row align-items-center'>
            <h2 className='mb-0 me-2 '>{userData.indicador}</h2>
            <OverlayTrigger
              placement="right"
              delay={{ show: 100, hide: 100 }}
              overlay={renderTooltip}
            >
                <i className="bi bi-info-circle"></i>
            </OverlayTrigger>
        </div> */}
        {/* Nombre indicador fin */}
        <p className='mb-0'><span className='text-muted'>Frecuencia:</span>
          {FRECUENCIAS.map((e, i) => {
            return e.id === parseInt(userData.frecuencia) && <span key={i}> {e.tipo}</span>
          })}
        </p>
      </div>
      <div className='preview__logs d-flex flex-column-reverse flex-md-row'>
        <div className='preview__logs__lista me-0 me-md-4'>
          <div className='preview__logs__lista__log mb-2 shadow-sm rounded-3 border border-light'>
            <div className='d-flex flex-row align-items-center'>
              <img className='me-1' src={Avatar} alt="" />
              <p className='mb-0'>{userData.responsable}</p>
            </div>
            <div className='d-flex flex-column'>
              <p className='d-flex flex-row mb-0'><i className='bi bi-bar-chart-fill me-2'></i>{logData.log}</p>
              <div className='d-flex flex-row'>
                <p className='me-2 d-flex flex-row mb-0'><i className="bi bi-calendar-event me-1"></i>
                  {actualDay}
                </p>
                <p className='d-flex flex-row mb-0'><i className="bi bi-clock me-1"></i>
                  {actualHour}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='preview__logs__grafica d-flex justify-content-center d-md-block '>
          <div className='preview__logs__grafica__container'>
            <Bar 
              data = {data}
              options = {options}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview