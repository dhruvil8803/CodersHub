import {ADDANSWERFAIL, 
    ADDANSWERREQUEST,
     ADDANSWERCLEARERROR, 
    ADDANSWERSUCCESS} from "../Constants/AddAnswer";

 const AddAnswer = (state = {}, action) => {
    switch (action.type) {
        case ADDANSWERREQUEST:
          return {
            loading: true,
          };
        case ADDANSWERSUCCESS:
          return {
            loading: false,
            success: true,
            message: action.payload,
          };
          case ADDANSWERFAIL:
            return {
              loading: false,
              success: false,
              error: true,
              message: action.payload,
            };
        case ADDANSWERCLEARERROR:
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

export default AddAnswer;