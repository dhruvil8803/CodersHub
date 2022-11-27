import axios from "axios";
import {ADDQUESTIONFAIL, 
    ADDQUESTIONREQUEST,
     ADDQUESTIONCLEARERROR, 
    ADDQUESTIONSUCCESS} from "../Constants/AddQuestion";
const AddQuestionAction = (formData)=> async(dispatch)=> {
     try {
         dispatch({type: ADDQUESTIONREQUEST});
         let {data} = await axios.post("api/Questions/addQuestion", formData);
         dispatch({type: ADDQUESTIONSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ADDQUESTIONFAIL,
            payload: error.response.data
        })
     }
}
const clearerrorAddQuestion = ()=>(dispatch)=>{
    dispatch({type: ADDQUESTIONCLEARERROR});
}
export  {AddQuestionAction, clearerrorAddQuestion};