const express = require('express');
const cors = require('cors')

const app = express();
const PORT= 4000;
const path = require('path')
require('./conn');
app.use(express.json());
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}));
const UserRoutes= require('./Routes/user');
const ResumeRoutes= require('./Routes/resume')
app.use('/api/user', UserRoutes);
app.use('/api/resume', ResumeRoutes);

// server static files from the react app's build folder
app.use(express.static(path.join(__dirname, 'build')));

// Handle react routing, return index.html for all other requests
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "build", "index.html"));
}) 

app.listen(PORT, ()=>{
    console.log("backend is running on port", PORT)
})