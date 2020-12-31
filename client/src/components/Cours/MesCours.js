import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'
import './MesCours.css';
import Cookies from 'universal-cookie';
import { InlineTex } from 'react-tex'
import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
// import { post } from '../../../../server/routes/course/getMyCourse';
toast.configure()

const MesCours = ()=>{
    const cookies = new Cookies()
    const [mesCours ,setCours]=useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState("")

    // eslint-disable-next-line
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

    useEffect(()=>{
        fetch('/api/getMyPost',{
            headers:{
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            if(result.allow === true){
                setCours(result.mesCours)
                setAllow(result.allow)
            }
            else{
                setErrorMessage(result.error)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])

    const [chapitres ,setChapitres]=useState([])
    useEffect(()=>{
        fetch('/api/getMyChapter',{
            headers:{
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            // setChapitres(result.mesChapitre)
            if(result.allow === true){
                // console.log(result.mesChapitre)
                setChapitres(result.mesChapitre)
                setAllow(result.allow)
            }
            else{
                setErrorMessage(result.error)
            }
        })
        .catch(err=>{
            console.log(err)
        })
    },[])


    const deletePost = (postId, index)=>{
        fetch(`/api/deletepostById/${postId}`,{
            method:"delete",
            headers:{
                // Authorization:"Bearer "+localStorage.getItem("jwt")
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then((result)=>{
            if(result.allow === true){
                const newCours = mesCours.filter(item=>{
                    return item.lessonId !== postId
                })
                toast.success(result.message, {autoClose: 3000})
                setCours(newCours)
                closePopUp(index)

            }
            else{
                toast.error(result.error, {autoClose: 3000})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deleteChapter = (myChapterId,index)=>{
        // console.log(myChapterId)
        fetch(`/api/deleteChapterById/${myChapterId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+ cookies.get('jwt')
            }
        }).then(res=>res.json())
        .then((result)=>{
            if(result.allow === true){
                const newChapter = chapitres.filter(item=>{
                    return item.chapterId !== myChapterId
                })
                toast.success(result.message, {autoClose: 3000})
                setChapitres(newChapter)
                // 
                closePopUpChap(index)
            }
            else{
                toast.error(result.error, {autoClose: 3000})
            }
        })
        .catch(err=>{
            console.log(err)
        }) 
    }

    const popUpDel = (index)=>{
        const modal = document.getElementById(`popUpDel${index}`);
        modal.style.display = "block";
    }
    const closePopUp = (index)=>{
        const modal = document.getElementById(`popUpDel${index}`);
        modal.style.display = "none";
    }

    const popUpDelChap = (index)=>{
        const modal = document.getElementById(`popUpDelChap${index}`);
        modal.style.display = "block";
    }
    const closePopUpChap = (index)=>{
        const modal = document.getElementById(`popUpDelChap${index}`);
        modal.style.display = "none";
    }
    window.onclick = function(event){
        const chapitresSize = chapitres.length
        var tab=[]
        for(var i =0; i<chapitresSize; i++){
            tab[i] = document.getElementById(`popUpDelChap${i}`)
        }
        for(var i =0; i<chapitresSize; i++){
            if (event.target == tab[i]) {
                tab[i].style.display = "none";
            }
        }

        const mesCoursSize = mesCours.length
        var tabLesson=[]
        for(var i =0; i<mesCoursSize; i++){
            tabLesson[i] = document.getElementById(`popUpDel${i}`)
        }
        for(var i =0; i<mesCoursSize; i++){
            if (event.target == tabLesson[i]) {
                // console.log("click")
                tabLesson[i].style.display = "none";
            }
        }
    }

    const showLessons = ()=>{
        if(mesCours){
            return(
                <div id="mescours">
                    <div className="titleXsize">
                        <h1>Mes leçons</h1>
                        <h5 className="size">{mesCours.length} leçons</h5>
                    </div>
                    <div className="allCard">
                        {
                        mesCours.map((item, index)=>{
                            // console.log(item)
                            return(
                                <div className="card" id="myLessonCard" key={item.lessonId}>
                                    <div className="f">
                                        <div className="card-title" id="title">
                                            <h2>{item.lessonTitle}</h2>
                
                                            <Link to={"/modification/"+item.lessonId} className="btn warningMesCours">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                            <button type="button" className="btn warningMesCours"
                                            /*onClick={()=>{deletePost(item.lessonId)}}*/
                                            onClick={()=>{popUpDel(index)}}
                                            >
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                            </svg>
                                            </button> 
                                            <div id={`popUpDel${index}`} className="popUpDel">
                                                <div className="card">
                                                    <span className="close" onClick={()=>{closePopUp(index)}}>&times;</span>
                                                    <h1 className="card-title">êtes-vous sûr de vouloir supprimer {item.lessonTitle} ?</h1>
                                                    <button type="button" className="btn warningMesCours"
                                                    onClick={()=>{deletePost(item.lessonId, index)}}
                                                    >
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                                    </svg>
                                                    </button> 
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <InlineTex texContent={item.lessonContent}/>
                                        </div>
                                        <Link to={"/lesson/"+item.lessonId} id="boutonMesCours" className="btn warningMesCours">Voir la leçon</Link>
                                    </div>
                                </div>
                            )
                        }) 
                        }
                        {/*10 par page, apres ajouter page navigation*/}
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1>Vous n'avez pas de lecon</h1>
                </div>
            )
        }
    }

    const showChapter = ()=>{
        if(chapitres){
            return(
                <div id="mesChapitres">
                    <div className="titleXsize">
                        <h1>Mes chapitres</h1>
                        <h5 className="size">{chapitres.length} chapitres</h5>
                    </div>
                    <div className="allCard">
                        {
                        chapitres.map((item,index)=>{
                            // console.log(index, ": ", item)
                            return(
                                <div className="card" id="myLessonCard" key={item.chapterId}>
                                    <div className="f">
                                        <div className="card-title" id="titleMyPost">
                                            <h2>{`${item.chapterNumber}: `} {item.chapterTitle}</h2>


                                            {/*  */}
                                            <Link to={"/modificationChapter/"+item.chapterId} className="btn warningMesCours">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                            {/*  */}


                                            <button type="button" className="btn warningMesCours"
                                            /*onClick={()=>{deletePost(item.lessonId)}}*/
                                            onClick={()=>{popUpDelChap(index)}}
                                            >
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                            </svg>
                                            </button>

                                            <div id={`popUpDelChap${index}`} className="popUpDelChap">
                                                <div className="card">
                                                    <span className="close" onClick={()=>{closePopUpChap(index)}}>&times;</span>
                                                    <h1 className="card-title">êtes-vous sûr de vouloir supprimer {item.chapterTitle}</h1>
                                                    <button type="button" className="btn warningMesCours"
                                                    onClick={()=>{deleteChapter(item.chapterId, index); /*console.log("chapterID moment input in function : ",item.chapterId)*/}}
                                                    >
                                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                                    </svg>
                                                    </button> 
                                                </div>
                                            </div>
                                            {/*  */}




                                        </div>
                                        <div className="card-body">
                                            <InlineTex texContent={item.description}/>
                                        </div>
                                        <Link to={"/cours/"+item.chapterId} id="boutonMesCours" className="btn warningMesCours">Voir la leçon</Link>
                                    </div>
                                </div>
                            )
                        }) 
                        }
                        {/*10 par page, apres ajouter page navigation*/}
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h1>Vous n'avez pas de lecon</h1>
                </div>
            )
        }
    }


    const displayChapter = ()=>{
        document.getElementById("myLesson").style.display = "none"
        document.getElementById("myChapter").style.display = "block"
    }
    const displayLesson = ()=>{
        document.getElementById("myLesson").style.display = "block"
        document.getElementById("myChapter").style.display = "none"
    }

    if(mesCours || chapitres){
        if(allow === true){
            return(
                <div className="col-10 offset-1" id="myPosts">
                    <div className="card">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <div className="navbar-nav">
                                <button className="btn btn-sm" type="button" onClick={()=>{displayLesson()}}>Leçons :</button>
                                <button className="btn btn-sm" type="button" onClick={()=>{displayChapter()}}>Chapitres :</button>
                            </div>
                        </nav>
                        <div className="card-body" id="myLesson">
                            {showLessons()}
                        </div>
                        <div className="card-body" id="myChapter">
                            {showChapter()}
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

export default MesCours