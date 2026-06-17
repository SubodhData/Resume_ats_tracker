const dns = require('dns/promises');

const mongoose = require('mongoose')

dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect('mongodb+srv://subodhleadse_db_user:iJs7RcorYGCwTeVX@cluster0.0x54ei.mongodb.net/?w=majority&appName=Cluster0').then((res)=>{
  console.log('database connected successfull');
}).catch(err=>{
  console.log('something error',err)
})




