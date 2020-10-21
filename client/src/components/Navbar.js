import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
import '../App.css'

const NavBar = () =>{

    const {state, dispatch} = useContext(UserContext)
    const renderList=()=>{
        var rang = null
        if(state){
            rang = state.rank
            // console.log(rang)
        }

        if(rang === "student"){                  /////A FAIRE EN FONCTION DU RANK => state.rank === "student" ????????
            return [    //If login as STUDENT
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                </li>,
                <li className="nav-item">
                    <Link className="nav-link" to="/cours">Cours</Link>
                </li>,
                <li className="nav-item dropdown">
                    <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    profile
                    </Link>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/profile">My profile</Link> {/*Avancement des cours*/}
                        <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="#">sign out</Link>
                    </div>
                </li>
            ]
        }
        if(rang === "professor"){
            // console.log("PROFESSOR")
            return[
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                </li>,
                <li className="nav-item">
                    <Link className="nav-link" to="/cours">Cours</Link>
                </li>,
                <li className="nav-item dropdown">
                    <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    profile
                    </Link>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/createpost">Ajouter un cours</Link> {/*only if you're professor*/}
                        <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="#">sign out</Link>
                    </div>
                </li>
            ]
        }
        if(rang === "admin"){
            // console.log("ADMIN")
            return[
                <li className="nav-item">
                    <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                </li>,
                <li className="nav-item dropdown">
                    <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    profile
                    </Link>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <Link className="dropdown-item" to="/admin">Admin page</Link> {/*only if you're admin*/}
                        <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item" to="#">sign out</Link>
                    </div>
                </li>
            ]
        }
        else{
            return [
                ////Uncom if CAN ACCESS TO HOME
                // <li className="nav-item">
                //     <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                // </li>,
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>,
                <li className="nav-item">
                    <Link className="nav-link" to="/register">sign up</Link>
                </li>
            ]
        }
    }

    return(
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to={state?"/":"/login"}>Fée des maths</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse " id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default NavBar