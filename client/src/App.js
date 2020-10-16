import React from 'react';
import NavBar from './components/Navbar'
import {BrowserRouter, Route} from 'react-router-dom'

import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Admin from './components/screens/Admin'
import Settings from './components/screens/Settings'

function App() {
  return (
    <BrowserRouter>
      {/* HEADER */}
      <NavBar />
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
      <Route path="/admin">
        <Admin />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      
      {/* FOOTER 
        Ajouter Information en footer et non en navbar
      */}
    </BrowserRouter>
  );
}

export default App;
