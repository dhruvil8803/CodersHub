import React from 'react'
import Author from "../Components/Author";
import ReactMarkdown from 'react-markdown'
import "./Styles/Answer.css"
export default function Answer(props) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div className="AnswerDetailed">

    <div className='Answer'>
      <div className="AnswerStats">
      <i className="fa-solid fa-caret-up fa-4x" title="Up vote"></i>
            <p>{props.response.votes}</p>
            <i className="fa-solid fa-caret-down fa-4x" title="Down vote"></i>
      </div>
      <div className='AnswerDetails'>
      <ReactMarkdown children={props.response.desc} className="ReactMarkDownStyle"/>
      </div>
    </div>
      <div className='AnswerAdded'>
         <Author id={props.response.by} width={20} type={"Answered"}/>
         <p>Answered on: <span>{`${new Date(props.response.date).getDate()}-${months[new Date(props.response.date).getMonth()]}-${new Date(props.response.date).getFullYear()}`}</span></p>
      </div>
    </div>
  )
}
