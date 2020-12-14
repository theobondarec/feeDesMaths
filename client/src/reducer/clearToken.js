import {useContext}from 'react'
import {useHistory} from 'react-router-dom'
import {UserContext} from '../../App'


const {dispatch} = useContext(UserContext)
const history = useHistory()

export function testExpiredToken(){
        localStorage.clear()
        dispatch({type: "CLEAR"})
        history.push('/login')
}