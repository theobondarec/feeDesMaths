import React, {useEffect, useState, useContext, Component} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
// import './Cours.css';
// import '../screens/Pages.css'
import './Modification.css';

import { convertFromHTML, convertFromRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()



const Modification = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const testExpiredToken = () => {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            history.push('/login')
    }
    useEffect(()=>{
        fetch('/api/tokenIsOk',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
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


    const postId = useParams()
    const [lesson ,setLesson]=useState([])
    const [chapitre, setChapitre] = useState("")
    const [matiere, setMatiere] = useState("")
    const [lessNumber,setLessonNumber] = useState("")
    const [leconTitle, setLeconTitle] = useState("")
    const [cours, setCours] = useState("")
    
    // const ContentState = Draft.ContentState
    useEffect(()=>{
        fetch(`/api/modification/${postId.id}`,{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setLesson(result[0])
            setMatiere(result[0].subject)
            setChapitre(result[0].chapter)
            setLessonNumber(result[0].lessonNumber)
            setLeconTitle(result[0].lessonTitle)
            const coursHTML = convertFromHTML(result[0].lessonContent)
            setCours(EditorState.createWithContent(ContentState.createFromBlockArray(coursHTML.contentBlocks, coursHTML.entityMap)))
        })
        .catch(err=>{
            console.log(err)
        })
    },[])




    const onEditorStateChangeCours = (e) => {
        setCours(e)
    }

    const [subjects, setsubjects] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState([])
    
    useEffect(()=>{
        fetch('/api/subjects',{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("jwt")
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
    const [allowChapters, setAllowChapters] = useState([])
    useEffect(()=>{
        if(matiere === "" || matiere === "undifined"){
            fetch('/api/chapters',{
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    setChapters(result.chapters)
                    setAllowChapters(result.allow)
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
                    Authorization: "Bearer " + localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    subject:matiere
                })
            }).then(res=>res.json())
            .then(result=>{
                if(result.allow === true){
                    setChapters(result.chapters)
                    setAllowChapters(result.allow)
                }
                else{
                    setErrorMessageChapter(result.error)
                }
            })
        }
    },[matiere])

    const updateLesson = ()=>{
        console.log(lesson)
        fetch('/api/updateLesson', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                subject:matiere,
                chapter:chapitre,
                lessonTitle:leconTitle,
                lesson:draftToHtml(convertToRaw(cours.getCurrentContent())),
                lessonNumber:lessNumber,
                leconId:lesson.lessonId,
                chapterId:lesson.chapterId
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.createlesson === true){
                toast.success(`${leconTitle} updated`,{autoClose: 3000})
                // window.alert(`${newChapter} added`)
                history.push('/mypost')
            }
            else{
                // toast(result.error)
                toast.error(result.error, )
                // window.alert(result.error)
            }
        })
        .catch(err=>{
            console.error(err)
        })  
    }


    if(!lesson){
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
    else{
        return(
            <div className="form-row mcl">
                <div className="card col add-card-Modification">
                    <h1>Modifier une leçon</h1>
                    <div className="form-row mcl" id="spaceModification">
                        <div className="col">
                            <select id="inputStateMatiere" className="form-control" onChange={(e)=>{setMatiere(e.target.value)}}>
                                <option  className="defaultValue" value={lesson.subject}>{lesson.subject}</option>
                                <option disabled>──────────</option>
                                {subjects.map(subject=>{
                                    return(
                                        <option key={subject} value={subject}>{subject}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <select id="inputStateChapitre" className="form-control" onChange={(e)=>{setChapitre(e.target.value)}}>
                                <option  className="defaultValue" value={lesson.chapter}>{lesson.chapter}</option>
                                <option disabled>──────────</option>
                                {chapters.map(chapter=>{
                                    return(
                                        <option key={chapter} value={chapter}>{chapter}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="chapitre N°" id="lessNumber"
                                value={lessNumber}
                                onChange={(e) => setLessonNumber(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" placeholder="Titre de la leçon" id="leconTitle"
                                value={leconTitle}
                                onChange={(e) => setLeconTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <Editor
                        editorState={cours}
                        // toolbarClassName="toolbarClassName"
                        // wrapperClassName="wrapperClassName"
                        editorClassName='editorClassName'
                        onEditorStateChange={onEditorStateChangeCours}
                    /> 
                    
                    <button type="button" className="btn btn-primary"
                            onClick={() => updateLesson()}
                    >
                        Mettre à jour
                    </button>
                </div>
                <div className="card col add-card-Modification">
                    <h1>Prévisualtion leçon</h1>
                    <div>
                        {
                            cours !== "" ?
                                <InlineTex texContent={draftToHtml(convertToRaw(cours.getCurrentContent()))}/> : ""
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default Modification