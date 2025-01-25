import express from 'express';
import 'dotenv/config';
const exp=express();

exp.get('/',(req,res)=>{
res.send(`<h1>Server is ready i ujjain</h1>`)
})

exp.get('/api/players',(req,res)=>{
const players=[
{
id:7,
playerName:"Cristiano Ronaldo",
country:"Portugal"
},
{
id:10,
playerName:"Lionel Messi",
country:"Argentina"
},
{
id:11,
playerName:"Neymar",
country:"Brazil"
},
{
id:9,
playerName:"Kylian Mbappe",
country:"France"
},
{
id:17,
playerName:"Lamine Yamal",
country:"Spain"
}
];
res.send(players);
})

const port=process.env.PORT

exp.listen(port,()=>{
console.log(`server is ready at port ;${port}`)
})