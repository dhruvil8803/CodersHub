import React,{useState, useEffect} from 'react'
import SideNavbar from './SideNavbar'
import "../Components/Styles/AddTag.css";
import ReactMarkdown from "react-markdown";
import "../Components/Styles/ReactMarkDownStyle.css"
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {AddTagAction, clearerror} from "../Action/AddTagAction";
import {useAlert} from "react-alert";
export default function AddTag() {
    let navigate = useNavigate();
    let alert = useAlert();
    let dispatch = useDispatch();
    let [data, setData] = useState((localStorage.getItem("Tag") ? localStorage.getItem("Tag") : ""));
    let makeChange  = (e)=>{
        setData(e.target.value);
        localStorage.setItem("Tag", e.target.value);
    }
    let {loading, success, message, error} = useSelector((state)=>state.addTag);
    let {isAuth} = useSelector((state)=>state.auth);
    let loadingAuth = useSelector((state)=>state.auth).loading;
    let [title, setTitle] = useState("");
    let changeTitle = (e)=>{
          setTitle(e.target.value);
    }
    let addTag = ()=>{
        dispatch(AddTagAction({title, desc: data}));
    }
    useEffect(()=>{
        if(error){
          alert.error(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
          dispatch(clearerror());
        }
        if(success){
          alert.success(<div style={{fontSize: "1.3rem"}}>{message.message}</div>);
          dispatch(clearerror());
          navigate("/allTag")
        }
        if(!loadingAuth && !isAuth){
          alert.error(<div style={{ fontSize: "1.3rem" }}>Login Or SignUp First to Add Tag</div>);
          navigate("/allQuestion");
        }
        },[error, success, alert, dispatch, message, navigate, isAuth, loadingAuth])
  return (
    <div className='AddTag'>
      <SideNavbar />
     <div className='AddTagDetail'>
      <div className="AddTagTitle">
        <h1>Name</h1>
        <p>
        Enter name of your tag between 2 to 30 characters.
        </p>
        <input type="text" placeholder='Your Tag Name' name="title" onChange={changeTitle}/>
      </div>

      <div className="AddTagMarkDown">
        <h1>What are the details of your Tag?</h1>
         <p>Introduce the tag and expand on what you put in the Tag name. Minimum 25 characters. Markdown also works in the TextArea to know more about it.  <a href="https://www.markdownguide.org/basic-syntax" style={{color: "#8be9fd", fontSize: "1.5rem"}}>Click Here</a></p>
        <textarea rows="15" value={data} onChange={makeChange} placeholder="Detailed explanation of your Tag"></textarea>
      </div>

      <div className="AddTagReview">
         <h1>
            Review
         </h1>
         <p>The Descreption of your tag will look like this when posted.</p>
        <ReactMarkdown children={data ? data: "Enter some data in TextArea to preview"} className="ReactMarkDownStyle"/>
      </div>
      <button disabled={loading} onClick={addTag}>Add Tag</button>
     </div>
    </div>
  )
}
