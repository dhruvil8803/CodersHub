import axios from "axios";
import {ALLQUESTIONFAIL, 
    ALLQUESTIONREQUEST,
     ALLQUESTIONCLEARERROR, 
    ALLQUESTIONSUCCESS} from "../Constants/AllQuestion";
const AllQuestionAction = (query)=> async(dispatch)=> {
     try {
         dispatch({type: ALLQUESTIONREQUEST});
         let {data} = await axios.get("/api/Questions/showAllQuestions", {
            params : query
         });
         dispatch({type: ALLQUESTIONSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ALLQUESTIONFAIL,
            payload: error
        })
     }
}
const clearerror = ()=> (dispatch)=>{
    dispatch({
        type: ALLQUESTIONCLEARERROR
    })
}
export {AllQuestionAction, clearerror};