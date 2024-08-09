import React, { useEffect, useState, useRef } from 'react'
import './Pasos.scss'

function Pasos({steps, currentStep}) {
    const [ newStep, setNewStep ] = useState([])
    const stepRef = useRef()
    const updateStep = (stepNumber, steps) => {
        const newSteps = [ ...steps]
        let count = 0
        while(count < newSteps.length){
            if(count === stepNumber){
                newSteps[count]={
                    ...newSteps[count],
                    highlighted: true,
                    selected: true,
                    completed: true
                }
                count++
            }
            else if(count < stepNumber){
                newSteps[count]={
                    ...newSteps[count],
                    highlighted: false,
                    selected: true,
                    completed: true
                }
                count++
            } else {
                newSteps[count]={
                    ...newSteps[count],
                    highlighted: false,
                    selected: false,
                    completed: false
                }
                count++
            }
        }
        return newSteps
    }
    useEffect(() => {
        const stepsState = steps.map((step, index) => 
            Object.assign(
                {}, 
                {
                    description: step,
                    completed: false,
                    highlighted: index === 0 ? true : false,
                    selected: index === 0 ? true : false
                }
            )
        )
        stepRef.current = stepsState
        const current = updateStep(currentStep -1, stepRef.current)
        setNewStep(current)
    }, [steps, currentStep])

    const displaySteps =  newStep.map((step, index) => {
        return (
            <div 
                key={index} 
                className={
                    index !== newStep.length - 1 
                    ? 'steps w-100 d-flex align-items-center' 
                    : 'steps d-flex align-items-center'}
            >
                <div className='steps__step d-flex flex-row align-items-center'>
                    <div className={
                        `steps__step__circle me-2 rounded-circle d-flex align-items-center justify-content-center 
                        ${step.selected ? "active" : ""}`}
                    >
                        {step.completed 
                            ? (<i className="bi bi-check2"></i>) 
                            : (index + 1)}
                    </div>
                    <div className={`steps__step__description top-0 text-center 
                        ${step.highlighted ? "fw-medium text-primary" : "text-muted fw-regular"}`}
                    >
                        {step.description}
                    </div>
                </div>
                <div className={`steps__line mx-2 flex-fill border-top ${step.completed ? "active": ""}`}></div>
            </div>
        )
    })

    return (
        <div className='d-flex align-items-center justify-content-between mb-4'>
            {displaySteps}
        </div>
    )
}

export default Pasos