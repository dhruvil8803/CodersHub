import axios from "axios";
import {AUTHFAIL, 
    AUTHREQUEST,
     AUTHCLEARERROR, 
    AUTHSUCCESS} from "../Constants/Auth";

const AuthAction = ()=> async(dispatch)=> {
     try {
         dispatch({type: AUTHREQUEST});
         let {data} = await axios.get("/api/Users/getUser");
         dispatch({type: AUTHSUCCESS, 
        payload : data});
     } catch (error) {
        console.log(error);
        dispatch({
            type: AUTHFAIL,
            payload: error.response.data
        })
     }
}
const clearerror = ()=>async (dispatch)=>{
    await axios.get("/api/Users/logoutUser");
    dispatch({type: AUTHCLEARERROR});
}
export  {AuthAction, clearerror};