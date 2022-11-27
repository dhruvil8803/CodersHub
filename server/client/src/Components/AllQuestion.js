import React, { useEffect , useState} from 'react'
import SideNavbar from './SideNavbar'
import "./Styles/AllQuestion.css"
import {AllQuestionAction} from '../Action/AllQuestionAction';
import { useDispatch, useSelector } from 'react-redux';
import Author from "./Author"
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
export default function AllQuestion() {
  let navigate = useNavigate();
  let dispatch = useDispatch();
  useEffect(()=>{
  dispatch(AllQuestionAction({sort : {
    date: -1
  }}));
  }, [dispatch])
  let [search, setSearch] = useState("");
  let {loading,question} = useSelector((state)=>state.allQuestion);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let newest = ()=>{
    dispatch(AllQuestionAction({sort : {
      date: -1
    }}));
  }
  let oldest = ()=>{
    dispatch(AllQuestionAction({sort: {
      date: 1
    }}))
  }
  let voted = ()=>{
    dispatch(AllQuestionAction({sort: {
      votes: -1
    }}))
  }
  let change = (e)=>{
    setSearch(e.target.value);
  }
  let searchQuestion = ()=>{
    dispatch(AllQuestionAction({
      keyword: {
        title: search
      },
      sort: {
        date: -1
      }
    }))
  }
  return (
    <div className='allquestion'>
      <SideNavbar />
      <div className='shortquestion'>
        <div className='shortquestionheader'>
            <div className='shortquestionheadertitle'>
            <h1>All Quesitons</h1> 
            <button onClick={()=>navigate("/addQuestion")}>Add Question</button>
            </div>
            <div className='shortquestionheaderfilter'> 
            <div className='shortquestionheadersearch'>
            <input type="text" placeholder='Search' onChange={change} value={search}/>
            <button onClick={searchQuestion}>Search</button>
            </div>
            <ul className='shortquestionheaderbuttons'>
             <li onClick={newest}>Newest</li>
             <li onClick={oldest}>Oldest</li>
             <li onClick={voted}>Most voted</li>
            </ul>
            </div>
        </div>
        {loading && <Spinner />}
        {!loading &&
        question.map((e)=>{
           return <div key={e._id} className='shortquestiondetail'>
           <div className='shortquestionstats'>
            <h3>{e.votes} Votes</h3>
            <h3>{e.answers} Answers</h3>
            <h3>{e.views} Views</h3>
           </div>
           <div className='shortquestiondesc'>
            <h1 onClick={()=>navigate(`/Question/${e._id}`)}>{e.title}</h1>
            <p>{e.desc.length > 200 ? `${e.desc.slice(0, 200)}....` : e.desc}</p>
            <ul>{
            e.tags.map((x)=>{
              return <li>{x}</li>
             })}
            </ul>
            <div className='shortquestiondata'>
               <Author id={e.by} width={30} type={"Asked"}/>
               <p className='paragraph'>Asked On: <span style={{color: "#8be9fd", fontSize: "1.4rem"}}>{`${new Date(e.date).getDate()}-${months[new Date(e.date).getMonth()]}-${new Date(e.date).getFullYear()}`}</span></p>
            </div>
           </div>
       </div>
        })
      }

      </div>
    </div>
  )
}
