import './App.css';
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import Navbar from './Components/Navbar';
import AllQuestion from './Components/AllQuestion';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Question from "./Components/Question";
import AddQuestion from './Components/AddQuestion';
import AllTag from "./Components/AllTag";
import AddTag from './Components/AddTag';
import AddAnswer from './Components/AddAnswer';
import Home from "./Components/Home"
function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route exact path="/Login" element={<><Navbar /><Login /></>}></Route>
        <Route exact path="/SignUp" element={<><Navbar /><SignUp /></>}></Route>
        <Route exact path="/" element={<><Navbar/><Home /></>} />
         <Route exact path="/allQuestion" element={<><Navbar/><AllQuestion /></>} />
         <Route exact path="/allTag" element={<><Navbar/><AllTag /></>} />
         <Route exact path="/question/:id" element={<><Navbar/><Question /></>} />
         <Route exact path="/addQuestion" element={<><Navbar/><AddQuestion /></>} />
         <Route exact path="/addTag" element={<><Navbar/><AddTag /></>} />
         <Route exact path="/addAnswer/:id" element={<><Navbar/><AddAnswer /></>} />
      </Routes>
    </Router>
   </>
  );
}

export default App;
