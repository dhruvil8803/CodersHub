import React, { useEffect, useState } from 'react'
import "../Components/Styles/Signup.css"
import image1 from "../image.webp"
import Spinner from './Spinner'
import { useDispatch, useSelector } from 'react-redux';
import {SignUpAction, clearerror} from "../Action/SignUpAction";
import {useAlert} from "react-alert";
import {useNavigate} from "react-router-dom"
import { AuthAction } from '../Action/AuthAction';

export default function SignUp() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let alert = useAlert();
  let {isAuth} = useSelector((state)=>state.auth);
  let {loading, success, message, error} = useSelector((state)=>state.signUp)
    let [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        avatar: "",
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
      navigate("/allQuestion")
    }
    if(isAuth){
      navigate("/allQuestion");
    }
    },[error, success, alert, dispatch, message, navigate, isAuth])
    let [image, setImage] = useState(image1);
    let changeForm = (e)=>{
        if(e.target.name === 'avatar'){
          let reader = new FileReader();
          reader.onload = ()=>{
           if(reader.readyState === 2){
             setData({...data, [e.target.name] : reader.result})
             setImage(reader.result);
           }
          }
          reader.readAsDataURL(e.target.files[0]);
        }
        else{
         setData({...data, [e.target.name]: e.target.value})
        }
       }
       let signUpUser = (e)=>{
        dispatch(SignUpAction(data));
       }
  return (
    <div className='Signup'>
      <div className="SignupDiv">
        <h1>Signup</h1>
        <label htmlFor="Name">Name</label>
        <input type="text" name="name" onChange={changeForm}/>
        <label htmlFor="Email">Email</label>
        <input type="email" name="email" onChange={changeForm}/>
        <label htmlFor="Password">Create Password</label>
        <input type="password" name="password" onChange={changeForm}/>
        <label htmlFor="Avatar">Choose Avatar</label>
        <div className='SignupDivBox'>
        <img src={image} alt="" />
        <input type="file" name="avatar" onChange={changeForm} />
        </div>
        {loading && <Spinner />}
        <button onClick={signUpUser}>Signup</button>

      </div>
    </div>
  )
}
