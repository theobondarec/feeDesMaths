import React, {useState, useEffect} from 'react'
import './Pages.css'
import {Link} from 'react-router-dom'

const Cours = ()=>{
    const [data, setData] = useState([])
    useEffect(()=>{
        fetch('/cours',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setData(result.posts)
        })
    },[])
    return(
        <div>
            <h1>Cours</h1>
            <div className="lessonSelection">               {/*Dynamique en fonction des cours de la bdd*/}
                <div className="matiereSelection">
                <h2>Matieres</h2>
                    <select id="inputState" className="form-control">
                        <option defaultValue>All</option>
                        <option>Math</option>
                        <option>Physique</option>
                        <option>Anglais</option>
                    </select>
                </div>
                <div className="chapitreSelection">
                <h2>Chapitres</h2>
                    <select id="inputState" className="form-control">
                        <option defaultValue>All</option>
                        <option>Chapitre 1</option>
                        <option>Chapitre 2</option>
                        <option>Chapitre 3</option>
                        <option>Chapitre 4</option>
                        <option>Chapitre 5</option>
                    </select>
                </div>
            
            </div>
            <div className="allCard">
                {
                    data.map(item=>{
                        return(
                            <div className="card lessonCard" key={item._id}>
                                <img className="card-img imgTest" src={item.photo} alt="Cardimagecap"></img>
                                <div className="f">
                                    <div className="card-title">
                                        <h2>{item.matiere}</h2>
                                        <h2>{item.chapitre}</h2>

                                        <Link to="/modifLesson" className="btn btn-primary">Modifier</Link>        {/*MODIFIER/SUPPR juste pour rank=prof */}
                                        <a href="/" className="btn btn-primary">Supprimer</a>       {/*
                                                                                                    Page speciale modif pour les prof ?
                                                                                                    un formulaire pré remplis avec info bdd
                                                                                                    et un bouton update qui change la bdd
                                                                                                */}
                                    </div>
                                    <div className="card-body">
                                        {item.description}
                                    </div>
                                    <Link to="/cours/precis" className="btn btn-primary">Voir le cours</Link>
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

export default Cours