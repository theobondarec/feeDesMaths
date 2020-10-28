import React, {useState, useEffect, useContext} from 'react'
import './Pages.css'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'

const MesCours = ()=>{
    const [mesCours ,setCours]=useState([])
    
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result.mypost)
            setCours(result.mypost)
        })
    },[])

    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newCours = mesCours.filter(item=>{
                return item._id !== result._id
            })
            setCours(newCours)
        })
    }


    return(
        <div>
            <div>
                <h1>Mes Cours</h1>
                <h5>50 posts</h5>   
            </div>
            <div className="allCard">
                {
                   mesCours.map(item=>{
                       return(
                        <div className={"card myLessonCard"} key={item._id}>
                            <img className="card-img imgTest" src={item.photo} alt="Cardimagecap"></img>
                            <div className="f">
                                <div className="card-title">
                                    <h2>{item.chapitre}</h2>
        
                                    <Link to="/modifLesson" className="btn btn-primary">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                                                                            {/*
                                                                                                Page speciale modif pour les prof ?
                                                                                                un formulaire pré remplis avec info bdd
                                                                                                et un bouton update qui change la bdd
                                                                                            */}
                                    {/* {item.postedBy._id == state._id */}
                                    {/* && */}
                                    <button type="button" className="btn btn-outline-primary"
                                    onClick={()=>{deletePost(item._id)}}
                                    >
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z"/>
                                    </svg>
                                    </button> 
                                    {/* } */}
                                </div>
                                <div className="card-body">
                                    {item.description}
                                </div>
                                <Link to={"/cours/" +item._id} className="btn btn-primary">Voir le cours</Link>
                            </div>
                        </div>
                       )
                   }) 
                }
                {/*10 par page, apres ajouter page navigation*/}
            </div>
            
            <nav aria-label="Page navigation example">
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

export default MesCours