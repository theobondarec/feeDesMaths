import React from 'react';
import NavBar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Admin from './components/screens/Admin'
import Settings from './components/screens/Settings'
import Cours from './components/screens/Cours'
import Addlesson from './components/screens/Addlesson'

function App() {
  return (
    <BrowserRouter>         {/*visible que si login*/}
      {/* HEADER */}
      <NavBar />                {/* */}
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/admin">       {/*only if you're admin*/}
        <Admin />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route path="/cours">
        <Cours />
      </Route>
      <Route path="/createpost">  {/*visible seulement pour rank professor*/}
        <Addlesson />
      </Route>
      
      {/* FOOTER 
        Ajouter Information en footer et non en navbar
      */}
    </BrowserRouter>
  );
}

export default App;
