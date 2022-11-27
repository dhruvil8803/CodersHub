import {SIGNUPFAIL, 
    SIGNUPREQUEST,
     SIGNUPCLEARERROR, 
    SIGNUPSUCCESS} from "../Constants/Signup";

 const SignUp = (state = {}, action) => {
    switch (action.type) {
        case SIGNUPREQUEST:
          return {
            loading: true,
          };
        case SIGNUPSUCCESS:
          return {
            loading: false,
            success: true,
            message: action.payload,
          };
          case SIGNUPFAIL:
            return {
              loading: false,
              success: false,
              error: true,
              message: action.payload,
            };
        case SIGNUPCLEARERROR:
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

export default SignUp;