import {ADDTAGFAIL, 
    ADDTAGREQUEST,
     ADDTAGCLEARERROR, 
    ADDTAGSUCCESS} from "../Constants/AddTag";

 const AddTag = (state = {}, action) => {
    switch (action.type) {
        case ADDTAGREQUEST:
          return {
            loading: true,
          };
        case ADDTAGSUCCESS:
          return {
            loading: false,
            success: true,
            message: action.payload,
          };
          case ADDTAGFAIL:
            return {
              loading: false,
              success: false,
              error: true,
              message: action.payload,
            };
        case ADDTAGCLEARERROR:
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

export default AddTag;