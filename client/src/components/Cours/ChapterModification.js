import React, {useEffect, useState, useContext, Component} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './ChapterModification.css';
import Cookies from 'universal-cookie';

import { convertFromHTML, convertFromRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { InlineTex } from 'react-tex'
import {EditorState, convertToRaw, ContentState} from 'draft-js';

import firebase from '@firebase/app'
// eslint-disable-next-line
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


const ChapterModification = ()=>{
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


    const postId = useParams()
    const [chapitre, setChapitre] = useState("")
    const [matiere, setMatiere] = useState("")
    const [chapterNumber,setChapterNumber] = useState("")
    const [chapterTitle, setChapterTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [url, setUrl] = useState("")
    
    // const ContentState = Draft.ContentState
    useEffect(()=>{
        fetch(`/api/chapterModification/${postId.id}`,{
            headers:{
                // Authorization: "Bearer " + localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setUrl(result[0].illustration)
            // document.getElementById('progressBar').value = 100
            setChapitre(result[0])
            setMatiere(result[0].subject)
            setChapterNumber(result[0].chapterNumber)
            setChapterTitle(result[0].chapterTitle)
            const coursHTML = convertFromHTML(result[0].description)
            setDesc(EditorState.createWithContent(ContentState.createFromBlockArray(coursHTML.contentBlocks, coursHTML.entityMap)))
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    const onEditorStateChangeCours = (e) => {
        setDesc(e)
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



    if(!firebase.apps.length){
        firebase.initializeApp(config)
    }

    const storage = firebase.storage()
    const submitButton = (file)=>{
        document.getElementById('buttonDeleteIllu').disabled = true
        const imageExtension = file.name.split(".")[file.name.split(".").length - 1];
        const filename = `${(Math.random().toString(36).substr(2, 13) + '-' + Math.random().toString(36).substr(2, 13)+ '-' + Math.random().toString(36).substr(2, 13)).toString()}.${imageExtension}`;
        let locationRef = storage.ref('test/' + filename)
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
    const getName = ()=>{
        const baseUrl = "https://firebasestorage.googleapis.com/v0/b/feedesmaths.appspot.com/o/"
        let imagePath = url.replace(baseUrl,"")
        const indexOfEndPath = imagePath.indexOf("?")
        imagePath = imagePath.substring(0,indexOfEndPath)
        imagePath = imagePath.replace("img%2F","")
        // console.log(imagePath)
        return imagePath;
    }

    const deleteFile = () =>{
        if(url){
            // console.log(url)
            // setUrl("")
            const imagePath = getPathStorageFromUrl()
            const desertRef = storage.ref().child(imagePath);
            desertRef.delete()
            .then(()=>{
                const url = ""
                setUrl(url)
                document.getElementById('submitButton').value = ""
                document.getElementById('progressBar').value = 0
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    const updateChapter = ()=>{
        console.log(chapitre)
        fetch('/api/updateChapter', {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization:"Bearer "+ cookies.get('jwt')
            },
            body: JSON.stringify({
                chapterId:chapitre.chapterId,
                chapterNumber,
                chapterTitle,
                description:draftToHtml(convertToRaw(desc.getCurrentContent())),
                illustration:url,
                subject:matiere
            })
        })
        .then(res => res.json())
        .then((result)=>{
            if(result.createlesson === true){
                toast.success(`${chapterTitle} updated`,{autoClose: 3000})
                history.push('/mypost')
            }
            else{
                toast.error(result.error, {autoClose: 3000})
            }
        })
        .catch(err=>{
            console.error(err)
        })  
    }

    const replaceIllustration = () =>{
        if(url){
            const imageName = getName(url)
            return(
                <div>
                    <label>precedente illustration : </label>
                    <div id="illustrationInfo">
                        <label>{`${imageName}`}</label>
                        <div>
                            <progress value="100" max="100" id="progressBar">100%</progress>    
                        </div>
                        <button id="buttonDeleteIllu" className="btn" onClick={()=>{deleteFile()}}><i className="fa fa-close"></i></button>
                    </div>
                </div>
            )   
        }
        else{
            return(
                <div className="input-group spaceAdd">
                    <div className="custom-file">
                        <input type="file" id="submitButton" onChange={(e)=>submitButton(e.target.files[0])}/>
                        <div>
                            <progress value="0" max="100" id="progressBar">0%</progress>    
                        </div>
                        <button id="buttonDeleteIllu" className="btn" onClick={()=>{deleteFile()}}><i className="fa fa-close"></i></button>
                    </div>
                </div>
            )
        }
    }

    const showIllustration = ()=>{
        if(url){
            return(
                <img className="card-img" id="modificationImageChapter" src={url} alt="Cardimagecap"></img>
            )
        }
    }


    if(chapitre){
        if(allow === true){
            return(
                <div className="form-row mcl">
                    <div className="card col add-card-Modification">
                        <h1>Modifier un chapitre</h1>
                        <div className="form-row mcl" id="spaceModification">
                            <div className="col subjectChapterModif" id="subjectChapterModification">
                                <label  id="labelChapterModification">{chapitre.subject}</label>
                            </div>
                            {/* <div className="col">
                                <select id="inputStateMatiere" className="form-control" onChange={(e)=>{setMatiere(e.target.value)}}>
                                    <option  className="defaultValue" value={chapitre.subject}>{chapitre.subject}</option>
                                    <option disabled>──────────</option>
                                    {subjects.map(subject=>{
                                        return(
                                            <option key={subject} value={subject}>{subject}</option>
                                        )
                                    })}
                                </select>
                            </div> */}
                            <div className="col">
                                <input type="number" className="form-control" placeholder="chapitre N°" id="chapterNumber"
                                    value={chapterNumber}
                                    onChange={(e) => setChapterNumber(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <input type="text" className="form-control" placeholder="Titre de la leçon" id="chapterTitle"
                                value={chapterTitle}
                                onChange={(e) => setChapterTitle(e.target.value)}
                            />
                        </div>

                        {replaceIllustration()}
                        
                        <Editor
                            editorState={desc}
                            // toolbarClassName="toolbarClassName"
                            // wrapperClassName="wrapperClassName"
                            editorClassName='editorClassName'
                            onEditorStateChange={onEditorStateChangeCours}
                        /> 
                        
                        <button type="button" className="btn btn-primary"
                                onClick={() => updateChapter()}
                        >
                            Mettre à jour
                        </button>
                    </div>
                    <div className="card col add-card-Modification">
                        <h1>Prévisualtion chapitre</h1>
                        {showIllustration()}
                        <div>
                            {
                                desc !== "" ?
                                    <InlineTex texContent={draftToHtml(convertToRaw(desc.getCurrentContent()))}/> : ""
                            }
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
export default ChapterModification