import axios from "axios";
import {LOGINFAIL, 
    LOGINREQUEST,
     LOGINCLEARERROR, 
    LOGINSUCCESS} from "../Constants/Login";
const LoginAction = (formData)=> async(dispatch)=> {
     try {
         dispatch({type: LOGINREQUEST});
         let {data} = await axios.post("api/Users/loginUser", formData);
         dispatch({type: LOGINSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: LOGINFAIL,
            payload: error.response.data
        })
     }
}
const clearerror = ()=>(dispatch)=>{
    dispatch({type: LOGINCLEARERROR});
}
export  {LoginAction, clearerror};