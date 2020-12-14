import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import { InlineTex } from 'react-tex'
import './Addlesson.css'

import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import firebase from '@firebase/app'
import storage from '@firebase/storage'

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const config = {
    "apiKey": process.env.REACT_APP_API_KEY,
    "authDomain": process.env.REACT_APP_API_authDomain,
    "databaseURL": process.env.REACT_APP_API_databaseURL,
    "projectId": process.env.REACT_APP_API_projectId,
    "storageBucket": process.env.REACT_APP_API_storageBucket,
    "messagingSenderId": process.env.REACT_APP_API_messagingSenderId,
    "appId": process.env.REACT_APP_API_appId,
    "measurementId": process.env.REACT_APP_API_measurementId
}


const Addlesson = () => {
    const [chapitre, setChapitre] = useState("")
    const [matiere, setMatiere] = useState("")

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    const testExpiredToken = () => {
        localStorage.clear()
        dispatch({type: "CLEAR"})
        history.push('/login')
}

    useEffect(()=>{
        fetch('/tokenIsOk',{
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

    /// GET MATIERES CHAPITRES
    const [subjects, setsubjects] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState([])
    useEffect(()=>{
        fetch('/subjects',{
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
            fetch('/chapters',{
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
            fetch('/chaptersPrecis',{
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


    const onEditorStateChangeCours = (e) => {
        setCours(e)
    }

    const onEditorStateChangeDescription = (e) => {
        setDesc(e)
    }


    /// POST FUNCTIONs
    const [url, setUrl] = useState("")
    if(!firebase.apps.length){
        firebase.initializeApp(config)
    }
    const storage = firebase.storage()
    const submitButton = (file)=>{
        document.getElementById('buttonPostChapter').disabled = true
        document.getElementById('buttonDeleteIllu').disabled = true
        const imageExtension = file.name.split(".")[file.name.split(".").length - 1];
        const filename = `${(Math.random().toString(36).substr(2, 13) + '-' + Math.random().toString(36).substr(2, 13)+ '-' + Math.random().toString(36).substr(2, 13)).toString()}.${imageExtension}`;
        let locationRef = storage.ref('img/' + filename)
        let task = locationRef.put(file)
        task.on('state_changed', 
            function progress(snapshot){ //progress
                let per = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                let uploader = document.getElementById('progressBar')
                uploader.value = per;
            },
            function error(error){ },
            function complete(){
                locationRef.getDownloadURL()
                .then((url)=>{
                    // console.log(url)
                    setUrl(url)
                    document.getElementById('buttonPostChapter').disabled = false
                    document.getElementById('buttonDeleteIllu').disabled = false
                })
                .catch(err=>{
                    console.log(err)
                })
              }
        )
    }

    const getPathStorageFromUrl = ()=>{
        // console.log(url)
        const baseUrl = "https://firebasestorage.googleapis.com/v0/b/feedesmaths.appspot.com/o/"
        let imagePath = url.replace(baseUrl,"")
        const indexOfEndPath = imagePath.indexOf("?")
        imagePath = imagePath.substring(0,indexOfEndPath)
        imagePath = imagePath.replace("%2F","/")
        // console.log(imagePath)
        return imagePath;
    }
    const deleteFile = () =>{
        if(url){
            const imagePath = getPathStorageFromUrl()
            const desertRef = storage.ref().child(imagePath);
            desertRef.delete()
            .then(()=>{
                const url = ""
                setUrl(url)
                document.getElementById('buttonPostChapter').disabled = false
                document.getElementById('buttonDeleteIllu').disabled = true
                document.getElementById('submitButton').value = ""
                document.getElementById('progressBar').value = 0
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }


    useEffect(()=>{
        setCours(EditorState.createWithContent(ContentState.createFromText("")))
        setDesc(EditorState.createWithContent(ContentState.createFromText("")))
    },[])

    const [leconTitle, setLecon] = useState("")
    const [cours, setCours] = useState("")
    const [lessNumber,setLessonNumber] = useState("")
    const postLesson = ()=>{
        fetch('/createCourse', {
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
                lessonNumber:lessNumber
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.createlesson === true){
                document.getElementById('inputStateMatiere').value = "undifined"
                document.getElementById('inputStateChapitre').value = "undifined"
                document.getElementById('leconTitle').value = ""
                document.getElementById('lessNumber').value = ""
                // document.getElementById('cours').value = ""
                // onEditorStateChangeCours("")
                toast.success(`${newChapter} added`, {autoClose: 3000})
                
                // window.alert(`${newChapter} added`)
            }
            else{
                // toast(result.error)
                toast.error(result.error, {autoClose: 3000})
                // window.alert(result.error)
            }
        })
        .catch(err=>{
            console.error(err)
        })    
    }


    const [matiereForChapter, setMatiereForChapter] = useState("")
    const [newChapter, setNewChapter] = useState("")
    const [chapNumber, setChapNumber] = useState("")
    const [desc, setDesc] = useState("")
    const postChapter = ()=>{
        fetch('/createChapter', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                subject: matiereForChapter.toLocaleLowerCase(),
                chapter: newChapter,
                chapterIllustration:url,
                chapterDesc: draftToHtml(convertToRaw(desc.getCurrentContent())),
                chapNumber: chapNumber
            })
        })
        .then(res => res.json())
        .then((result)=>{
            // console.log(result)
            if(result.createChapter === true){
                setChapters([...chapters, newChapter])
                document.getElementById('inputStateChapter').value = "undifined"
                document.getElementById('chapNumber').value = ""
                document.getElementById('newChapter').value = ""
                // document.getElementById('submitButton').value = ""
                // document.getElementById('desc').value = ""
                document.getElementById('progressBar').value = 0
                setCours("")
                // toast(`${newChapter} added`)
                toast.success(`${newChapter} added`, {autoClose: 3000})
                // window.alert(`${newChapter} added`)
            }
            else{
                // toast(result.error)
                toast.error(result.error, {autoClose: 3000})
                // window.alert(result.error)
            }
        })
        .catch(err=>{
            console.error(err)
        })
    }

    const [newSubject, setNewSubject] = useState("")
    const postSubject = ()=>{
        if (document.getElementById("newSubject")) {
            document.getElementById('newSubject').value = ""
        }
        fetch('/createSubject', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                subject: newSubject
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.createSubject === true){
                setsubjects([...subjects, newSubject])
                // toast(`${newSubject} added`)
                toast.success(`${newSubject} added`, {autoClose: 3000})
                // window.alert(`${newSubject} added`)
            }
            else{
                // toast(result.error)
                toast.error(result.error, {autoClose: 3000})
                // window.alert(result.error)
            }
        })
        .catch(err=>{
            console.error(err)
        })
    }

    return (
        <div>
            <div className="form-row mcl">
                <div className="card col add-card-AddLesson">
                    <h1>Ajouter une leçon</h1>
                    <div className="form-row mcl spaceAdd">
                        <div className="col">
                            <select id="inputStateMatiere" className="form-control" onChange={(e)=>{setMatiere(e.target.value)}}>
                                <option  className="defaultValue" value="undifined">Matières : </option>
                                {subjects.map(subject=>{
                                    return(
                                        <option key={subject} value={subject}>{subject}</option>
                                    )
                                })}
                            </select>
                            <a href="#addSubject">Ajouter une matière</a>
                        </div>
                        <div className="col">
                            <select id="inputStateChapitre" className="form-control" onChange={(e)=>{setChapitre(e.target.value)}}>
                                <option  className="defaultValue" value="undifined">Chapitres : </option>
                                {chapters.map(chapter=>{
                                    return(
                                        <option key={chapter} value={chapter}>{chapter}</option>
                                    )
                                })}
                            </select>
                            <a href="#addChapter">Ajouter un chapitre</a>
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
                                onChange={(e) => setLecon(e.target.value)}
                            />
                        </div>
                    </div>
                    <Editor
                        // rows="16" cols="50"
                        id="cours"
                        editorState={cours}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChangeCours}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => postLesson()}>Upload</button>
                </div>
                <div className="card col add-card-AddLesson">
                    <h1>Prévisualtion cours</h1>
                    <div>
                        {
                            cours !== "" ?
                                <InlineTex texContent={draftToHtml(convertToRaw(cours.getCurrentContent()))}/> : ""
                        }
                    </div>
                </div>
            </div>                
            {/* ajoute chapitre */}
            <div className="form-row mcl">
                <div className="card col add-card-AddLesson" id="addChapter">
                    <h1>Ajouter un chapitre</h1>
                    <div className="form-row mcl spaceAdd">
                        <div className="col">
                            <select id="inputStateChapter" className="form-control" onChange={(e)=>{setMatiereForChapter(e.target.value)}}>
                                <option  className="defaultValue" value="undifined">Matière : </option>
                                {subjects.map(subject=>{
                                    return(
                                        <option key={subject} value={subject}>{subject}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col">
                            <input type="number" className="form-control" placeholder="chapitre N°" id="chapNumber"
                                value={chapNumber}
                                onChange={(e) => setChapNumber(e.target.value)}
                            />
                        </div>
                        <div className="col">
                            <input type="text" className="form-control" placeholder="titre du chapitre" id="newChapter"
                                value={newChapter}
                                onChange={(e) => setNewChapter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="input-group spaceAdd">
                        <div className="custom-file">
                            <input type="file" id="submitButton" onChange={(e)=>submitButton(e.target.files[0])}/>
                            <div>
                                <progress value="0" max="100" id="progressBar">0%</progress>    
                            </div>
                            <button id="buttonDeleteIllu" className="btn" onClick={()=>{deleteFile()}}><i className="fa fa-close"></i></button>
                        </div>
                    </div>

                    <Editor
                        id = "desc"
                        editorState={desc}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChangeDescription}
                    />
                    <button id="buttonPostChapter" type="button" className="btn btn-primary"
                            onClick={() => postChapter()}
                    >
                        Upload
                    </button>
                </div>
                <div className="card col" id="add-card-lesson">
                    <h1>Prévisualtion description chapitre</h1>
                    <div>
                        {
                            desc !== "" ?
                                <InlineTex texContent={draftToHtml(convertToRaw(desc.getCurrentContent()))}/> : ""
                        }
                    </div>
                </div>
            </div>
            
            {/* ajoute matiere */}
            <div className="card add-card-AddLesson" id="addSubject">
                <h1>Ajouter une matiere</h1>
                <div className="form-row mcl" id="spaceAddLesson">
                    <div className="col">
                        <input type="text" className="form-control" placeholder="Titre de la matière" id="newSubject"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <button id="boutonSubject" type="button" className="btn btn-primary"
                                onClick={() => postSubject()}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Addlesson