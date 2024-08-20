import React, { useEffect, useState, useRef } from 'react'

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
                    ? 'steps w-100 d-flex flex-column flex-md-row align-items-center' 
                    : 'steps d-flex flex-column flex-md-row align-items-center'}
            >
                <div className='steps__step d-flex flex-row align-items-center'>
                    <div className={
                        `d-none d-md-flex steps__step__circle me-2 rounded-circle align-items-center justify-content-center 
                        ${step.selected ? "active" : ""}`}
                    >
                        {step.completed 
                            ? (<i className="bi bi-check2"></i>) 
                            : (index + 1)}
                    </div>
                    <div className={`steps__step__description top-0 text-center d-flex flex-row flex-md-column 
                        ${step.highlighted ? "fw-medium text-primary" : "d-none d-md-block text-muted fw-regular"}`}
                    >
                        {step.highlighted ? (
                            <div className='d-flex d-md-none steps__step__circle active me-2 rounded-circle align-items-center justify-content-center'>
                                <i className="bi bi-check2"></i>
                            </div>
                            ): <></>}
                        {step.description}
                    </div>
                </div>
                <div className={`steps__line mx-2 flex-fill border-top d-none d-md-block ${step.completed ? "active": ""}`}></div>
            </div>
        )
    })

    return (
        <div className='steps__container mb-4'>
            <div className='steps__container__main mx-auto d-flex flex-column flex-md-row align-items-center justify-content-between'>
                {displaySteps}
            </div>
        </div>
    )
}

export default Pasos