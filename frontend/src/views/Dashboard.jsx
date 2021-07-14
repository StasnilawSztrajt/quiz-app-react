import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import QuizEditLayer from '../components/QuizEditLayer';


const API_URL = 'http://localhost:1337';

const Dashboard = () =>{
  const history = useHistory();
  const cookies = new Cookies();

  const didMount = useRef(false)
  let validateReturn = false

  const[userInfo, setUserInfo] = useState({})
  const[userQuizzes, setUserQuizzes] = useState([])
  const[isShowQuizEditLayer, setIsShowQuizEditLayer] = useState(false)

  const[used, setUsed] = useState(false)

  const[valueInputTitle, setValueInputTitle] = useState('');
  const[valueInputQuestion, setValueInputQuestion] = useState('');
  const[valueInputCorrectAnswer, setValueInputCorrectAnswer] = useState('');
  const[valueInputFirstAnswer, setValueInputFirstAnswer] = useState('');
  const[valueInputSecondAnswer, setValueInputSecondAnswer] = useState('');
  const[valueInputThirdAnswer, setValueInputThirdAnswer] = useState('');

  const[validate, setValidate] = useState(false);
  const[validateText, setValidateText] = useState('');

  const[questions,setQuestions] = useState([{title: ''}]);
  const[numberQuestion, setNumberQuestion] = useState(1);

  const[activeIdQuiz, setActiveQuiz] = useState()

  const inputHandleForTitle = (e) =>{
    const newValue = e.target.value;
    setValueInputTitle(newValue);
  }
  const inputHandleForQuestion = (e) =>{
    const newValue = e.target.value;
    setValueInputQuestion(newValue);
  }
  const inputHandleForCorrectAnswer = (e) =>{
    const newValue = e.target.value;
    setValueInputCorrectAnswer(newValue);
  }
  const inputHandleForFirstAnswer = (e) =>{
    const newValue = e.target.value;
    setValueInputFirstAnswer(newValue);
  }
  const inputHandleForSecondAnswer = (e) =>{
    const newValue = e.target.value;
    setValueInputSecondAnswer(newValue);
  }
  const inputHandleForThirdAnswer = (e) =>{
    const newValue = e.target.value;
    setValueInputThirdAnswer(newValue);
  }

  useLayoutEffect(() =>{
    if(!cookies.get('jwt')){
      history.push('/login')
    }

    const fetchUser = async () =>{
      const id = await cookies.get('user').id;

      await axios.get(`${API_URL}/users/${id}`)
      .then(async res =>{
        setUserInfo(res.data);
        res.data.quizzesID.forEach(async id =>{
          await axios.get(`${API_URL}/quizzes/${id}`)
          .then(res =>{
            setUserQuizzes(prevUserQuizzes => [...prevUserQuizzes, res.data])
          })
          .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))
    }

    fetchUser();
  }, [])

  useEffect(() => {
    if(questions[0].title) setInputsValue()
  }, [questions]);

  useEffect(() => {
    if(didMount.current) setInputsValue()
    else didMount.current = true
  }, [numberQuestion]);

  const logout = () =>{
    cookies.remove('jwt');
    cookies.remove('user');

    history.push('/login');
  }

  const validation = () =>{
    setValidate(false);
    if(
        !valueInputTitle ||
        !valueInputQuestion ||
        !valueInputCorrectAnswer ||
        !valueInputFirstAnswer ||
        !valueInputSecondAnswer ||
        !valueInputThirdAnswer
    ){
        setValidateText('Complete the blank fields')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }

    else if(
        valueInputCorrectAnswer === valueInputFirstAnswer||
        valueInputCorrectAnswer === valueInputSecondAnswer||
        valueInputCorrectAnswer === valueInputThirdAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }

    else if(
        valueInputFirstAnswer === valueInputSecondAnswer ||
        valueInputFirstAnswer === valueInputThirdAnswer ||
        valueInputFirstAnswer === valueInputCorrectAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    else if(
        valueInputSecondAnswer === valueInputCorrectAnswer||
        valueInputSecondAnswer === valueInputFirstAnswer||
        valueInputSecondAnswer === valueInputThirdAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    else if(
        valueInputThirdAnswer === valueInputCorrectAnswer||
        valueInputThirdAnswer === valueInputFirstAnswer||
        valueInputThirdAnswer === valueInputSecondAnswer
    ){
        setValidateText('Text repeats in the answers')
        setTimeout(() =>{
            setValidate(false);
        }, 4000)
        validateReturn = true;
        return setValidate(true);
    }
    validateReturn = false;
  }

  const toggleQuizEditLayer = (id) =>{
    setIsShowQuizEditLayer(!isShowQuizEditLayer);
    setActiveQuiz(id)
    const fetchQuiz = async () =>{
      await axios.get(`${API_URL}/quizzes/${id}`)
      .then(res => {
        setQuestions(res.data.quiz)
      })
      .catch(err => console.log(err))
    }
    fetchQuiz()
  }

  const setInputsValue = () =>{
    setValueInputTitle(questions[0].title);
    setValueInputQuestion(questions[numberQuestion].question);
    setValueInputCorrectAnswer(questions[numberQuestion].correctAnswer);
    setValueInputFirstAnswer(questions[numberQuestion].answers[0].answer);
    setValueInputSecondAnswer(questions[numberQuestion].answers[1].answer);
    setValueInputThirdAnswer(questions[numberQuestion].answers[2].answer);
  }

  const nextNumberQuiz = () =>{
    if(numberQuestion === questions.length - 1){
      return
    }
    setNumberQuestion(numberQuestion + 1)
  }

  const previousNumberQuiz = () =>{
    if(numberQuestion === 1){
      return
    }
    setNumberQuestion(numberQuestion - 1)
  }

  const saveEditedQuestion = async () =>{
    validation()

    if(validateReturn){
      return console.log('return validate')
    }

    let questionsArray = [
      {answer: valueInputFirstAnswer, correctness: ''},
      {answer: valueInputSecondAnswer, correctness: ''},
      {answer: valueInputThirdAnswer, correctness: ''},
      {answer: valueInputCorrectAnswer, correctness: ''}
    ]

    let newQuestions = questions;

    newQuestions[0] = {
      title: valueInputTitle
    }

    newQuestions[numberQuestion] = {
      question: valueInputQuestion,
      answers: questionsArray,
      correctAnswer: valueInputCorrectAnswer,
      used: false
    }

    await axios.put(`${API_URL}/quizzes/${activeIdQuiz}`,{
      quiz: newQuestions
    })
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }

  const quizzes = userQuizzes.map(quiz =>{
    return (
      <div key={quiz.id}>
        <Link className="block" to={`/quiz/${quiz.id}`}>{quiz.quiz[0].title}</Link>
        <button onClick={() => toggleQuizEditLayer(quiz.id)}>edit quiz</button>
      </div>
    )
  })

  return(
    <>
      <h1>username: { userInfo.username }</h1>
      <h1>created at: { userInfo.createdAt }</h1>
      <div>{quizzes}</div>
      <button onClick={logout}>Logout</button>
      {validate ?
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded " role="alert">
          <strong className="font-bold">{validateText}</strong>
        </div>
      : null}
      {isShowQuizEditLayer && questions[0].title ?
        <QuizEditLayer
          numberQuestion={numberQuestion}
          questions={questions}
          nextNumberQuiz={nextNumberQuiz}
          previousNumberQuiz={previousNumberQuiz}
          valueInputTitle={valueInputTitle}
          inputHandleForTitle={inputHandleForTitle}
          valueInputQuestion={valueInputQuestion}
          inputHandleForQuestion={inputHandleForQuestion}
          valueInputCorrectAnswer={valueInputCorrectAnswer}
          inputHandleForCorrectAnswer={inputHandleForCorrectAnswer}
          valueInputFirstAnswer={valueInputFirstAnswer}
          inputHandleForFirstAnswer={inputHandleForFirstAnswer}
          valueInputSecondAnswer={valueInputSecondAnswer}
          inputHandleForSecondAnswer={inputHandleForSecondAnswer}
          valueInputThirdAnswer={valueInputThirdAnswer}
          inputHandleForThirdAnswer={inputHandleForThirdAnswer}
          saveEditedQuestion={saveEditedQuestion}
          toggleQuizEditLayer={toggleQuizEditLayer}
        />
      :null}
    </>
  )
}

export default Dashboard;