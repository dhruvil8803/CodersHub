import React, { useEffect , useState} from 'react'
import SideNavbar from './SideNavbar'
import "./Styles/AllTag.css"
import {AllTagAction} from '../Action/AllTagAction';
import { useDispatch, useSelector } from 'react-redux';
import TagCard from './TagCard';
import Spinner from "./Spinner"
export default function AllTag() {
  let dispatch = useDispatch();
  useEffect(()=>{
  dispatch(AllTagAction({sort : {
    date: -1
  }}));
  }, [dispatch])
  let [search, setSearch] = useState("");
  let {loading,tag} = useSelector((state)=>state.allTag);
    let newest = ()=>{
    dispatch(AllTagAction({sort : {
      date: -1
    }}));
  }
  let oldest = ()=>{
    dispatch(AllTagAction({sort: {
      date: 1
    }}))
  }
  let voted = ()=>{
    dispatch(AllTagAction({sort: {
      title: 1
    }}))
  }
  let change = (e)=>{
    setSearch(e.target.value);
  }
  let searchTag = ()=>{
    dispatch(AllTagAction({
      keyword: {
        title: search
      },
      sort: {
        date: -1
      }
    }))
  }
  return (
    <div className='alltag'>
      <SideNavbar />
      <div className='shorttag'>
        <div className='shorttagheader'>
            <div className='shorttagheadertitle'>
            <h1>All Tags</h1> 
            <button>Add Tag</button>
            </div>
            <div className='shorttagheaderfilter'> 
            <div className='shorttagheadersearch'>
            <input type="text" placeholder='Search' onChange={change} value={search}/>
            <button onClick={searchTag}>Search</button>
            </div>
            <ul className='shorttagheaderbuttons'>
             <li onClick={newest}>Newest</li>
             <li onClick={oldest}>Oldest</li>
             <li onClick={voted}>A to Z</li>
            </ul>
            </div>
        </div>
        <div className="shorttagdetail">
            {loading && <Spinner />}
            {!loading && 
                tag.map((e)=>{
                  return <TagCard key={e._id} name={e.title} desc={e.desc} date={e.date}/>
                })
            }
        </div>
      </div>
    </div>
  )
}
