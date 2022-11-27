import React, { useEffect} from 'react'
import SideNavbar from './SideNavbar'
import "./Styles/Question.css"
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch , useSelector} from 'react-redux';
import { QuestionAction } from '../Action/QuestionAction';
import {AllAnswerAction} from "../Action/AllAnswerAction";
import Author from "../Components/Author";
import Spinner from './Spinner';
import Answer from './Answer';
export default function Question() {
  let navigate = useNavigate();
  let dispatch = useDispatch(); 
  let {id} = useParams();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  useEffect(()=>{
    dispatch(QuestionAction(id));
    dispatch(AllAnswerAction({
      category: {
        question: id
      }
    }));

  }, [dispatch, id]);
  let {question, loading} = useSelector((state)=>state.question);
  let {answer} = useSelector((state)=>state.allAnswer);
  let loadingAnswer = useSelector((state)=>state.allAnswer).loading;
  let newest = ()=>{
    dispatch(AllAnswerAction({sort : {
      date: -1
    },
    category: {
      question: id
    }
  }));
  }
  let oldest = ()=>{
    dispatch(AllAnswerAction({sort : {
      date: 1
    },
    category: {
      question: id
    }
  }));
  }
  let voted = ()=>{
    dispatch(AllAnswerAction({sort: {
      votes: -1
    },
    category: {
      question: id
    }}))
  }
  return (
    <div className='Question'>
        <SideNavbar />
        {loading && <Spinner/>}
        {!loading &&
        <div className="QuestionDetail">
        <div className="QuestionHeader">
            <h1>
            {question.title}</h1>
        </div>
        <div className="QuestionState">
            <p>Added: <span>{`${new Date(question.date).getDate()}-${months[new Date(question.date).getMonth()]}-${new Date(question.date).getFullYear()}`}</span></p>
            <p>Modified: <span>{`${new Date(question.modified).getDate()}-${months[new Date(question.modified).getMonth()]}-${new Date(question.modified).getFullYear()}`}</span></p>
            <p>Visits: <span>{question.views}</span></p>
        </div>
        <hr />
        <div className="QuestionData">
            <div className="QuestionVote">
            <i className="fa-solid fa-caret-up fa-4x" title="Up vote"></i>
            <p>{question.votes}</p>
            <i className="fa-solid fa-caret-down fa-4x" title="Down vote"></i>
            
            </div>
            <div className="QuestionContent">
              <ReactMarkdown children={question.desc} className="ReactMarkDownStyle"/>
                <ul className='tags'>
                 {question.tags.map((x)=>{
                  return <li>{x}</li>
                 })
                 }
                </ul>
                <div className="QuestionAuthor">
                   <Author id={question.by} width={100} type={"Asked"}/>
                </div>
            </div>
        </div>
        <hr />
{/* +++++++++++++++++++++++++++++Answer Header #################################################### */}
    <div className='shortanswerheader'>
            <div className='shortanswerheadertitle'>
            <h1>{question.answers} Answers</h1> 
            <button onClick={()=>navigate(`/addAnswer/${id}`)}>Add answer</button>
            </div>
            <div className='shortanswerheaderfilter'> 
            <ul className='shortanswerheaderbuttons'>
             <li onClick={newest}>Newest</li>
             <li onClick={oldest}>Oldest</li>
             <li onClick={voted}>Most voted</li>
            </ul>
            </div>
        </div>
       {
        loadingAnswer && <Spinner />
       }
      {
        !loadingAnswer && answer.map((e)=>{
          return <Answer response={e}/>
        })
      }

      {
        answer.length === 0 && <h1 className='NoAnswer'>No Answers to this Question</h1>
      }





    </div>
}
    </div>
  )
}
