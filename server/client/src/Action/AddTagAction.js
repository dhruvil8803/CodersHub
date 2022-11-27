import axios from "axios";
import {ADDTAGFAIL, 
    ADDTAGREQUEST,
     ADDTAGCLEARERROR, 
    ADDTAGSUCCESS} from "../Constants/AddTag";
const AddTagAction = (formData)=> async(dispatch)=> {
     try {
         dispatch({type: ADDTAGREQUEST});
         let {data} = await axios.post("api/Tags/addTag", formData);
         dispatch({type: ADDTAGSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ADDTAGFAIL,
            payload: error.response.data
        })
     }
}
const clearerror = ()=>(dispatch)=>{
    dispatch({type: ADDTAGCLEARERROR});
}
export  {AddTagAction, clearerror};