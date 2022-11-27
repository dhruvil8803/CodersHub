import axios from "axios";
import {ADDANSWERFAIL, 
    ADDANSWERREQUEST,
     ADDANSWERCLEARERROR, 
    ADDANSWERSUCCESS} from "../Constants/AddAnswer";
const AddAnswerAction = (formData, id)=> async(dispatch)=> {
     try {
         dispatch({type: ADDANSWERREQUEST});
         let {data} = await axios.post(`/api/Answers/addAnswer/${id}`, formData);
         dispatch({type: ADDANSWERSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ADDANSWERFAIL,
            payload: error.response.data
        })
     }
}
const clearerror = ()=>(dispatch)=>{
    dispatch({type: ADDANSWERCLEARERROR});
}
export  {AddAnswerAction, clearerror};