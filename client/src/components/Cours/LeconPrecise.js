import React, {useEffect, useState, useContext, Component} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './LeconPrecise.css';
// import '../screens/Pages.css'

import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';
import Cookies from 'universal-cookie';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';  
toast.configure()

const LeconPrecise = ()=>{
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
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
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


    const lessonId = useParams()
    const [lesson ,setLesson]=useState([])
    const [note, setNote] = useState("")
    useEffect(()=>{
        fetch(`/api/lesson/${lessonId.id}`,{
            headers:{
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            setLesson(result[0])
            getScore(result[0])
            // console.log(result)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    const getScore = (res) =>{
        const lessonTitle = res.lessonTitle
        fetch(`/api/getQuizScoreForLesson/${lessonTitle}`, {
            headers:{
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.length>0){
                // console.log("result : ",result)
                setNote(result)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const [questions, setQuestions] = useState([])
    const searchQuiz = ()=>{
        fetch('/api/getQuizWChapterId',{
            method: "post",
            headers:{
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            },
            body:JSON.stringify({
                subject:lesson.subject,
                chapterId:lesson.chapterId,
                lessonId:lesson.lessonId
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.length>0){
                // console.log(result)
                setQuestions(result)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const goToChapter = (subject, lessonId, chapterTitle, chapterId)=>{
        fetch('/api/validateProgression', {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            },
            body: JSON.stringify({
                chapterId,
                lessonId
            })
        // })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            toast.success(result.message, {autoClose: 3000})
        })
        .then(()=>{
            fetch('/api/globalProgression',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                    Authorization:"Bearer "+ cookies.get('jwt')
                },
                body: JSON.stringify({
                    subject,
                    chapterId,
                    lessonId,
                    chapterTitle
                })  
            })
        })
        .catch(err=>{
            console.log(err)
            // toast.error(err, {autoClose: 3000})
        })
        history.push(`/cours/${lesson.chapterId}`)
    }
    

    // TYPE D'URL SUPPORTER
    // http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
    // http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
    // http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
    // http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
    // http://www.youtube.com/embed/0zM3nApSvMg?rel=0
    // http://www.youtube.com/watch?v=0zM3nApSvMg
    // http://youtu.be/0zM3nApSvMg
    const youtube_parser = (url)=>{
        if(url){
            var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            var match = url.match(regExp);
            return (match&&match[7].length==11)? match[7] : false;
        }
    }

    const showClip = (clip)=>{
        if(clip){
            if(clip.length > 15){
                const clipId = youtube_parser(clip)    
                // console.log(clipId)
                return(
                    <iframe width="560" height="315" src={`http://www.youtube.com/embed/${clipId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                )
            }
            else{
                const clipId = clip
                return(
                    <iframe width="560" height="315" src={`http://www.youtube.com/embed/${clipId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                )
            }
        }
    }

    const showNote = () =>{
        return(
            <>
                <h1>{note}/20</h1>
            </>
        )
    }

    const displayLessons = () => {
        // document.getElementById("lessonToHide").style.display = "flex"
        document.getElementById("lecons").style.display = "block"
        document.getElementById("quiz").style.display = "none"
        document.getElementById("showScore").style.display = "none"
    }
    const displayQuestions = () => {
        searchQuiz()
        // document.getElementById("lessonToHide").style.display = "none"
        document.getElementById("quiz").style.display = "block"
        document.getElementById("lecons").style.display = "none"
        document.getElementById("showScore").style.display = "none"
    }

    const quizQuestion = () =>{
        if(questions.length>0){
            return(
            <div className="containerQuiz mt-sm-5 my-1">
                <div className="question ml-sm-5 pl-sm-5 pt-2">
                    {questions.map((quest,index)=>{
                        return(
                        <div key={quest.question+index}>
                            <div className="py-2 h5" id="enonce">
                                {/* <h1>{cmpt}</h1> */}
                                {/* AJOUT IMAGE SI IL Y EN A UNE ! */}
        
                                <b id="num">{`Q${quest.questionNumber}.`}</b>
                                <b><InlineTex texContent={quest.question}/></b>
                            </div>
                            <div className="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
                                <label className="options"><InlineTex texContent={quest.optionA}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionA} id={`${index}checkA`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionB}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionB} id={`${index}checkB`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionC}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionC} id={`${index}checkC`}/>
                                    <span className="checkmark"></span>
                                </label>
                                <label className="options"><InlineTex texContent={quest.optionD}/>
                                    <input type="checkbox" name="checkbox" value={quest.optionD} id={`${index}checkD`}/>
                                    <span className="checkmark"></span>
                                </label>
                            </div>
                        </div>
                        )
                    })}
                </div>
        
                <div className="d-flex align-items-center pt-3">
                    <div className="ml-auto mr-sm-5">
                        <button className="btn btn-success" onClick={()=>{displayLessons()}}>retour à la lecon</button>
                    </div>
                    <div className="ml-auto mr-sm-5">
                        <button className="btn btn-success" id="sendAnswer" onClick={()=>{sendQuizAnswer()}}>Valider</button>
                    </div>
                </div>
            </div>
            )
        }
        else{
            return(
                <div>
                    <h1>pas de quiz pour ce chapitre pour l'instant</h1>
                </div>
            )
        }
    }

    const [score, setScore] = useState(0)
    const sendQuizAnswer = ()=>{
        var empty = true
        for(var i = 0; i<questions.length; i++){
            const checkBox = document.getElementById(`${i}checkA`)
            const checkBox2 = document.getElementById(`${i}checkB`)
            const checkBox3 = document.getElementById(`${i}checkC`)
            const checkBox4 = document.getElementById(`${i}checkD`)
    
            if(checkBox.checked == true || checkBox2.checked == true || checkBox3.checked == true || checkBox4.checked == true){
                empty = false
            }
        }

        if(!empty){
            document.getElementById("quiz").style.display = "none"
            document.getElementById("showScore").style.display = "block"

            var totalScore = 0
            // var reponse = {}
            for(var i = 0; i<questions.length; i++){
                const nbrCorrectAns = questions[i].answer.length
                // console.log(nbrCorrectAns)

                const checkBox = document.getElementById(`${i}checkA`)
                const checkBox2 = document.getElementById(`${i}checkB`)
                const checkBox3 = document.getElementById(`${i}checkC`)
                const checkBox4 = document.getElementById(`${i}checkD`)
                for(var y = 0; y<nbrCorrectAns;y++){
                    // console.log("question ",i," check answer ", y, "/")
                    if (checkBox.checked == true){
                        // console.log("question ",i," check answer : ", checkBox.value, " good answer : ",  questions[i].answer[y])
                        if(checkBox.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4
                        }
                    }
                    if (checkBox2.checked == true){
                        if(checkBox2.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4

                        }
                    }
                    if (checkBox3.checked == true){
                        if(checkBox3.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4

                        }
                    }
                    if (checkBox4.checked == true){
                        if(checkBox4.value === questions[i].answer[y]){
                            totalScore += 1/nbrCorrectAns
                        }
                        else{
                            totalScore -= 0.4
                        }
                    }
                }
            }
            // calcul/20
            const finalScore = ((totalScore*20)/questions.length).toFixed(2)
            setScore(finalScore)
            setNote(finalScore)
            showScore(finalScore)
        }
        else{
            toast.error("vérifier vos réponses !", {autoClose: 3000})
        }
    }



    ///////////
    const showScore = (finalScore)=>{
        //stockage en bdd
        fetch('/api/postQuizzScore',{
            method: "post",
            headers:{
                "Content-Type": "application/json",
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')

            },
            body: JSON.stringify({
                chapterTitle:lesson.chapter,
                lessonTitle:lesson.lessonTitle,
                subject:lesson.subject,
                note:finalScore
            })  
        })
        .then(res => res.json())
        .then((result)=>{
            console.log(result.message)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const waiting = () =>{
        return(
            <div id="waitingScreen">
                <h1>Calcul de votre note</h1>
                <div className="cs-loader">
                    <div className="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                </div>
            </div>
        )
    }


    if(lesson){
        return(
            <div id="fullLesson">
                <h1>{lesson.lessonTitle}</h1>
                <div className="card">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="navbar-nav">
                            <button className="btn btn-sm" type="button" onClick={()=>{displayLessons()}}>Leçons :</button>
                            <button className="btn btn-sm" type="button" onClick={()=>{displayQuestions()}}>quiz :</button>
                        </div>
                    </nav>
                    <div className="card-body" id="lecons">
                        {/* <h2 className="list-group-item" id="coursPrecisLeconTitreLecons">Leçons :</h2> */}
                        {
                            showClip(lesson.lessonClip)
                        }
                        <InlineTex texContent={lesson.lessonContent}/>

                        <button type="button" className="btn btn-primary" onClick={()=>{goToChapter(lesson.subject, lesson.lessonId, lesson.chapter, lesson.chapterId)}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"></path>
                            </svg>
                            Retour au chapitre
                        </button>
                    </div>

                    <div>
                        <div id="quiz">
                            {note?showNote():quizQuestion()}
                        </div>
                        <div id="showScore">
                            {note?showNote():waiting()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return(
            <div>
                <h1>Chargement de la base de donnée</h1>
                <div className="cs-loader">
                    <div className="cs-loader-inner">
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                        <label>●</label>
                    </div>
                </div>
            </div>
        )
    }
}
export default LeconPrecise