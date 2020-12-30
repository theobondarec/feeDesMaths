import {useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import Cookies from 'universal-cookie';

const {dispatch} = useContext(UserContext)
const history = useHistory()
const cookies = new Cookies()

export function testExpiredToken(){
        localStorage.clear()
        cookies.remove('jwt', {path:'/'})
        dispatch({type: "CLEAR"})
        history.push('/login')
}