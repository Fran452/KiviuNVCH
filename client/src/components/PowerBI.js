import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import IllustrationAccess from "../assets/img/access.png"
import "./PowerBI.scss"

function PowerBI() {
    const { area } = useParams()
    const [ data, setData ] = useState("")

    useEffect(() => {
        const auth = localStorage.getItem("token")
        const jwtParse = jwtDecode(auth)

        const req = {
            user: jwtParse.apirest.objeto,
            area: parseInt(area)
        }

        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3030/apis/bi",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req)
                })
                const data = await res.json()
                setData(data.objeto)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
      }, [area])

    return (
        <>
            {data.BiArea === "" ? (
                <div className='no__access d-flex flex-column align-items-center justify-content-center'>
                    <img className='mb-4' src={IllustrationAccess} alt="" />
                    <h2 className='fw-semibold mb-2'>Oops!</h2>
                    <p>{data.codeError}</p>
                    <Link className='btn shadow-sm fw-medium' to={"/home"}>Home</Link>
                </div>
                
            ): (
                <iframe 
                    className="w-100 h-100 border-0" 
                    title="TABLERO-GLOBAL_HITSS (2)" 
                    src={data.BiArea} 
                    allowFullScreen={true}> 
                </iframe>
            )}
        </>
    )
}

export default PowerBI