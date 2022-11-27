import {ALLANSWERFAIL, 
    ALLANSWERREQUEST,
     ALLANSWERCLEARERROR, 
    ALLANSWERSUCCESS} from "../Constants/AllAnswer";

 const AllAnswer = (state = {answer: []}, action) => {
    switch (action.type) {
        case ALLANSWERREQUEST:
          return {
            loading: true,
            answer: []
          };
        case ALLANSWERSUCCESS:
          return {
            loading: false,
            answer: action.payload.response,
          };
          case ALLANSWERFAIL:
            return {
              loading: false,
              error: action.payload.error
            };
        case ALLANSWERCLEARERROR:
            return {
             ...state,
              loading: false,
              error: null
            };
        default:
            return {
                ...state
            };
    }
}

export default AllAnswer;