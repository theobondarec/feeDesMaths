import React, {useState, useEffect, useContext}from 'react'
import {useHistory} from 'react-router-dom'
import { UserContext } from '../../App'
import './Pages.css'

const Admin = ()=>{
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()

    /// SI tokenExpired => go to login page
    const clearExpiredToken = (errorCode)=>{
        if(errorCode === 'auth/id-token-expired'){
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/login')
        }
    }

    useEffect(()=>{
        fetch('/admin',{
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            clearExpiredToken(result.code)
            setData(result)
        })
    },[])


    let idValue, newRank
    const rankModification = ()=>{
        const inputState = document.getElementById("inputState")
        if(inputState){
            newRank = inputState.options[inputState.selectedIndex].value
        }
        const inputId = document.getElementById("inputId")
        if(inputId){
            idValue = inputId.value
            document.getElementById('inputId').value = "";
        }
        fetch(`/admin/rankChange`,{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                userId:idValue,
                newRank
            })
        }).then(res=>res.json())
        .then((result)=>{
            clearExpiredToken(result.code)
            setData(result)
        })
        .catch(err=>{
            console.error(err)
        })
    }

    return(
        <div className="adminClass">
            <div>
                <h1>Utilisateurs</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>isenId</th>
                            <th>userId</th>
                            <th>rank</th>
                        </tr>
                    </thead>
                    {/* data.map=>{} */}

                    
                    <tbody>{/*info de la BDD afficher 10personnes et pagesuivante en bas du tableau*/}
                    {data.map(item=>{
                        return(
                            <tr key={item.userId}>
                                <td>{item.isenId}</td>
                                <td>{item.userId}</td>
                                <td>{item.rank}</td>
                            </tr>
                        )
                    })}
                    </tbody>


                </table>
            </div>
            <div className="card modif-card">                           {/*Formulaire modification rank*/}
                <h1>Modification du rank</h1>
                <div className="formulaire">
                    <input 
                    type="text"
                    placeholder="userId"
                    id="inputId"
                    />
                    <select id="inputState" className="form-control">
                        <option value="student" defaultValue="student">Student</option>
                        <option value="professor">Professor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="button" className="btn btn-primary" onClick={()=>rankModification()}>Modifier</button>
            </div>
        </div>
    )
}

export default Admin