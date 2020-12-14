import React, {useState, useEffect, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'
import './MesCours.css';
import { InlineTex } from 'react-tex'
import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const MesCours = ()=>{
    const [mesCours ,setCours]=useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [allow, setAllow] = useState([])

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

    useEffect(()=>{
        fetch('/getMyPost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
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

    const deletePost = (postId)=>{
        fetch(`/deletepostById/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            if(result.allow === true){
                const newCours = mesCours.filter(item=>{
                    // console.log(item)
                    return item.postId !== postId
                })
                // toast(result.message)
                toast.success(result.message, {autoClose: 3000})
                // window.alert(result.message)

                setCours(newCours)
            }
            else{
                // toast(result.error)
                toast.error(result.error, {autoClose: 3000})
                // window.alert(result.error)
            }
        })
    }

    if(mesCours){
        if(allow === true){
            return(
                <div className="col-10 offset-1" id="mescours">
                    <div>
                        <h1>Mes Cours</h1>
                        <h5>{mesCours.length} posts</h5>
                    </div>
                    <div className="allCard">
                        {
                        mesCours.map(item=>{
                            return(
                                <div className="card" id="myLessonCard" key={item.postId}>
                                    {/* <img className="card-img imgTest" src={item.photo} height="300px" width="100px" alt="Cardimagecap"></img> */}
                                    <div className="f">
                                        <div className="card-title" id="title">
                                            <h2>{item.lessonTitle}</h2>
                
                                            <Link to={"/modification/"+item.postId} className="btn warningMesCours">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                                                                                    {/*
                                                                                                        Page speciale modif pour les prof ?
                                                                                                        un formulaire pré remplis avec info bdd
                                                                                                        et un bouton update qui change la bdd
                                                                                                    */}
                                            <button type="button" className="btn warningMesCours"
                                            onClick={()=>{deletePost(item.postId)}}
                                            >
                                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                            </svg>
                                            </button> 
                                            {/* } */}
                                        </div>
                                        <div className="card-body">
                                            <InlineTex texContent={item.lesson}/>
                                        </div>
                                        <Link to={"/lesson/"+item.postId} id="boutonMesCours" className="btn btn-primary">Voir le cours</Link>
                                    </div>
                                </div>
                            )
                        }) 
                        }
                        {/*10 par page, apres ajouter page navigation*/}
                    </div>
                    
                    <nav aria-label="Page navigation example" id="nav_mesCours">
                        <ul className="pagination justify-content-center">
                            <li className="page-item disabled">
                            <a className="page-link" href="/" tabIndex="-1">Previous</a>
                            </li>
                            <li className="page-item"><a className="page-link" href="/">1</a></li>
                            <li className="page-item"><a className="page-link" href="/">2</a></li>
                            <li className="page-item"><a className="page-link" href="/">3</a></li>
                            <li className="page-item">
                            <a className="page-link" href="/">Next</a>
                            </li>
                        </ul>
                    </nav>
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