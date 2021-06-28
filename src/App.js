import React from 'react'
import './index.css';
import Nav from './components/Nav.jsx'
import QuizApp from './views/QuizApp.jsx'
import CreateQuiz from './views/CreateQuiz.jsx'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/" exact component={QuizApp}></Route>
        <Route path="/create-quiz" exact component={CreateQuiz}></Route>
      </Switch>
    </Router>
  );
}

export default App;
