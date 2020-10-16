import React from 'react'
import {Link} from 'react-router-dom'
import '../App.css'

const NavBar = () =>{
    return(
        <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <Link class="navbar-brand" to="/">Fée des maths</Link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse " id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <Link class="nav-link" to="/">Home <span class="sr-only">(current)</span></Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/cours">lessons</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/login">Login</Link>
                    </li>
                    <li class="nav-item">
                        <Link class="nav-link" to="/signup">sign up</Link>
                    </li>
                    <li class="nav-item dropdown">
                        <Link class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        profile
                        </Link>
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Link class="dropdown-item" to="/profile">My profile</Link> {/*Avancement des cours*/}
                            <Link class="dropdown-item" to="/admin">Admin page</Link> {/*only if you're admin*/}
                            <Link class="dropdown-item" to="/settings">Settings</Link> {/*modification mot de passe*/}
                            <div class="dropdown-divider"></div>
                            <Link class="dropdown-item" to="#">sign out</Link>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar