require('dotenv').config()
const express=require('express')
const app=express()
const port=3000



app.get('/',(req,res)=>{
res.send("Hello jiss,you are good")
})
app.get('/login',(req,res)=>{
res.send(`<h1>Jiss is learning express ${port}</h1>`)
})
app.get('/ronaldo',(req,res)=>{
res.send(`<h1>Ronaldo is from portugal</h1>`)
})
app.get('/messi',(req,res)=>{
res.send(`<h3>Messi is from argentina</h3>`)
})
app.get('/neymar',(req,res)=>{
res.send(`<h3>Neymar is from Brazil</h3>`)
})
// app.get('/github',(req,res)=>{
// res.json(gitData)
// })

app.listen(process.env.PORT,()=>{
console.log(`Watching friends ${process.env.PORT}`)
})