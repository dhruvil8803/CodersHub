import React from 'react'
import "./Styles/SideNavbar.css";
import { useNavigate } from 'react-router-dom';
export default function SideNavbar() {
  let navigate = useNavigate();
   let change = (e)=>{
    if(e.target.checked) {
      document.getElementsByClassName("list")[0].style.cssText = "transform: translateY(0%); opacity: 1;";
      document.getElementById("line1").style.cssText = "transform: rotate(405deg); transform-origin: 0 0;"
      document.getElementById("line3").style.cssText = "transform: rotate(-405deg); transform-origin: 0 0;"
      document.getElementById("line2").style.cssText = "transform : translateX(-100%); opacity: 0"
    }
    else {
      document.getElementsByClassName("list")[0].style.cssText = "transform: translateY(-200%); opacity: 0;";
      document.getElementById("line1").style.cssText = "transform: rotate(0); transform-origin: 0 0;"
      document.getElementById("line3").style.cssText = "transform: rotate(0); transform-origin: 0 0;"
      document.getElementById("line2").style.cssText = "transform : translateX(0); opacity: 1"
   }
  }
  return (
    <div className='SideNavbar'>
      <div className='nav'>
        <div className='spanItem'>
         <span id="line1"></span>
         <span id="line2"></span>
         <span id="line3"></span>
        </div>
        <input type="checkbox" id="checkbox" onChange={change}/>
      </div>
    <ul className='list'>
       <li onClick={()=>navigate("/allQuestion")}>Question</li>
       {/* <li onClick={()=>navigate("/allBlog")}>Blogs</li> */}
       <li onClick={()=>navigate("/allTag")}>Tags</li>
       {/* <li onClick={()=>navigate("/allUser")}>Users</li> */}
       <li onClick={()=>navigate("/addQuestion")}>Add Question</li>
       <li onClick={()=>navigate("/addTag")}>Add Tag</li>
    </ul>
    </div>
  )
 
}
