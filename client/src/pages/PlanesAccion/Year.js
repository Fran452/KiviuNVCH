import React, { useState, useEffect, useRef } from 'react'
// import { useParams, Link, useNavigate } from "react-router-dom"
import { useParams, useNavigate } from "react-router-dom"
// Prueba table collapse
// import { Table, Collapse, Button, ListGroup } from 'react-bootstrap';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
//
import './Year.scss'
// import Avatar from "../../assets/img/avatar-3.jpg"
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import { 
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale
} from "chart.js";
import { Doughnut, Bar, getElementAtEvent } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns';
import {es} from 'date-fns/locale';
import IllustrationAccess from "../../assets/img/access.png"

// Marca el día actual
const todayLine = {
    id: 'todayLine',
    afterDatasetsDraw(chart, args, pluginOptions) {
        // const { ctx, data, chartArea: {top, bottom, left, right}, scales: { x, y } } = chart;
        const { ctx, chartArea: {top, bottom}, scales: { x } } = chart;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#6c757d';
        ctx.moveTo(x.getPixelForValue(new Date()), top);
        ctx.lineTo(x.getPixelForValue(new Date()), bottom);
        ctx.stroke();
    }
}

// Muestra info en las barras del gantt
// const viewPercentage = {
//     id: 'viewPercentage',
//     afterDatasetsDraw(chart) {
//         const ctx = chart.ctx;
//         chart.data.datasets.forEach(function(dataset, datasetIndex) {
//             const meta = chart.getDatasetMeta(datasetIndex);
//             meta.data.forEach(function(bar, index) {
//                 const data = dataset.data[index];
//                 ctx.fillStyle = '#fff'; // Color del texto
//                 ctx.font = 'bold 12px sans-serif';
//                 ctx.textBaseline = 'middle';
//                 const xPos = meta.data[index].base
//                 const position = bar.tooltipPosition();
//                 ctx.fillText(data.percentage, xPos + 10, position.y);
//             });
//         });
//     }
// }

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
)

// const list = [
//     {
//         nombre: "Francisco Lema",
//         task: "Análisis de requerimientos del sistema de gestión",
//         proceso: "Desarrollo de Sistema de Gestión"
//     },
//     {
//         nombre: "Richard Dawson",
//         task: "Pruebas de integración del sistema de gestión",
//         proceso: "Desarrollo de Sistema de Gestión"
//     },
//     {
//         nombre: "Margaret Cole",
//         task: "Desarrollo del módulo de informes",
//         proceso: "Automatización de Reportes"
//     },
//     {
//         nombre: "Joseph Li",
//         task: "Desarrollar encuesta de Clima",
//         proceso: "Plan de mejora de Clima Laboral"
//     },
//     {
//         nombre: "Francisco Lema",
//         task: "Análisis de requerimientos del sistema de gestión",
//         proceso: "Desarrollo de Sistema de Gestión"
//     },
//     {
//         nombre: "Richard Dawson",
//         task: "Pruebas de integración del sistema de gestión",
//         proceso: "Desarrollo de Sistema de Gestión"
//     },
//     {
//         nombre: "Margaret Cole",
//         task: "Desarrollo del módulo de informes",
//         proceso: "Automatización de Reportes"
//     },
//     {
//         nombre: "Joseph Li",
//         task: "Desarrollar encuesta de Clima",
//         proceso: "Plan de mejora de Clima Laboral"
//     }
// ]

