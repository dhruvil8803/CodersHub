import React, { useEffect, useState } from 'react'
import "../Components/Styles/Login.css"
import Spinner from './Spinner'
import { useDispatch, useSelector } from 'react-redux';
import {LoginAction, clearerror} from "../Action/LoginAction";
import { AuthAction } from '../Action/AuthAction';
import {useAlert} from "react-alert";
import {useNavigate} from "react-router-dom"
export default function Login() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let alert = useAlert();
  let {loading, success, message, error} = useSelector((state)=>state.login);
  let {isAuth} = useSelector((state)=>state.auth);
  let [data, setData] = useState({
    email: "",
    password : ""
  });
  useEffect(()=>{
    if(error){
      alert.error(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
      dispatch(clearerror());
    }
    if(success){
      alert.success(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
      dispatch(clearerror());
      dispatch(AuthAction());
      navigate("/allQuestion");
    }
    if(isAuth){
      navigate("/allQuestion");
    }
  }, [alert, dispatch, error, success, message, navigate, isAuth])
  let changeForm = (e)=>{
    setData({...data, [e.target.name]: e.target.value})
  }
  let loginUser = ()=>{
    dispatch(LoginAction(data));
  }
  return (
    <div className='Login'>
      <div className="LoginDiv">
        <h1>Login</h1>
        <label htmlFor="Email">Email</label>
        <input type="email" name="email" onChange={changeForm}/>
        <label htmlFor="Password">Password</label>
        <input type="password" name="password" onChange={changeForm}/>
        <p>Forget Password?</p>
        {loading && <Spinner />}
        <button onClick={loginUser}>Login</button>
      </div>
    </div>
  )
}
