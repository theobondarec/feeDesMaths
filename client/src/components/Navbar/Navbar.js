import React, {useContext, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import './Navbar.css';
import {UserContext} from '../../App'


import firebase from '@firebase/app'


import {toast} from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
toast.configure()

// const config = {
//     "apiKey": process.env.REACT_APP_API_KEY,
//     "authDomain": process.env.REACT_APP_API_authDomain,
//     "databaseURL": process.env.REACT_APP_API_databaseURL,
//     "projectId": process.env.REACT_APP_API_projectId,
//     "storageBucket": process.env.REACT_APP_API_storageBucket,
//     "messagingSenderId": process.env.REACT_APP_API_messagingSenderId,
//     "appId": process.env.REACT_APP_API_appId,
//     "measurementId": process.env.REACT_APP_API_measurementId
// }

const NavBar = () =>{

    // let rang
    // if(!firebase.apps.length){
    //     firebase.initializeApp(config)
    // }
    // const idToken = localStorage.getItem("jwt")
    // console.log(idToken.claims.rank)

    // firebase.auth().getIdTokenResult()
    // .then((idToken)=>{
    //     console.log(idToken.rank)
    // })
    // firebase.getAuthTokenClaims()

    

    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList=()=>{
        var rang
        if(state){
            rang = state.rank
            // console.log(rang)
        }



        
        if(localStorage.getItem("user")){
            const user = JSON.parse(localStorage.getItem("user"))
            rang = user.rank
        }




        if(rang === "student"){
            return [
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/cours">Cours</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div className="dropdown-menu dropdown_menu_navbar" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/profile">My profile</Link> {/*Avancement des cours*/}
                            <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
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
            // console.log("PROFESSOR")
            return[
                // key={Math.random()}
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
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
                            <Link className="dropdown-item" to="/mypost">Mes cours</Link> {/*only if you're professor*/}
                            <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
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
            // console.log("ADMIN")
            return[
                <div key={Math.random()} className="options_navbar">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link to="/profile" className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div className="dropdown-menu dropdown_menu_navbar" aria-labelledby="navbarDropdown">
                            <Link className="dropdown-item" to="/admin">Admin page</Link> {/*only if you're admin*/}
                            <Link className="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" 
                            onClick={()=>{
                                localStorage.clear()
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
            return [                //SI RELOAD la page on tombe comme si aucune info en localStorage
                ////Uncom if CAN ACCESS TO HOME
                // <li className="nav-item">
                //     <Link className="nav-link" to="/cours">Home <span className="sr-only">(current)</span></Link>
                // </li>,
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
            }>Fée des maths</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse " id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto" id="test">
                    {renderList()}                          {/*WARNING BECAUSE OF THIS LINE*/}
                </ul>
            </div>
        </nav>
    )
}
export default NavBar