function Year() {
    const { year } = useParams()
    const navigate = useNavigate();

    // state
    const [ciclos, setCiclos] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    // eslint-disable-next-line no-unused-vars
    const [totalTareas, setTotalTareas] = useState(null)
    const [tareasRealiz, setTareasRealiz] = useState(null)
    const [tareasNorealiz, setTareasNorealiz] = useState(null)

    const [isFullscreen, setIsFullscreen] = useState(false)
    const containerRef = useRef(null)

    const auth = localStorage.getItem("token")
    const jwtParse = jwtDecode(auth)
    const USER = jwtParse.apirest.objeto

    useEffect(() => {
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

        const firstMetrica = () => {
            fetchMetrica()
            .then(res => {
                if(res.error !== 0){
                    console.log(res.errorDetalle)
                } else {
                    console.log(res.objeto)
                    let sum = 0;
                    let tareasRealizadas = 0;
                    let tareasNorealizadas = 0;
                    const arr = res.objeto;
                    arr.forEach(e => {
                        sum += e.tareas_totales
                        tareasRealizadas += e.tareas_realizadas
                    })
                    setTotalTareas(sum)
                    setTareasRealiz(tareasRealizadas)
                    tareasNorealizadas = sum - tareasRealizadas;
                    setTareasNorealiz(tareasNorealizadas)
                }
            })
        }

        firstFetch()
        firstMetrica()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Fullscreen
    const enterFullscreen = () => {
        if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if (containerRef.current.mozRequestFullScreen) { // Firefox
                containerRef.current.mozRequestFullScreen();
            } else if (containerRef.current.webkitRequestFullscreen) { // Chrome, Safari and Opera
                containerRef.current.webkitRequestFullscreen();
            } else if (containerRef.current.msRequestFullscreen) { // IE/Edge
                containerRef.current.msRequestFullscreen();
            }
            setIsFullscreen(true);
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
        setIsFullscreen(false);
    };

    const handleFullscreenToggle = () => {
        if (isFullscreen) {
            exitFullscreen();
        } else {
            enterFullscreen();
        }
    };
    // Fin fullscreen

    // Actualizar el listado de proyectos
    const fetchCiclos = async () => {
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/viewCiclos", {
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

    // fetch métrica
    const fetchMetrica = async () => {
        try {
            const res = await fetch("http://164.92.77.143:3040/apis/plan-accion/metricas", {
                method: "GET"
            });
            const data = await res.json();
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const data = {
        labels: ['Realizadas', 'No realizadas'],
        datasets: [{
            label: '',
            data: [tareasRealiz, tareasNorealiz],
            backgroundColor: ['#0d6efd', '#9ec5fe'],
            borderColor: '#fff',
            hoverOffset: 4,
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label;
                        let value = context.formattedValue;
        
                        if (!label)
                            label = 'Unknown'
        
                        let sum = 0;
                        let dataArr = context.chart.data.datasets[0].data;
                        // eslint-disable-next-line array-callback-return
                        dataArr.map(data => {
                            sum += Number(data);
                        });
        
                        let percentage = (value * 100 / sum).toFixed(2) + '%';
                        return percentage.slice(0,4) + '%';
                    }
                }
            }
        }]
    }

    const options = {
        plugins: {
            legend: {
                display: false
            },
        },
        cutout: 40
    }

    const arrGantt = []
    ciclos.map((e) => {
        return arrGantt.push(
            {
                y: e.nombre,
                x: [e.fecha_inicio, e.fecha_final],
                idCiclo: e.id_ciclo,
                percentage: '50%'
            }
        )
    })

    // Bar Chart
    const dataBar = {
        datasets : [
          {
            label: 'Fechas establecidas',
            data: arrGantt,
            backgroundColor: '#0d6efd',
            borderWidth: 0,
            borderSkipped: false,
            borderRadius: 10,
            barThickness: 20
          },
        //   {
        //     label: 'Fechas reales',
        //     // fake data
        //     data: [
        //         {x: ['2024-08-09', '2024-10-05'], y: 'TARJETA DE CREDITO', idCiclo: 0, percentage: '50%'},
        //         {x: ['2024-08-07', '2024-09-10'], y: 'COMEX', idCiclo: 1, percentage: '40%'},
        //         {x: ['2024-09-09', '2024-10-08'], y: 'PUSF', idCiclo: 2, percentage: '40%'},
        //         {x: ['2024-08-07', '2024-11-11'], y: 'DEPÓSITOS', idCiclo: 3, percentage: '30%'},
        //     ],
        //     backgroundColor: '#6ea8fe',
        //     borderWidth: 0,
        //     borderSkipped: false,
        //     borderRadius: 10,
        //     barThickness: 20
        //   }
        ]
    }

    const numBars = dataBar.datasets[0].data.length;
    const containerHeight = 80 * numBars;

    const optionsBar = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: {
                        family: 'sans-serif'
                    }
                }
            },
            tooltip: {
                callbacks : {
                    label: (ctx) => {
                        const startDate = new Date(ctx.raw.x[0]).toLocaleDateString('es-ES', {timeZone: 'UTC', day: '2-digit', month: 'short'})
                        const endDate = new Date(ctx.raw.x[1]).toLocaleDateString('es-ES', {timeZone: 'UTC', day: '2-digit', month: 'short'})
                        return `${startDate} - ${endDate}`
                    }
                }
            }
        },
        layout: {},
        indexAxis: 'y',
        onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default'
        },
        scales: {
            x: {
                position: 'top',
                type: 'time',
                time: {
                    unit: 'month'
                },
                ticks: {
                    callback: (value, index, ticks) => {
                        const date = new Date(value);
                        return new Intl.DateTimeFormat('es-ES', {
                            // year: 'numeric',
                            month: 'short',
                        }).format(date)
                    },
                    font: {
                        family: 'sans-serif'
                    }
                },
                min: '2024-01-01',
                max: '2024-12-31'
            },
            y: {
                ticks: {
                    font: {
                        family: 'sans-serif'
                    }
                }
            }
        },
        adapters: {
            date: {
                locale: es
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }

    const chartRef = useRef()
    const onClick = (e) => {
        if(getElementAtEvent(chartRef.current, e).length > 0){
            const dataPoint = getElementAtEvent(chartRef.current, e)[0].index
            const data = {
                title: dataBar.datasets[0].data[dataPoint].y,
                year: year,
                id: dataBar.datasets[0].data[dataPoint].idCiclo
            }
            // navigate(`/ciclos-de-auditoria/${year}/${dataBar.datasets[0].data[dataPoint].idCiclo}`, {state: data})
            navigate(`/ciclos-de-auditoria/${year}/ciclos`, {state: data})
        }
    }

    return (
        <>
            <div className='auditoria__year section'>
                <div className='section__header d-flex flex-row align-items-end mb-4'>
                    <i className='bi bi-bar-chart-steps me-2'></i>
                    <h4 className='m-0'>Ciclos {year}</h4>
                </div>
                {/* <button onClick={()=>navigate(-1)}>Anterior</button> */}
                {loading ? (
                    <div className='loading__year d-flex flex-column align-items-center justify-content-center'>
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
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <img className='mb-4' src={IllustrationAccess} alt="" />
                                <h2>Mensaje de error:</h2>
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div className='auditoria__year__main'>
                                <div className='auditoria__year__main__content'>
                                    <div className='auditoria__year__main__content__introduccion rounded-3 mb-4'>
                                        <h2 className='text-white'>Bienvenido/a a los ciclos del año {year}</h2>
                                        <p className='text-white mb-0'>Aquí encontrarás las estadísticas de los ciclos del año {year}.</p>
                                    </div>

                                    <div ref={containerRef} className='auditoria__year__main__content__grafica' style={{ height: `${containerHeight}px`}}>
                                        <Bar 
                                            data={dataBar}
                                            options={optionsBar}
                                            // plugins={[todayLine, viewPercentage]}
                                            plugins={[todayLine]}
                                            onClick={onClick}
                                            ref={chartRef}
                                        />
                                        <button onClick={handleFullscreenToggle} className='btn__expandir btn p-0'>
                                            {isFullscreen ? <i className="bi bi-arrows-angle-contract"></i> : <i className="bi bi-arrows-angle-expand"></i>}
                                        </button>
                                    </div>
                                </div>
                                <div className='auditoria__year__main__aside'>
                                    <div className='auditoria__year__main__aside__graficas'>
                                        <div className='doughnut__grafica d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                                            <div className='doughnut__grafica__info d-flex flex-row align-items-center'>
                                                <div className='doughnut__grafica__info__textos'>
                                                    <h4 className='mb-2'>Total de tareas</h4>
                                                    <p className='mb-1 fw-medium'>Tareas realizadas: <span>{tareasRealiz}</span></p>
                                                    <p className='mb-0'>Tareas no realizadas: <span>{tareasNorealiz}</span></p>
                                                </div>
                                                <div className='doughnut__grafica__info__chart'>
                                                    <Doughnut 
                                                        data = {data}
                                                        options={options}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='auditoria__year__main__aside__actividad scroll--y shadow-sm rounded-3 border border-light-subtle'>
                                        <h3 className='mb-4'>Última actividad:</h3>
                                        <ul className='list-group'>
                                            {list.map((e,i) => {
                                                return <li className='d-flex flex-row mb-3' key={i}>
                                                    <img className='me-2' src={Avatar} alt="" />
                                                    <div>
                                                        <span className='fw-medium'>{e.nombre}</span> completó la tarea <span className='fw-medium'>{e.task}</span> del proceso <span className='fw-medium'>{e.proceso}</span>
                                                    </div>
                                                </li>
                                            })}
                                        </ul>
                                    </div> */}
                                </div>
                            </div>
                        )}
                    </>
                    
                )}
            </div>
        </>
    )
}

export default Year