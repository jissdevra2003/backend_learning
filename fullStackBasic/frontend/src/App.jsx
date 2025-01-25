import { useState } from 'react'
import './App.css'
import axios from 'axios'
import {useEffect} from 'react'


function App() {
const [players,setPlayers]=useState([])

useEffect(()=>{
axios.get('/api/players')     //proxy written in vite.config.js 
.then(function(response)
{
setPlayers(response.data)
})
.catch(function(error)
{
console.log(`Error occured:${error}`)
})

},[])





return (
<>
<h1>Basic Full stack application</h1>

{
players.map((player)=>{
return (
<div key={player.id}>
<h2>Player name :{player.playerName}</h2>
<h3>Country :{player.country}</h3>
</div>
)
})
}

</>
)
}

export default App
