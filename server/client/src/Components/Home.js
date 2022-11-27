import React from 'react'
import "../Components/Styles/Home.css";
import {useNavigate} from "react-router-dom";
export default function Home() {
    let navigate = useNavigate();
  return (
    <div className='Home'>
      <div className='HomeDetail'>
        <h1>Welcome to CodersHub </h1>
        <p>A public platform building the definitive collection of coding questions & answers</p>
        <button onClick={()=>navigate("/allQuestion")}>Get Started</button>
      </div>
    </div>
  )
}
