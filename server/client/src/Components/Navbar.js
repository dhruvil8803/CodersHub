import React, { useEffect } from 'react'
 import "./Styles/Navbar.css"
 import { useNavigate } from 'react-router-dom'
 import {AuthAction, clearerror} from "../Action/AuthAction"
 import {useSelector, useDispatch} from "react-redux"
export default function Navbar() {
  let dispatch = useDispatch();
  let {isAuth, data} = useSelector((state)=>state.auth);
  let navigate = useNavigate();
  let SignUp = () => {
    navigate("/SignUp");
  }
  let Login = ()=>{
    navigate("/Login")
  }
  let Logout = ()=>{
    dispatch(clearerror());
  }
  useEffect(()=>{
    dispatch(AuthAction());
  }, [dispatch]);
  return (
    <div className="Navbar">
      <h2><tt>
        CodersHub
        </tt>
        </h2>
      <div className='box'>
      {isAuth && <img src={data.response.avatar.url} alt="Profile Pic"/>}
      {!isAuth && <button onClick={Login}>Login</button>}
       {!isAuth && <button onClick={SignUp}>Signup</button>}
       {isAuth && <button onClick={Logout}>Logout</button>}
      </div>
    </div>
  )
}
