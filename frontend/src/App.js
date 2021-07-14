import React from 'react'
import './index.css';
import Menu from './components/Menu.jsx'
import QuizApp from './views/QuizApp.jsx'
import CreateQuiz from './views/CreateQuiz.jsx'
import QuizzesList from './views/QuizzesList.jsx'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import Dashboard from './views/Dashboard.jsx'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//exact component
function App() {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route exact path="/">
          <QuizzesList />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/create-quiz">
          <CreateQuiz />
        </Route>
        <Route path="/quiz/:id" render={(props) =>(
          <QuizApp id={props.match.params.id}/>
        )}>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
