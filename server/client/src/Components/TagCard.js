import React from 'react'
import "../Components/Styles/TagCard.css"
export default function TagCard(props) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <div className='TagCard'>
      <h1>
        {props.name}
      </h1>
      <p>
      {props.desc.length > 100 ? `${props.desc.slice(0, 100)}....` : props.desc}
        </p>
      <p>Added on: <span>{`${new Date(props.date).getDate()}-${months[new Date(props.date).getMonth()]}-${new Date(props.date).getFullYear()}`}</span></p>
    </div>
  )
}
