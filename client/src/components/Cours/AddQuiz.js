import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import { InlineTex } from 'react-tex'
import './AddQuiz.css'
import dotenv from 'dotenv'
import Cookies from 'universal-cookie';

import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import firebase from '@firebase/app'
import storage from '@firebase/storage'

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const Addquiz = () => {
    const cookies = new Cookies()

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    const testExpiredToken = () => {
        localStorage.clear()
        //Clear Cookies
        cookies.remove('jwt', {path:'/'})
        // Clear Cookies
        dispatch({type: "CLEAR"})
        history.push('/login')
}

    useEffect(()=>{
        fetch('/api/tokenIsOk',{
            headers:{
                Authorization:"Bearer "+ cookies.get('jwt')
                // Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            if(result.tokenOk === true){
                return
            }
            else{
                testExpiredToken()
            }
        })
    },[])


    // const [lessonClip,setLessonClip] = useState("")
    const [lecon, setLecon] = useState("")
    const [chapitre, setChapitre] = useState("")
    const [matiere, setMatiere] = useState("")
    const [questionNumber,setQuestionNumber] = useState("")
    const [question, setQuestion] = useState("")
    const [answersA, setAnswersA] = useState("")
    const [answersB, setAnswersB] = useState("")
    const [answersC, setAnswersC] = useState("")
    const [answersD, setAnswersD] = useState("")
    const [correctAnswer, setCorrectAnswer] = useState([])



    

    useEffect(()=>{
        const coursHTML = "Énoncé de votre question : "
        setQuestion(EditorState.createWithContent(ContentState.createFromText(coursHTML)))
    },[])


    useEffect(()=>{
        if(allow === true){
            if(!answersA){
                document.getElementById("checkA").disabled = true;
            }
            else{
                document.getElementById("checkA").disabled = false;
            }
            if(!answersB){
                document.getElementById("checkB").disabled = true;
            }
            else{
                document.getElementById("checkB").disabled = false;
            }
            if(!answersC){
                document.getElementById("checkC").disabled = true;
            }
            else{
                document.getElementById("checkC").disabled = false;
            }
            if(!answersD){
                document.getElementById("checkD").disabled = true;
            }
            else{
                document.getElementById("checkD").disabled = false;
            }
        }
    },[answersA, answersB, answersC, answersD])




    const onEditorStateChangeQuestion = (e) => {
        setQuestion(e)
    }

    const checkCorrectAnswer = () => {
        var tab = []
        const checkBox = document.getElementById("checkA");
        const checkBox2 = document.getElementById("checkB");
        const checkBox3 = document.getElementById("checkC");
        const checkBox4 = document.getElementById("checkD");
        if (checkBox.checked == true){
            tab.push(checkBox.value)
        }
        if (checkBox2.checked == true){
            tab.push(checkBox2.value)
        }
        if (checkBox3.checked == true){
            tab.push(checkBox3.value)
        }
        if (checkBox4.checked == true){
            tab.push(checkBox4.value)
        }
        if(tab === []){
            return ({err: 'Select minimum 1 correct answer'})
        }
        return tab
    }

    const postQuiz = async ()=>{
        const tab = await checkCorrectAnswer()
        if(tab.length > 0){
            fetch('/api/createQuiz', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:"Bearer "+ cookies.get('jwt')
                    // "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    // ACCESDB
                    subject:matiere,
                    chapter:chapitre,
                    lessonId:lecon,
                    // COMPO QUIZ
                    question: draftToHtml(convertToRaw(question.getCurrentContent())),
                    questionNumber:parseInt(questionNumber),
                    optionA:answersA,
                    optionB:answersB,
                    optionC:answersC,
                    optionD:answersD,
                    answer:tab
                })
            })
            .then(res => res.json())
            .then((result)=>{
                if(result.createQuestion === true){
                    toast.success(`${'Quiz'} added`, {autoClose: 3000})                
                }
                else{
                    toast.error(result.error, {autoClose: 3000})
                }
            })
            .catch(err=>{
                console.error(err)
            })
        }
        else{
            toast.error('Select minimum 1 correct answer', {autoClose: 3000})
        }
    }


    const [subjects, setsubjects] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState([])
    useEffect(()=>{
        fetch('/api/subjects',{
            headers:{
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.allow === true){
                setsubjects(result.subjects)
                setAllow(result.allow)
            }
            else{
                setErrorMessage(result.error)
            }
        })
    },[])
    const [chapters, setChapters] = useState([])
    const [errorMessageChapter, setErrorMessageChapter] = useState([])
    // const [allowChapters, setAllowChapters] = useState([])
    useEffect(()=>{
        if(matiere === "" || matiere === "undifined"){
            fetch('/api/chapters',{
                headers:{
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                    Authorization:"Bearer "+ cookies.get('jwt')

                }
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    setChapters(result.chapters)
                    // setAllowChapters(result.allow)
                }
                else{
                    setErrorMessageChapter(result.error)
                }
            })
        }
        else{
            fetch('/api/chaptersPrecis',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:"Bearer "+ cookies.get('jwt')

                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    subject:matiere
                })
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    setChapters(result.chapters)
                    // setAllowChapters(result.allow)
                    // console.log(result)
                }
                else{
                    setErrorMessageChapter(result.error)
                }
            })
        }
    },[matiere])



    // GET LESSONS
    const [lessons, setLessons] = useState([])
    const [errorMessageLesson, setErrorMessageLesson] = useState([])

    useEffect(()=>{
        if((matiere === "" || matiere === "undifined") || ( chapitre === "" || chapitre === "undifined")){
            fetch('/api/lesson',{
                headers:{
                    Authorization:"Bearer "+ cookies.get('jwt')
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                // console.log(result)
                if(result.allow === true){
                    setLessons(result.lessons)
                }
                else{
                    setErrorMessageLesson(result.error)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
        else{
            fetch('/api/lessonWithEverything',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    Authorization:"Bearer "+ cookies.get('jwt')
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    subject:matiere,
                    chapter:chapitre
                })
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    setLessons(result.lessons)
                }
                else{
                    setErrorMessageLesson(result.error)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[matiere, chapitre])


    const [existingQuiz, setExistingQuiz] = useState([])
    useEffect(()=>{
        if(matiere && chapitre){
            // console.log(matiere, chapitre, lecon)
            fetch('/api/getQuiz',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                    Authorization:"Bearer "+ cookies.get('jwt')
                },
                body:JSON.stringify({
                    subject:matiere,
                    chapter:chapitre,
                    lessonId:lecon
                })
            })
            .then(res => res.json())
            .then((result)=>{
                // console.log(result)
                setExistingQuiz(result)
            })
            .catch(err=>{
                console.log(err)
            })
            // console.log("fetch")
        }
        // else{
            // console.log('nothing')
        // }
    },[matiere, chapitre, lecon])


    const displayIfAnswerA = ()=>{
        if(!answersA){
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={"answer A is empty"}/>}</label>)
        }
        else{
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={answersA}/>}</label>)
        }
    }
    const displayIfAnswerB = ()=>{
        if(!answersB){
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={"answer B is empty"}/>}</label>)
        }
        else{
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={answersB}/>}</label>)
        }
    }
    const displayIfAnswerC = ()=>{
        if(!answersC){
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={"answer C is empty"}/>}</label>)
        }
        else{
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={answersC}/>}</label>)
        }
    }
    const displayIfAnswerD = ()=>{
        if(!answersD){
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={"answer D is empty"}/>}</label>)
        }
        else{
            return(<label  className="row form-control labelAddQuiz">{<InlineTex texContent={answersD}/>}</label>)
        }
    }

    const displaySubject = ()=>{
        if(!matiere){
            return(<label  className="form-control labelAddQuiz">{"Selectionnez une matiere"}</label>)
        }
        else{
            return(<label  className="form-control labelAddQuiz">{matiere}</label>)
        }
    }
    const displayChapter = ()=>{
        if(!chapitre){
            return(<label  className="form-control labelAddQuiz">{"Selectionnez un chapitre"}</label>)
        }
        else{
            return(<label  className="form-control labelAddQuiz">{chapitre}</label>)
        }
    }
    const displayLesson = ()=>{
        if(lecon){
            return(<label  className="form-control labelAddQuiz">{`${lecon}`}</label>)
        }
    }
    const displayQuestionNumber = ()=>{
        if(!questionNumber){
            return(<label  className="form-control labelAddQuiz" id="questNumber">{`N° de la question`}</label>)
        }
        else{
            return(<label  className="form-control labelAddQuiz" id="questNumber">{`N° ${questionNumber}`}</label>)
        }
    }

    if(allow === true){
        return(
            <div>
                <div className="form-row mcl">
                    <div className="card col add-card-AddQuestion">
                        <h1>Ajouter une question</h1>
                        <div className="form-row mcl">
                            <div className="col">
                                <select id="inputStateMatiere" className="form-control" onChange={(e)=>{setMatiere(e.target.value)}}>
                                    <option  className="defaultValue" value="undifined">Matières : </option>
                                    {subjects.map(subject=>{
                                        return(
                                            <option key={Math.random()} value={subject}>{subject}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col">
                                <select id="inputStateChapitre" className="form-control" onChange={(e)=>{setChapitre(e.target.value)}}>
                                    <option  className="defaultValue" value="undifined">Chapitres : </option>
                                    {chapters.map(chapter=>{
                                        return(
                                            <option key={Math.random()} value={chapter}>{chapter}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col">
                                <select id="inputStateChapitre" className="form-control" onChange={(e)=>{setLecon(e.target.value)}}>
                                    <option  className="defaultValue" value="undifined">Lecon : </option>
                                    {lessons.map(lesson=>{
                                        return(
                                            <option key={Math.random()} value={lesson.lessonId}>{lesson.lessonTitle}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col">
                                <input type="number" className="form-control" placeholder="Question N°" id="questionNumber"
                                    value={questionNumber}
                                    onChange={(e) => setQuestionNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <Editor
                                id="question"
                                editorState={question}
                                toolbarClassName="toolbarClassName"
                                wrapperClassName="wrapperClassName"
                                editorClassName="editorClassName"
                                onEditorStateChange={onEditorStateChangeQuestion}
                                toolbar={{
                                    fontFamily: {
                                        options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana', 'Chalkduster Regular'],
                                        className: undefined,
                                        component: undefined,
                                        dropdownClassName: undefined,
                                    }
                                }}
                            />
                        </div>
                        <div className="form-row mcl">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="réponse A :" id="answersA"
                                    value={answersA}
                                    onChange={(e) => setAnswersA(e.target.value)}
                                />
                            </div>
                            <div className="form-check col">
                                <input className="form-check-input" type="checkbox" value={answersA} id="checkA"/>
                            </div>
                        </div>
                        <div className="form-row mcl">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="réponse B :" id="answersB"
                                    value={answersB}
                                    onChange={(e) => setAnswersB(e.target.value)}
                                />
                            </div>
                            <div className="form-check col">
                                <input className="form-check-input" type="checkbox" value={answersB} id="checkB"/>
                            </div>
                        </div>
                        <div className="form-row mcl">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="réponse C :" id="answersC"
                                    value={answersC}
                                    onChange={(e) => setAnswersC(e.target.value)}
                                />
                            </div>
                            <div className="form-check col">
                                <input className="form-check-input" type="checkbox" value={answersC} id="checkC"/>
                            </div>
                        </div>
                        <div className="form-row mcl">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="réponse D :" id="answersD"
                                    value={answersD}
                                    onChange={(e) => setAnswersD(e.target.value)}
                                />
                            </div>
                            <div className="form-check col">
                                <input className="form-check-input" type="checkbox" value={answersD} id="checkD"/>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={()=>{postQuiz()}}>
                                Ajouter la question
                        </button>
                    </div>
                    <div className="card col add-card-AddQuestion">
                        <div className="row bothParts">
                            <div className="col">
                                <h3>PREVISU QUESTIONS</h3>
                                <div id="quizWay">
                                    {
                                        displaySubject()
                                    }
                                    {
                                        displayChapter()
                                    }
                                    {
                                        displayLesson()
                                    }
                                    {
                                        displayQuestionNumber()
                                    }   
                                </div>
                                <div id="sizeQuestionRender">
                                    {
                                        question !== "" ?
                                        <label  className="form-control labelAddQuiz">{<InlineTex texContent={draftToHtml(convertToRaw(question.getCurrentContent()))}/>}</label>
                                        : ""
                                    }
                                </div>
                                <div className="col">
                                    {
                                        displayIfAnswerA()
                                    }
                                    {
                                        displayIfAnswerB()
                                    }
                                    {
                                        displayIfAnswerC()
                                    }
                                    {
                                        displayIfAnswerD()
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bothParts">
                            <h3>Questions existantes</h3>
                            <div id="text">
                                {
                                    existingQuiz.map(question=>{
                                        return(
                                            <div id="singleQuestion" key={Math.random()}>
                                                <label  className="form-control labelAddQuiz">{<InlineTex texContent={`${question.question}`}/>}</label>
                                                <label  className="form-control labelAddQuiz" id="existingQuestionNumber">{`N° ${question.questionNumber}`}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <h1>{errorMessage}</h1>
            </div>
        )
    }
}


export default Addquiz