import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import Footer from "./components/Footer/Footer";
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'


import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';


import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Profile from './components/Profil/Profile'
import Register from './components/Register/Register'
import Admin from './components/Admin/Admin'
import Settings from './components/Profil/Settings'
import Cours from './components/Cours/Cours'
import Addlesson from './components/Cours/Addlesson'
import Mescours from './components/Cours/MesCours'
import Juridique from './components/Juridique/Juridique'
import LeconPrecise from './components/Cours/LeconPrecise'
import Modification from './components/Cours/Modification'
import {reducer, initialState} from './reducer/userReducer'
import Addquiz from './components/Cours/AddQuiz'
import CoursPrecis from './components/Cours/CourPrecis'
import './App.css'


export const UserContext = createContext()

const Routing = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            dispatch({type: "USER", playload: user})
        } else {
            history.push('/login')
        }
    }, [])

    return (
        <Switch>
            <PublicRoute restricted={false} component={Home} path="/" exact />
            <PublicRoute restricted={false} component={Juridique} path="/juridique" />
            <PublicRoute restricted={false} component={Settings} path="/settings" exact />

            <PublicRoute restricted={true} component={Login} path="/login" exact />
            <PublicRoute restricted={true} component={Register} path="/register" exact />

            <PrivateRoute component={Profile} path="/profile" exact />
            <PrivateRoute component={Admin} path="/admin" exact />
            <PrivateRoute component={Cours} path="/cours" exact />
            <PrivateRoute component={Mescours} path="/mypost" exact />
            <PrivateRoute component={Addlesson} path="/createpost" exact />
            <PrivateRoute component={CoursPrecis} path="/cours/:id" />
            <PrivateRoute component={LeconPrecise} path="/lesson/:id"  />
            <PrivateRoute component={Modification} path="/modification/:id" />
            <PrivateRoute component={Addquiz} path="/createQuiz" exact />
            {/*
            <Route exact path="/juridique">
                <Juridique/>
            </Route>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route path="/settings">
                <Settings/>
            </Route>
            <Route path="/login">
                <Login/>
            </Route>
            <Route path="/register">
                <Register/>
            </Route>
            <Route path="/profile">
                <Profile/>
            </Route>
            <Route path="/admin">
                <Admin/>
            </Route>
            <Route exact path="/cours">
                <Cours/>
            </Route>
            <Route path="/mypost">
                <Mescours/>
            </Route>
            <Route path="/createpost">
                <Addlesson/>
            </Route>
            <Route path="/cours/:id">
                <CoursPrecis/>
            </Route>
            <Route path="/lesson/:id">
                <LeconPrecise />
            </Route>
            <Route path="/modification/:id">
                <Modification />
            </Route>
            <Route path='/createQuiz'>
                <Addquiz />
            </Route>
            <Route path='/quiz'>
                <Quiz />
            </Route>
            */}
        </Switch>
    )
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <UserContext.Provider value={{state, dispatch}}>
            <BrowserRouter>
                <div className="content">
                    <Header/>
                    <NavBar/>
                    <Routing/>
                </div>
                <div className="footer">
                    <Footer/>  
                </div>
            </BrowserRouter>
        </UserContext.Provider>
    );
}

export default App;
