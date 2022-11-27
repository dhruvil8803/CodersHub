import {QUESTIONFAIL, 
    QUESTIONREQUEST,
     QUESTIONCLEARERROR, 
    QUESTIONSUCCESS} from "../Constants/Question";

 const Question = (state = {question: {}, loading : true}, action) => {
    switch (action.type) {
        case QUESTIONREQUEST:
          return {
            loading: true,
            question: {}
          };
        case QUESTIONSUCCESS:
          return {
            loading: false,
            question: action.payload.response,
          };
          case QUESTIONFAIL:
            return {
              loading: false,
              error: action.payload.error
            };
        case QUESTIONCLEARERROR:
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

export default Question;