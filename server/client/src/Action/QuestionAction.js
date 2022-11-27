import axios from "axios";
import {QUESTIONFAIL, 
    QUESTIONREQUEST,
     QUESTIONCLEARERROR, 
    QUESTIONSUCCESS} from "../Constants/Question";
const QuestionAction = (query)=> async(dispatch)=> {
     try {
         dispatch({type: QUESTIONREQUEST});
         let {data} = await axios.get(`/api/Questions/showQuestion/${query}`);
         dispatch({type: QUESTIONSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: QUESTIONFAIL,
            payload: error
        })
     }
}
const clearerror = ()=> (dispatch)=>{
    dispatch({
        type: QUESTIONCLEARERROR
    })
}
export {QuestionAction, clearerror};