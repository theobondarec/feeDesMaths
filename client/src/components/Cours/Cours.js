import React, {useState, useEffect, useContext} from 'react'
import './Cours.css';
import {Link, useHistory} from 'react-router-dom'
import { UserContext } from '../../App'
import { InlineTex } from 'react-tex'
import Cookies from 'universal-cookie';

const Cours = ()=>{
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

    const [matiere, setMatiere] = useState("")
    const [subjects, setsubjects] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [allow, setAllow] = useState("")
    useEffect(()=>{
        fetch('/api/subjectsCours',{
            headers:{
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.allow === true){
                setsubjects(result.subjects)
                setAllow(result.allow)
                setMatiere("")
            }
            else{
                setErrorMessage(result.error)
            }
        })
    },[])
    
    const [chapters, setChapters] = useState([])
    const [errorMessageChapter, setErrorMessageChapter] = useState("")
    const [allowChapters, setAllowChapters] = useState("")
    const [data, setData] = useState([])
    useEffect(()=>{
        if(matiere === "" || matiere === "undifined"){
            fetch('/api/getCourse',{
                headers:{
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                    Authorization:"Bearer "+ cookies.get('jwt')
                }
            }).then(res=>res.json())
            .then(result=>{
                // console.log(matiere)
                if(result.allow === true){
                    // console.log(result.chapters)
                    setData(result.chapters)
                    setAllowChapters(result.allow)
                }
                else{
                    setErrorMessageChapter(result.error)
                }
            })
        }
        else{
            // console.log(matiere)
            fetch('/api/getCourseSubject',{
                method: "post",
                headers:{
                    "Content-Type": "application/json",
                    // Authorization: "Bearer " + localStorage.getItem("jwt")
                    Authorization:"Bearer "+ cookies.get('jwt')
                },
                body:JSON.stringify({
                    subject:matiere
                })
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    // console.log(result.chapters)
                    setData(result.chapters)
                    setAllowChapters(result.allow)
                }
                else{
                    setErrorMessageChapter(result.error)
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[matiere])

    const IllustrationSetUp = (illustration)=>{
        if(illustration != ""){
            return(
                <img className="card-img" id="img" src={illustration} alt="Cardimagecap"></img>
            )
        }
    }

    if(data.length > 0){
        return(
            <div className="col-10 offset-1" id="listecours">
                <h1 id="title_course">Tous les cours</h1>
                <div id="lessonSelection">
                    <div className="matiereSelection">
                    <h2>Matieres</h2>
                    <select id="inputStateMatiere" className="form-control" onChange={(e)=>{setMatiere(e.target.value)}}>
                        <option className="defaultValue" value="undifined">Select subject</option>
                        {subjects.map(subject=>{
                            return(
                                <option key={subject} value={subject}>{subject}</option>
                            )
                        })}
                    </select>
                    {/* </div> */}
                </div>
            </div>
            <div className="allCard" >
                {
                    data.map(item=>{
                        // console.log(item)
                        return(
                            <div id="user_card_course" key={item.chapterId}>
                            <div id="lecon" className={"card" + item.subject}>
                                <h1><font color="#E22146">{item.subject}: {item.chapterTitle}</font></h1>
                                {
                                    IllustrationSetUp(item.illustration)
                                }
                                <div className="card-body">
                                    <InlineTex texContent={item.description}/>
                                </div>
                                {/* {
                                    getLesson(item.subject, item.chapterId)
                                } */}

                                <Link to={"/cours/" +item.chapterId} className="btn" id="seecourse_btn">Voir le chapitre</Link>
                            </div>
                            </div>
                        )
                    })
                }
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

export default Cours