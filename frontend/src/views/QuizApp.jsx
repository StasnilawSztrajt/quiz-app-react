import React from 'react'
import Answers from '../components/Answers.jsx'
import QuizResult from '../components/QuizResult.jsx'
import axios from 'axios'

const API_URL = 'http://localhost:1337'


class QuizApp extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            questions: [
                {title: false},
            ],
            questionNumber: 1,
            points: 0,
            endTest: false,
            isShowResult: false,
            descriptionToResult: '',
            createdBy: ''
        }
    }

    restartQuiz(){
        this.setState({
            questions: [
                {title: false},
            ],
            questionNumber: 1,
            points: 0,
            endTest: false,
            isShowResult: false,
            createdBy: ''
        })

        const fetchQuiz = async () =>{
            await axios.get(`${API_URL}/quizzes/${this.props.id}`)
            .then(async res => {
                const quiz = res.data.quiz
                const userID = res.data.userID

                await axios.get(`${API_URL}/users/${userID}`)
                .then(res => {
                    this.setState({createdBy: res.data.username})
                })
                .catch(() => console.log('nie znaleziono uzytkownika'))

                await quiz.forEach((question,index) =>{
                    if(index === 0) return;

                    for(let i=question.answers.length-1; i>0; i--) {
                        let j = Math.floor(Math.random() * (i + 1));
                        let temp = question.answers[i];
                        question.answers[i] = question.answers[j];
                        question.answers[j] = temp;
                    }
                })

                this.setState({questions: quiz})
            })
            .catch(err =>{
                console.log(err, 'quiz not found')
            })
        }
        fetchQuiz()
    }

    componentWillMount(){
        this.restartQuiz()
    }


    nextQuestion(){
        const {questionNumber,questions, points} = this.state

        if(questionNumber >= questions.length - 1){
            if(points/(questions.length-1) === 1){
                this.setState({descriptionToResult: 'Not bad ! You are pretty smart'})
            }
            else if(points/(questions.length-1) >= 0.4){
                this.setState({descriptionToResult: 'Fine but you have to practice'})
            }
            else{
                this.setState({descriptionToResult: 'bad, you must practice'})
            }

            return this.setState({
                endTest: true,
            });
        }

        // toggle question to next
        this.setState({
            questionNumber: questionNumber + 1
        })
    }

    checkAnswer(answerArgument){
        const {questions, questionNumber, points} = this.state;

        // protection against to much cliks on answer
        if(questions[questionNumber].used){
            return console.log('to many tries')
        }

        // adding className to answer buttons
        questions[questionNumber].answers.forEach((item,index) => {
            this.setState(prevState => ({
                ...prevState.questions[questionNumber].answers[index].correctness =
                        item.answer === prevState.questions[questionNumber].correctAnswer ? 'bg-green-600' : 'bg-red-600'
            }))
        })


        // protection against to much cliks on answer
        this.setState(prevState =>({
            ...prevState.questions[questionNumber].used = true,
            points: answerArgument === questions[questionNumber].correctAnswer ? points + 1 : points,
        }))

        setTimeout(() =>{
            this.nextQuestion()
        },1000)
    }

    showResult(){
        this.setState({isShowResult: true})
    }




    render(){
        const {questions, points, questionNumber,endTest, isShowResult, descriptionToResult, createdBy} = this.state;

        return(
            <div >
                {questions[0].title ?
                    <div className="flex items-center justify-center m-auto h-50vh w-1/2 bg-red-400 mt-48 ">
                        {!isShowResult ?
                        <div className=" flex flex-col items-center bg-gray-300 rounded w-4/6">
                            <h1 className=" text-black">created by: {createdBy}</h1>
                            <h1 className="text-3xl mt-5 text-gray-700">
                                {questions[questionNumber].question}
                            </h1>
                            <div className="flex flex-col items-center w-full mb-5">
                                {questions[questionNumber].answers.map(answer =>{
                                    return <Answers key={answer.answer} answer={answer} checkAnswer={() =>{ this.checkAnswer(answer.answer) }}/>
                                })}
                            </div>

                            { endTest ? <button className=" top-96 mt-64 absolute text-black w-1/12 h-16 bg-white my-4 duration-100 hover:opacity-80" onClick={this.showResult.bind(this)}>Show results !</button> : null }
                        </div>
                        :null}

                        {isShowResult ?
                            <QuizResult
                                points={ points }
                                questions={ questions }
                                descriptionToResult={ descriptionToResult }
                                restartQuiz={ this.restartQuiz.bind(this) }
                            />
                        :null}
                    </div>
                : null}
            </div>
        )
    }
}

export default QuizApp