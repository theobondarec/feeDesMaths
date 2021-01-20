import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './Navbar.css';
import {UserContext} from '../../App'
import Cookies from 'universal-cookie';


// eslint-disable-next-line
import firebase from '@firebase/app'

import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

const NavBar = () =>{
    const cookies = new Cookies()
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList=()=>{
        let rang
        if(state){
            rang = state.rank
        }
        if(localStorage.getItem("user")){
            const user = JSON.parse(localStorage.getItem("user"))
            rang = user.rank
        }
        
        // fetch('/api/checkRank',{
        //     headers:{
        //         Authorization:"Bearer "+localStorage.getItem("jwt")
        //     }
        // })
        // .then(res=>res.json())
        // .then((result)=>{
        //     console.log(result.rank)
        //     rang = result.rank
        // })
        // .catch(err=>{
        //     console.log(err)
        // })

        if(rang === "student"){
            return [
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/cours">Cours</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div className="dropdown-menu dropdown_menu_navbar" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/profile">Profil</Link> {/*Avancement des cours*/}
                            <Link className="dropdown-item" to="/settings">Paramètres</Link> {/*modification mot de passe*/}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
                                cookies.remove('jwt', {path:'/'})
                                dispatch({type:"CLEAR"})
                                history.push('/login')
                                toast.info('Logged out !',{autoClose: 3000})
                            }}
                            >Logout</button>
                        </div>
                    </li>
                </div>
            ]
        }
        if(rang === "professor"){
            return[
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/cours">Cours</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div className="dropdown-menu dropdown_menu_navbar" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/createpost">Ajouter un cours</Link> {/*only if you're professor*/}
                            <Link className="dropdown-item" to="/createQuiz">Ajouter un quiz</Link> {/*only if you're professor*/}
                            <Link className="dropdown-item" to="/mypost">Mes leçons</Link> {/*only if you're professor*/}
                            <Link className="dropdown-item" to="/settings">Paramètres</Link> {/*modification mot de passe*/}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
                                cookies.remove('jwt', {path:'/'})
                                dispatch({type:"CLEAR"})
                                history.push('/login')
                                toast.info('Logged out !',{autoClose: 3000})
                            }}
                            >Logout</button>
                        </div>
                    </li>
                </div>
            ]
        }
        if(rang === "admin"){
            return[
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Accueil <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div className="dropdown-menu dropdown_menu_navbar" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/admin">Admin page</Link>
                            <Link className="dropdown-item" to="/settings">Paramètres</Link>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
                                cookies.remove('jwt', {path:'/'})
                                dispatch({type:"CLEAR"})
                                history.push('/login')
                                toast.info('Logged out !',{autoClose: 3000})
                            }}
                            >Logout</button>
                        </div>
                    </li>
                </div>
            ]
        }
        else{
            return [
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">sign up</Link>
                    </li>
                </div>
            ]
        }
    }

    return( 
        <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav_navbar" key={Math.random()}>
            <Link className="navbar-brand" 
            to={
                state?"/":"/login",
                localStorage.getItem("user")?"/":"/"
            }></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse " id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto" id="test">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}
export default NavBar