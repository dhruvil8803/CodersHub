import React, { useEffect, useState } from 'react'
import axios from 'axios'
import image from "../image.webp"
import "../Components/Styles/Author.css"
export default function Name(params) { 
   let [stats, setStats] = useState({
    gold: 0,
    silver: 0,
    bronze: 0
   })
   let [response, setResponse] = useState(null);
   let fetchdata = async ()=>{
    let {data} = await axios.get(`/api/Users/showUser/${params.id}`);
    setResponse(data.response);
    setStats({gold: Math.floor(data.response.reputation / 1000)
    ,silver: Math.floor((data.response.reputation - Math.floor(data.response.reputation / 1000) * 1000) / 100),
     bronze : Math.floor((data.response.reputation -
      Math.floor((data.response.reputation - Math.floor(data.response.reputation / 1000) * 1000) / 100) * 100 -
      Math.floor(data.response.reputation / 1000) * 1000) / 5)})
   }
    useEffect(()=>{
    fetchdata();
     // eslint-disable-next-line
    }, []);
  return (
    response != null &&
    <div className='Author' style={{width: `${params.width}%`}}>
      <p>{params.type} By:</p>
       <div className='AuthImage'>
       <img src={response.avatar.url} alt={image}/>
        <div className='AuthData'>
          <div className='AuthName'>{response.name}</div>
          <div className='AuthState'>
            <strong>{response.reputation}</strong>
            <span>🥇{stats.gold}</span>
            <span>🥈{stats.silver}</span>
            <span>🥉{stats.bronze}</span>
          </div>
          </div>
       </div>
    </div>
  )
}
