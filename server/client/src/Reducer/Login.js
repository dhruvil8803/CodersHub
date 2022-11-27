import {LOGINFAIL, 
    LOGINREQUEST,
     LOGINCLEARERROR, 
    LOGINSUCCESS} from "../Constants/Login";

 const Login = (state = {}, action) => {
    switch (action.type) {
        case LOGINREQUEST:
          return {
            loading: true,
          };
        case LOGINSUCCESS:
          return {
            loading: false,
            success: true,
            message: action.payload,
          };
          case LOGINFAIL:
            return {
              loading: false,
              success: false,
              error: true,
              message: action.payload,
            };
        case LOGINCLEARERROR:
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

export default Login;