import React, {useState, useEffect, useContext} from 'react'
import './Cours.css';
import {Link, useHistory} from 'react-router-dom'
import { UserContext } from '../../App'
import { InlineTex } from 'react-tex'

const Cours = ()=>{
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

    const [matiere, setMatiere] = useState("")
    const [subjects, setsubjects] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [allow, setAllow] = useState("")
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
            fetch('/getCourse',{
                headers:{
                    Authorization: "Bearer " + localStorage.getItem("jwt")
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
            fetch('/getCourseSubject',{
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


    if(data){
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
                        return(
                            <div id="user_card_course" key={item.postId}>
                            <div id="lecon" className={"card" + item.subject}>
                                <h1><font color="#E22146">{item.subject}: {item.nom}</font></h1>
                                <img className="card-img" id="img" src={item.illustration} alt="Cardimagecap"></img>
                                <div className="card-body">
                                    <InlineTex texContent={item.description}/>
                                </div>
                                    <Link to={"/cours/" +item.postId} className="btn" id="seecourse_btn">Voir le cours</Link>
                            </div>
                            </div>
                        )
                    })
                }

                    {/*10 par page, apres ajouter page navigation*/}


                </div>
                
                <nav aria-label="Page navigation example" id="nav_Cours">
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