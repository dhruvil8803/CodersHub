import {ALLTAGFAIL, 
    ALLTAGREQUEST,
     ALLTAGCLEARERROR, 
    ALLTAGSUCCESS} from "../Constants/AllTag";

 const AllTag = (state = {tag: []}, action) => {
    switch (action.type) {
        case ALLTAGREQUEST:
          return {
            loading: true,
            tag: []
          };
        case ALLTAGSUCCESS:
          return {
            loading: false,
            tag: action.payload.response,
          };
          case ALLTAGFAIL:
            return {
              loading: false,
              error: action.payload.error
            };
        case ALLTAGCLEARERROR:
            return {
               tag: [],
              loading: false,
              error: null
            };
        default:
            return {
                ...state
            };
    }
}

export default AllTag;