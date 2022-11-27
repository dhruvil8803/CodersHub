import {ALLQUESTIONFAIL, 
    ALLQUESTIONREQUEST,
     ALLQUESTIONCLEARERROR, 
    ALLQUESTIONSUCCESS} from "../Constants/AllQuestion";

 const AllQuestion = (state = {question: []}, action) => {
    switch (action.type) {
        case ALLQUESTIONREQUEST:
          return {
            loading: true,
            question: []
          };
        case ALLQUESTIONSUCCESS:
          return {
            loading: false,
            question: action.payload.response,
          };
          case ALLQUESTIONFAIL:
            return {
              loading: false,
              error: action.payload.error
            };
        case ALLQUESTIONCLEARERROR:
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

export default AllQuestion;