import React from 'react'
import { useParams, Link, useNavigate } from "react-router-dom"
import './Year.scss'
import Avatar from "../../assets/img/avatar-3.jpg"
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
import { Doughnut, Bar } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns';
import {es} from 'date-fns/locale';

// Marca el día actual
const todayLine = {
    id: 'todayLine',
    afterDatasetsDraw(chart, args, pluginOptions) {
        const { ctx, data, chartArea: {top, bottom, left, right}, scales: { x, y } } = chart;
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
        const { ctx, data, chartArea: {top, bottom, left, right}, scales: { x, y } } = chart;
        ctx.save();
        ctx.font = 'bolder 12px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'middle';
        data.datasets.forEach((dataset, datasetIndex) => {
            dataset.data.forEach((datapoint, index) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                console.log(meta)
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

const list = [
    {
        nombre: "Francisco Lema",
        task: "Análisis de requerimientos del sistema de gestión",
        proceso: "Desarrollo de Sistema de Gestión"
    },
    {
        nombre: "Richard Dawson",
        task: "Pruebas de integración del sistema de gestión",
        proceso: "Desarrollo de Sistema de Gestión"
    },
    {
        nombre: "Margaret Cole",
        task: "Desarrollo del módulo de informes",
        proceso: "Automatización de Reportes"
    },
    {
        nombre: "Joseph Li",
        task: "Desarrollar encuesta de Clima",
        proceso: "Plan de mejora de Clima Laboral"
    },
    {
        nombre: "Francisco Lema",
        task: "Análisis de requerimientos del sistema de gestión",
        proceso: "Desarrollo de Sistema de Gestión"
    },
    {
        nombre: "Richard Dawson",
        task: "Pruebas de integración del sistema de gestión",
        proceso: "Desarrollo de Sistema de Gestión"
    },
    {
        nombre: "Margaret Cole",
        task: "Desarrollo del módulo de informes",
        proceso: "Automatización de Reportes"
    },
    {
        nombre: "Joseph Li",
        task: "Desarrollar encuesta de Clima",
        proceso: "Plan de mejora de Clima Laboral"
    }
]

function Year() {
    const { year } = useParams()
    // const navigate = useNavigate();

    const arr1 = [57, 71]
    const arr2 = [7, 9]

    const data = {
        labels: ['Realizadas', 'No realizadas'],
        datasets: [{
            label: '',
            data: arr1,
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

    const data2 = {
        labels: ['Cumplieron', 'No cumplieron'],
        datasets: [{
            label: '',
            data: arr2,
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

    // Bar Chart
    const dataBar = {
        // labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
        datasets : [
          {
            label: '',
            data: [
                {x: ['2024-11-01', '2024-11-30'], y: 'Planeamiento', percentage: '50%'},
                {x: ['2024-11-01', '2024-12-31'], y: 'Préstamos', percentage: '40%'},
                {x: ['2024-08-01', '2024-09-30'], y: 'Tarjetas de crédito', percentage: '30%'},
                {x: ['2024-12-01', '2024-12-31'], y: 'TI - sección 2', percentage: '70%'},
                {x: ['2024-12-01', '2024-12-31'], y: 'TI - sección 4', percentage: '40%'},
                {x: ['2024-08-01', '2024-08-31'], y: 'TI - sección 6', percentage: '20%'},
                {x: ['2024-10-01', '2024-10-31'], y: 'TI - sección 7', percentage: '80%'},
                {x: ['2024-11-01', '2024-11-30'], y: 'TI - sección 8', percentage: '10%'},
                {x: ['2024-12-01', '2024-12-31'], y: 'Tecnología Informática', percentage: '90%'},
                {x: ['2024-08-01', '2024-10-31'], y: 'Depósitos', percentage: '40%'},
                {x: ['2024-12-01', '2024-12-31'], y: 'Tesorería', percentage: '20%'},
                {x: ['2024-11-01', '2024-12-31'], y: 'Contabilidad General', percentage: '70%'},
                {x: ['2024-08-01', '2024-08-31'], y: 'Comercio Exterior', percentage: '60%'},
                {x: ['2024-08-01', '2024-08-31'], y: 'Transferencia Electrónica de Fondos', percentage: '30%'},
                {x: ['2024-09-01', '2024-09-30'], y: 'Protección de usuarios de S.F.', percentage: '50%'}
            ],
            // data: [65, 59, 80, 81, 56, 55, 40, 55, 36, 49, 52, 43],
            backgroundColor: '#0d6efd',
            borderWidth: 1,
            borderSkipped: false,
            borderRadius: 10,
          }
        ]
    }

    const optionsBar = {
        plugins: {
            legend: {
                display: false
            },
        },
        layout: {
        },
        indexAxis: 'y',
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

    return (
        <>
            <div className='auditoria__year section'>
                <div className='section__header d-flex flex-row align-items-end mb-4'>
                    <i className='bi bi-bar-chart-steps me-2'></i>
                    <h4 className='m-0'>Ciclo Anual {year}</h4>
                </div>
                {/* <button onClick={()=>navigate(-1)}>Anterior</button> */}
                <div className='auditoria__year__main'>
                    <div className='auditoria__year__main__content'>
                        <div className='auditoria__year__main__content__introduccion rounded-3 mb-4'>
                            <h2 className='text-white'>Bienvenido al ciclo anual {year}</h2>
                            <p className='text-white mb-0'>Aquí encontrarás las estadísticas de los procesos del ciclo anual {year}.</p>
                        </div>
                        <div className='auditoria__year__main__content__grafica'>
                            <Bar 
                                data={dataBar}
                                options={optionsBar}
                                plugins={[todayLine, viewPercentage]}
                            />
                        </div>
                        {/* <div>
                            <Link to={`/ciclos-de-auditoria/${year}/1`}>Item 1</Link>
                            <br />
                            <Link to={`/ciclos-de-auditoria/${year}/2`}>Item 2</Link>
                            <br />
                            <Link to={`/ciclos-de-auditoria/${year}/3`}>Item 3</Link>
                        </div> */}
                    </div>
                    <div className='auditoria__year__main__aside'>
                        <div className='auditoria__year__main__aside__graficas'>
                            {/* Gráfica 1 */}
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
                            {/* Gráfica 2 */}
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Year