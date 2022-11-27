import React, { useEffect, useState } from "react";
import SideNavbar from "./SideNavbar";
import "../Components/Styles/AddQuestion.css";
import ReactMarkdown from "react-markdown";
import "../Components/Styles/ReactMarkDownStyle.css";
import { AllTagAction, clearerror } from "../Action/AllTagAction";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Components/Spinner";
import { useAlert } from "react-alert";
import {
  AddQuestionAction,
  clearerrorAddQuestion,
} from "../Action/AddQuestionAction";
import { useNavigate } from "react-router-dom";
export default function AddQuestion() {
  let navigate = useNavigate();
  let { success, message, error } = useSelector((state) => state.addQuestion);
  let { isAuth } = useSelector((state) => state.auth);
  let authLoading = useSelector((state) => state.auth).loading;
  let addLoading = useSelector((state) => state.addQuestion).loading;

  let alert = useAlert();
  let { loading, tag } = useSelector((state) => state.allTag);
  let dispatch = useDispatch();
  let [tagChoose, settagChoose] = useState([]);
  let [data, setData] = useState({
    desc: localStorage.getItem("Question")
      ? localStorage.getItem("Question")
      : "",
    title: "",
  });
  let [tags, setTags] = useState([]);
  let [tagId, settagId] = useState([]);
  let makeChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    localStorage.setItem("Question", e.target.value);
  };
  useEffect(() => {
    if (error) {
      console.log("Entered");
      alert.error(<div style={{ fontSize: "1.3rem" }}>{message.message}</div>);
      dispatch(clearerrorAddQuestion());
    }
    if (success) {
      alert.success(
        <div style={{ fontSize: "1.3rem" }}>{message.message}</div>
      );
      dispatch(clearerrorAddQuestion());
      navigate("/allQuestion");
    }
    if (!authLoading && !isAuth) {
      alert.error(<div style={{ fontSize: "1.3rem" }}>Login Or SignUp First to Ask Question</div>);
      navigate("/allQuestion");
    }
    dispatch(clearerror());
  }, [
    dispatch,
    data,
    tags,
    tagId,
    alert,
    navigate,
    success,
    error,
    authLoading,
    message,
    isAuth,
  ]);

  let changeTag = (e) => {
    if (!e.target.value) {
      dispatch(clearerror());
    } else {
      dispatch(
        AllTagAction({
          keyword: {
            title: e.target.value,
          },
          sort: {
            date: -1,
          },
        })
      );
    }
  };
  let addTag = (id, name) => {
    if (tagChoose.length === 5) {
      alert.error(
        <div style={{ fontSize: "1.3rem" }}>Cannot add more than 5 tags</div>
      );
      return;
    }
    let check = tagChoose.find((e) => e.id === id);
    if (check)
      alert.error(
        <div style={{ fontSize: "1.3rem" }}>
          This tag is already been added.
        </div>
      );
    else {
      settagChoose([...tagChoose, { id, name }]);
    }
  };
  let deleteTag = (name, id) => {
    settagChoose(tagChoose.filter((e) => e.id !== id));
  };
  let formArray = () => {
    let zz = [];
    tagChoose.forEach((e) => {
      zz.push(e.name);
    });
    setTags(zz);
    zz = [];
    tagChoose.forEach((e) => {
      zz.push(e.id);
    });
    settagId(zz);
  };
  let postQuestion = () => {
    if (tags.length === 0) {
      alert.error(
        <div style={{ fontSize: "1.3rem" }}>
          You have to include atleast one tag or confirm tag first.
        </div>
      );
      return;
    }
    dispatch(
      AddQuestionAction({ desc: data.desc, title: data.title, tags, tagId })
    );
  };
  return (
    <div className="AddQuestion">
      <SideNavbar />
      <div className="AddQuestionDetail">
        <div className="AddQuestionTitle">
          <h1>Title</h1>
          <p>
            Be specific and imagine you’re asking a question to another person.
          </p>
          <input
            type="text"
            placeholder="Your Question in-short"
            name="title"
            onChange={makeChange}
          />
        </div>

        <div className="AddQuestionMarkDown">
          <h1>What are the details of your problem?</h1>
          <p>
            Introduce the problem and expand on what you put in the title.
            Minimum 25 characters. Markdown also works in the TextArea to know more about it.  <a href="https://www.markdownguide.org/basic-syntax" style={{color: "#8be9fd", fontSize: "1.5rem"}}>Click Here</a>
          </p>
          <textarea
            name="desc"
            rows="15"
            value={data.desc}
            onChange={makeChange}
            placeholder="Detailed explanation of your Question"
          ></textarea>
        </div>

        <div className="AddQuestionReview">
          <h1>Review</h1>
          <p>
            The Descreption of your question will look like this when posted.
          </p>
          <ReactMarkdown
            children={
              data.desc ? data.desc : "Enter some data in TextArea to preview"
            }
            className="ReactMarkDownStyle"
          />
        </div>

        <div className="AddQuestionTag">
          <h1>Tags</h1>
          <p>
            Add Upto 5 tags and no duplicate tags are supported. If tag you want
            is missing you can add tag you need bu clicking on the Add Tag on
            SideNavbar. Search the tag and click on result to add them.
          </p>
          <ul>
            {tagChoose.map((e) => {
              return (
                <li>
                  {e.name}
                  <i
                    className="fa-sharp fa-solid fa-xmark fa-1x"
                    onClick={() => deleteTag(e.name, e.id)}
                  ></i>
                </li>
              );
            })}
          </ul>
          <input type="text" placeholder="Search Tag" onChange={changeTag} />
          <div className="AddQuestionTagSelector">
            {loading && <Spinner />}
            {!loading &&
              tag.map((e) => {
                return (
                  <div className="AddQuestionTagChoose">
                    <p>{e.title}</p>{" "}
                    <i
                      className="fa-regular fa-plus fa-2x"
                      onClick={() => addTag(e._id, e.title)}
                    ></i>
                  </div>
                );
              })}
          </div>
          <button onClick={formArray}>Confirm Tag</button>
        </div>
        <button disabled={addLoading} onClick={postQuestion}>
          Post Question
        </button>
      </div>
    </div>
  );
}
