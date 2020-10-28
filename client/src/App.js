import React, {useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Register from './components/screens/Register'
import Admin from './components/screens/Admin'
import Settings from './components/screens/Settings'
import Cours from './components/screens/Cours'
import Addlesson from './components/screens/Addlesson'
import Mescours from './components/screens/MesCours'
import {reducer, initialState} from './reducer/userReducer'

// {/*Pagination cours precis  ->  a suppr*/}
import CoursPrecis from './components/screens/CourPrecis'


export const UserContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", playload:user})
      // history.push('/')            if user reload go to home page
    }
    else{
      history.push('/login')          /////////////if user can access home without signin change path to '/'
    }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route exact path="/cours">
        <Cours />
      </Route>
      <Route path="/mypost">
        <Mescours />
      </Route>
      <Route path="/createpost">
        <Addlesson />
      </Route>


      // {/*pour bosser la pagination d'un cours  ->  a suppr*/}
      <Route path="/cours/:id">
        <CoursPrecis />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch]= useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        {/* HEADER */}
        <NavBar />                {/* */}

        {/*Body*/}                {/*visible que si login*/}
        <Routing />
        
        {/* FOOTER 
          Ajouter Information en footer et non en navbar
        */}
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
