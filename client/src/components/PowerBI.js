import React, { useEffect, useState } from 'react'
import { useParams, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Oval } from 'react-loader-spinner'
import IllustrationAccess from "../assets/img/access.png"
import "./PowerBI.scss"

function PowerBI() {
    const { area } = useParams()
    const [ data, setData ] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = localStorage.getItem("token")
        const jwtParse = jwtDecode(auth)
        console.log(jwtParse.apirest.objeto)

        const req = {
            user: jwtParse.apirest.objeto,
            area: parseInt(area)
        }

        const fetchData = async () => {
            try {
                const res = await fetch("http://164.92.77.143:3030/apis/bi",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(req)
                })
                const data = await res.json()
                console.log(data)
                setData(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
      }, [area])

    return (
        <>
            {loading ? (
                <div className='loading__powerbi d-flex flex-column align-items-center justify-content-center'>
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
                {data.status !== 0 ? (
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
                        src={data.objeto.BiArea} 
                        allowFullScreen={true}> 
                    </iframe>
                )}
                </>
            )}
        </>
    )
}

export default PowerBI