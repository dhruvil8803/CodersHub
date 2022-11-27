import axios from "axios";
import {SIGNUPFAIL, 
    SIGNUPREQUEST,
     SIGNUPCLEARERROR, 
    SIGNUPSUCCESS} from "../Constants/Signup";
const SignUpAction = (formData)=> async(dispatch)=> {
     try {
         dispatch({type: SIGNUPREQUEST});
         let {data} = await axios.post("api/Users/registerUser", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
         dispatch({type: SIGNUPSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: SIGNUPFAIL,
            payload: error.response.data
        })
     }
}
const clearerror = ()=>(dispatch)=>{
    dispatch({type: SIGNUPCLEARERROR});
}
export  {SignUpAction, clearerror};