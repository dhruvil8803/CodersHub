import React,{useState, useEffect} from 'react'
import SideNavbar from './SideNavbar'
import "../Components/Styles/AddAnswer.css";
import ReactMarkdown from "react-markdown";
import "../Components/Styles/ReactMarkDownStyle.css"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {AddAnswerAction, clearerror} from "../Action/AddAnswerAction";
import {useAlert} from "react-alert";
export default function AddAnswer() {
    let {id} = useParams();
    let navigate = useNavigate();
    let alert = useAlert();
    let dispatch = useDispatch();
    let [data, setData] = useState((localStorage.getItem("Answer") ? localStorage.getItem("Answer") : ""));
    let makeChange  = (e)=>{
        setData(e.target.value);
        localStorage.setItem("Answer", e.target.value);
    }
    let {loading, success, message, error} = useSelector((state)=>state.addAnswer);
    let {isAuth} = useSelector((state)=>state.auth);
    let loadingAuth = useSelector((state)=>state.auth).loading;
    let addAnswer = ()=>{
        dispatch(AddAnswerAction({desc: data}, id));
    }
    useEffect(()=>{
        if(error){
          alert.error(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
          dispatch(clearerror());
        }
        if(success){
          alert.success(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
          dispatch(clearerror());
          navigate(`/Question/${id}`)
        }
        if(!loadingAuth && !isAuth){
          alert.error(<div style={{ fontSize: "1.3rem" }}>Login Or SignUp First to Add Answer</div>);
          navigate("/allQuestion");
        }
        },[error, success, alert, dispatch, message, navigate, isAuth, loadingAuth, id])
  return (
    <div className='AddAnswer'>
      <SideNavbar />
     <div className='AddAnswerDetail'>
      <div className="AddAnswerMarkDown">
        <h1>What is the detail of your Answer?</h1>
         <p>Introduce the answer and expand on what you put in the Answer name. Minimum 25 characters. Markdown also works in the TextArea to know more about it.  <a href="https://www.markdownguide.org/basic-syntax" style={{color: "#8be9fd", fontSize: "1.5rem"}}>Click Here</a></p>
        <textarea rows="15" value={data} onChange={makeChange} placeholder="Detailed explanation of your Answer"></textarea>
      </div>

      <div className="AddAnswerReview">
         <h1>
            Review
         </h1>
         <p>The Descreption of your answer will look like this when posted.</p>
        <ReactMarkdown children={data ? data: "Enter some data in TextArea to preview"} className="ReactMarkDownStyle"/>
      </div>
      <button disabled={loading} onClick={addAnswer}>Add Answer</button>
     </div>
    </div>
  )
}
