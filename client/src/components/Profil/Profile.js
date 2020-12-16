import React, {useState, useEffect, useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import './profil.css'

const Profile = ()=>{

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

    return(
        <div classname="displayProfile">
            {/* <div>
                <h1>Progression des chapitres</h1>
                <Progression/>
            </div> */}
            <div>
                <h1>Notes QCM</h1>
                <div className="table-responsive">
                    <table className="table" id="tableProfile">
                        <thead>
                            <tr>
                                <th>Chapitres</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>{/*DYNAMIQUE AVEC BDD*/}
                            <tr>
                                <td>nombre complexe</td>{/*Titre qui correspond au chapitre de la bdd*/}
                                <td>20/20</td>{/*correspond au chapitre actuel de l'utilisateur dans le chapitre*/}
                            </tr>
                            <tr>
                                <td>sommes</td>
                                <td>20/20</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Profile

export const Progression = () =>{
    // mettre du code js ici si besoin


    const [subjects, setsubjects] = useState([])
    useEffect(()=>{
        fetch('/api/subjects',{
            headers:{
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result.subjects)
            setsubjects(result.subjects)
        })
        .catch(err=>{
            console.log(err)
        })
    },[])





    return(
        <div className="col-12 table-responsive displayProfile">
            <div className="subjectProfile">
                <h1>Math</h1>
                {subjects.map(item=>{
                    console.log(item)
                    return(
                        <div className="teeeet">
                            <h3>{item}</h3>
                            <div className="progress" id="progressBarLesson" style={{height: "40px"}}>
                                {/* {REFAIRE PROGRESS BAR en js} */}
                                <div className="progress-bar progress-bar-striped" style={{width: `40%`}} role="progressbar"
                                    aria-valuenow={40} aria-valuemin="0" aria-valuemax="100">Progression
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// <div className="col-12 table-responsive displayProfile">
// <div>Math
//     <div className="progress">
//         <div className="progress-bar progress-bar-striped" id="progress-bar1"  aria-valuemin="0" aria-valuemax="100">10%</div>
//     </div>
// </div>

// <div>Physique
//     <div className="progress">
//         <div className="progress-bar progress-bar-striped" id="progress-bar2"  aria-valuemin="0" aria-valuemax="100">30%</div>
//     </div>
// </div>

// <div>Elec
//     <div className="progress">
//         <div className="progress-bar progress-bar-striped" id="progress-bar3"  aria-valuemin="0" aria-valuemax="100">70%</div>
//     </div>
// </div>
// </div>


{/* <table className='table'>
    <tbody>
        <tr >
            <th>Math</th>
            <td className="progressG progress-bar progress-bar-striped" id="progress-bar1" style={{width: `20%`}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">10%</td>
        </tr>
        <tr className="progressG">
            <th>Math</th>
            <td className="progress-bar progress-bar-striped" id="progress-bar1" style={{width: `20%`}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">10%</td>
        </tr>
    </tbody>
</table> */}