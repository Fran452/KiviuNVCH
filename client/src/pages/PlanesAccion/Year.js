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
import { Bar, getElementAtEvent } from 'react-chartjs-2'
// import { Doughnut, Bar, getElementAtEvent } from 'react-chartjs-2'
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
const viewPercentage = {
    id: 'viewPercentage',
    afterDatasetsDraw(chart, args, pluginOptions) {
        // const { ctx, data, chartArea: {top, bottom, left, right}, scales: { x, y } } = chart;
        const { ctx, data, scales: { y } } = chart;
        ctx.save();
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        data.datasets.forEach((dataset, datasetIndex) => {
            dataset.data.forEach((datapoint, index) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                const bar = meta.data[index]
                const xPos = bar.base
                ctx.fillText(datapoint.percentage, xPos + 10, y.getPixelForValue(index));
            })
        })
    }
}

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

        firstFetch()
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

    // const arr1 = [57, 71]
    // const arr2 = [7, 9]

    // const data = {
    //     labels: ['Realizadas', 'No realizadas'],
    //     datasets: [{
    //         label: '',
    //         data: arr1,
    //         backgroundColor: ['#0d6efd', '#9ec5fe'],
    //         borderColor: '#fff',
    //         hoverOffset: 4,
    //         tooltip: {
    //             callbacks: {
    //                 label: function(context) {
    //                     let label = context.label;
    //                     let value = context.formattedValue;
        
    //                     if (!label)
    //                         label = 'Unknown'
        
    //                     let sum = 0;
    //                     let dataArr = context.chart.data.datasets[0].data;
    //                     dataArr.map(data => {
    //                         sum += Number(data);
    //                     });
        
    //                     let percentage = (value * 100 / sum).toFixed(2) + '%';
    //                     return percentage.slice(0,4) + '%';
    //                 }
    //             }
    //         }
    //     }]
    // }

    // const data2 = {
    //     labels: ['Cumplieron', 'No cumplieron'],
    //     datasets: [{
    //         label: '',
    //         data: arr2,
    //         backgroundColor: ['#0d6efd', '#9ec5fe'],
    //         borderColor: '#fff',
    //         hoverOffset: 4,
    //         tooltip: {
    //             callbacks: {
    //                 label: function(context) {
    //                     let label = context.label;
    //                     let value = context.formattedValue;
        
    //                     if (!label)
    //                         label = 'Unknown'
        
    //                     let sum = 0;
    //                     let dataArr = context.chart.data.datasets[0].data;
    //                     dataArr.map(data => {
    //                         sum += Number(data);
    //                     });
        
    //                     let percentage = (value * 100 / sum).toFixed(2) + '%';
    //                     return percentage.slice(0,4) + '%';
    //                 }
    //             }
    //         }
    //     }]
    // }

    // const options = {
    //     plugins: {
    //         legend: {
    //             display: false
    //         },
    //     },
    //     cutout: 40
    // }

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
        // labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
        datasets : [
          {
            label: '',
            data: arrGantt,
            // data: [
            //     {x: ['2024-11-01', '2024-11-30'], y: 'Planeamiento', idCiclo: 0, percentage: '50%'},
            //     {x: ['2024-03-01', '2024-05-31'], y: 'Préstamos 1ra revisión', idCiclo: 1, percentage: '40%'},
            //     {x: ['2024-11-01', '2024-12-31'], y: 'Préstamos 2da revisión', idCiclo: 2, percentage: '40%'},
            //     {x: ['2024-08-01', '2024-09-30'], y: 'Tarjetas de crédito', idCiclo: 3, percentage: '30%'},
            //     {x: ['2024-12-01', '2024-12-31'], y: 'TI - sección 2', idCiclo: 4, percentage: '70%'},
            //     {x: ['2024-12-01', '2024-12-31'], y: 'TI - sección 4', idCiclo: 5, percentage: '40%'},
            //     {x: ['2024-08-01', '2024-08-31'], y: 'TI - sección 6', idCiclo: 6, percentage: '20%'},
            //     {x: ['2024-10-01', '2024-10-31'], y: 'TI - sección 7', idCiclo: 7, percentage: '80%'},
            //     {x: ['2024-11-01', '2024-11-30'], y: 'TI - sección 8', idCiclo: 8, percentage: '10%'},
            //     {x: ['2024-12-01', '2024-12-31'], y: 'Tecnología Informática', idCiclo: 9, percentage: '90%'},
            //     {x: ['2024-08-01', '2024-10-31'], y: 'Depósitos', idCiclo: 10, percentage: '40%'},
            //     {x: ['2024-12-01', '2024-12-31'], y: 'Tesorería', idCiclo: 11, percentage: '20%'},
            //     {x: ['2024-11-01', '2024-12-31'], y: 'Contabilidad General', idCiclo: 12, percentage: '70%'},
            //     {x: ['2024-08-01', '2024-08-31'], y: 'Comercio Exterior', idCiclo: 13, percentage: '60%'},
            //     {x: ['2024-08-01', '2024-08-31'], y: 'Transferencia Electrónica de Fondos', idCiclo: 14, percentage: '30%'},
            //     {x: ['2024-09-01', '2024-09-30'], y: 'Protección de usuarios de S.F.', idCiclo: 15, percentage: '50%'}
            // ],
            // data: [65, 59, 80, 81, 56, 55, 40, 55, 36, 49, 52, 43],
            backgroundColor: '#0d6efd',
            borderWidth: 0,
            borderSkipped: false,
            borderRadius: 10,
            barThickness: 20
          }
        ]
    }

    const optionsBar = {
        plugins: {
            legend: {
                display: false
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
        layout: {
        },
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
        }
    }

    const chartRef = useRef()
    const onClick = (e) => {
        if(getElementAtEvent(chartRef.current, e).length > 0){
            // console.log(getElementAtEvent(chartRef.current, e)[0])
            const dataPoint = getElementAtEvent(chartRef.current, e)[0].index
            // console.log(dataBar.datasets[0].data[dataPoint])
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

                                    <div ref={containerRef} className='auditoria__year__main__content__grafica'>
                                        <Bar 
                                            data={dataBar}
                                            options={optionsBar}
                                            plugins={[todayLine, viewPercentage]}
                                            onClick={onClick}
                                            ref={chartRef}
                                        />
                                        <button onClick={handleFullscreenToggle} className='btn__expandir btn p-0'>
                                            {isFullscreen ? <i className="bi bi-arrows-angle-contract"></i> : <i className="bi bi-arrows-angle-expand"></i>}
                                        </button>
                                    </div>
                                </div>
                                <div className='auditoria__year__main__aside'></div>
                                {/* <div className='auditoria__year__main__aside'>
                                    <div className='auditoria__year__main__aside__graficas'>
                                        <div className='doughnut__grafica d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                                            <div className='doughnut__grafica__info d-flex flex-row align-items-center'>
                                                <div className='doughnut__grafica__info__textos'>
                                                    <h4 className='mb-2'>Total de tareas</h4>
                                                    <p className='mb-1 fw-medium'>Tareas realizadas: <span>{arr1[0]}</span></p>
                                                    <p className='mb-0'>Tareas no realizadas: <span>{arr1[1]}</span></p>
                                                </div>
                                                <div className='doughnut__grafica__info__chart'>
                                                    <Doughnut 
                                                        data = {data}
                                                        options={options}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className='doughnut__grafica d-flex flex-column shadow-sm rounded-3 border border-light-subtle'>
                                            <div className='doughnut__grafica__info d-flex flex-row align-items-center'>
                                                <div className='doughnut__grafica__info__textos'>
                                                    <h4 className='mb-2'>Avance por auditores</h4>
                                                    <p className='mb-1 fw-medium'>Cumplieron sus tareas: <span>{arr2[0]}</span></p>
                                                    <p className='mb-0'>No cumplieron sus tareas: <span>{arr2[1]}</span></p>
                                                </div>
                                                <div className='doughnut__grafica__info__chart'>
                                                    <Doughnut 
                                                        data = {data2}
                                                        options={options}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='auditoria__year__main__aside__actividad scroll--y shadow-sm rounded-3 border border-light-subtle'>
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
                                    </div>
                                </div> */}
                            </div>
                        )}
                    </>
                    
                )}
            </div>
        </>
    )
}

export default Year