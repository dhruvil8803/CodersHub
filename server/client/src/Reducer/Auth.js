import {AUTHFAIL, 
    AUTHREQUEST,
     AUTHCLEARERROR, 
    AUTHSUCCESS} from "../Constants/Auth";

 const Auth = (state = {loading: true}, action) => {
    switch (action.type) {
        case AUTHREQUEST:
          return {
            loading: true,
          };
        case AUTHSUCCESS:
          return {
            loading: false,
            isAuth: true,
            data: action.payload,
          };
          case AUTHFAIL:
            return {
              loading: false,
              isAuth: false,
              data: action.payload,
            };
        case AUTHCLEARERROR:
            return {
              loading: false,
              isAuth: false,
              data: null
            };
        default:
            return {
                ...state
            };
    }
}

export default Auth;