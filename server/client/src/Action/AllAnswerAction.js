import axios from "axios";
import {ALLANSWERFAIL, 
    ALLANSWERREQUEST,
     ALLANSWERCLEARERROR, 
    ALLANSWERSUCCESS} from "../Constants/AllAnswer";
const AllAnswerAction = (query)=> async(dispatch)=> {
     try {
         dispatch({type: ALLANSWERREQUEST});
         let {data} = await axios.get(`/api/Answers/showAllAnswers`, {
            params : query
         });
         dispatch({type: ALLANSWERSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ALLANSWERFAIL,
            payload: error
        })
     }
}
const clearerror = ()=> (dispatch)=>{
    dispatch({
        type: ALLANSWERCLEARERROR
    })
}
export {AllAnswerAction, clearerror};