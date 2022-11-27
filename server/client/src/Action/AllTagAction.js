import axios from "axios";
import {ALLTAGFAIL, 
    ALLTAGREQUEST,
     ALLTAGCLEARERROR, 
    ALLTAGSUCCESS} from "../Constants/AllTag";
const AllTagAction = (query)=> async(dispatch)=> {
     try {
         dispatch({type: ALLTAGREQUEST});
         let {data} = await axios.get("/api/Tags/showAllTags", {
            params : query
         });
         dispatch({type: ALLTAGSUCCESS, 
        payload : data});
     } catch (error) {
        dispatch({
            type: ALLTAGFAIL,
            payload: error
        })
     }
}
const clearerror = ()=> (dispatch)=>{
    dispatch({
        type: ALLTAGCLEARERROR
    })
}
export {AllTagAction, clearerror};