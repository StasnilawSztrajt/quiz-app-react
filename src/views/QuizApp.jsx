import React from 'react'
import Answers from '../components/Answers/Answers.jsx'
import QuizResult from '../components/QuizResult/QuizResult.jsx'


class QuizApp extends React.Component{
    state = {
        questions: [
            {},
            {
                question: 'Which year the 1nd world war broke out',
                answers: [
                    {answer: '1838', correctness: ''},
                    {answer: '1918', correctness: ''},
                    {answer: '1939', correctness: ''},
                    {answer: '1943', correctness: ''}
                ],
                correctAnswer: '1918',
                uses: 0,
            },
            {
                question: 'Which year the 2nd world war broke out',
                answers: [
                    {answer: '1838', correctness: ''},
                    {answer: '1918', correctness: ''},
                    {answer: '1939', correctness: ''},
                    {answer: '1943', correctness: ''}
                ],
                correctAnswer: '1939',
                uses: 0,
            },
            {
                question: 'Which year the 3nd world war broke out',
                answers: [
                    {answer: '1950', correctness: ''},
                    {answer: '1982', correctness: ''},
                    {answer: '1976', correctness: ''},
                    {answer: 'never', correctness: ''}
                ],
                correctAnswer: 'never',
                uses: 0,
            },
        ],
        questionNumber: 1,
        points: 0,
        endTest: false,
        isShowResult: false,
        descriptionToResult: ''
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
        if(questions[questionNumber].uses === 1){
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
            ...prevState.questions[questionNumber].uses = 1,
            points: answerArgument === questions[questionNumber].correctAnswer ? points + 1 : points,
        }))

        setTimeout(() =>{
            this.nextQuestion()
        },1000)
    }

    showResult(){
        this.setState({isShowResult: true})
    }

    restartQuiz(){
        this.setState({
            questions: [
                {},
                {
                    question: 'Which year the 1nd world war broke out',
                    answers: [
                        {answer: '1838', correctness: ''},
                        {answer: '1918', correctness: ''},
                        {answer: '1939', correctness: ''},
                        {answer: '1943', correctness: ''}
                    ],
                    correctAnswer: '1918',
                    uses: 0,
                },
                {
                    question: 'Which year the 2nd world war broke out',
                    answers: [
                        {answer: '1838', correctness: ''},
                        {answer: '1918', correctness: ''},
                        {answer: '1939', correctness: ''},
                        {answer: '1943', correctness: ''}
                    ],
                    correctAnswer: '1939',
                    uses: 0,
                },
                {
                    question: 'Which year the 3nd world war broke out',
                    answers: [
                        {answer: '1950', correctness: ''},
                        {answer: '1982', correctness: ''},
                        {answer: '1976', correctness: ''},
                        {answer: 'never', correctness: ''}
                    ],
                    correctAnswer: 'never',
                    uses: 0,
                },
            ],
            questionNumber: 1,
            points: 0,
            endTest: false,
            isShowResult: false
        })
    }



    render(){
        const {questions, points, questionNumber,endTest, isShowResult, descriptionToResult} = this.state;

        const answers = questions[questionNumber].answers.map(answer => {
            return <Answers answer={answer} checkAnswer={() =>{ this.checkAnswer(answer.answer) }}/>
        })

        return(
            <div className="flex items-center justify-center m-auto h-50vh w-3/6 bg-red-400 mt-48 ">
                {!isShowResult ?
                <div className=" flex flex-col items-center bg-gray-300 rounded w-10/12 h-5/6">
                    <h1 className="text-3xl mt-5 text-gray-700">
                        {questions[questionNumber].question}
                    </h1>
                    <div className="flex flex-col items-center w-full mt-10">
                        {answers}
                    </div>

                    { endTest ? <button className="text-black w-1/4 h-1/4 bg-white my-4 duration-100 hover:opacity-80" onClick={this.showResult.bind(this)}>Show results !</button> : null }
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
        )
    }
}

export default QuizApp