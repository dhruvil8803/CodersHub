import {ADDQUESTIONFAIL, 
    ADDQUESTIONREQUEST,
     ADDQUESTIONCLEARERROR, 
    ADDQUESTIONSUCCESS} from "../Constants/AddQuestion";

 const AddQuestion = (state = {error: false}, action) => {
    switch (action.type) {
        case ADDQUESTIONREQUEST:
          return {
            loading: true,
          };
        case ADDQUESTIONSUCCESS:
          return {
            loading: false,
            success: true,
            message: action.payload,
          };
          case ADDQUESTIONFAIL:
            return {
              loading: false,
              success: false,
              error: true,
              message: action.payload,
            };
        case ADDQUESTIONCLEARERROR:
            return {
             ...state,
              loading: false,
              error: null,
              success: false
              
            };
        default:
            return {
                ...state
            };
    }
}

export default AddQuestion;