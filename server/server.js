const express=require('express');
const connectDb=require('./config/dbConnection')
const cors=require('cors')

const errorHandler=require('./middleware/errorHandler')
const env=require('dotenv').config();

connectDb();
const app=express();


const port=process.env.PORT || 5000;

app.use(express.json());
app.use(require('cors')());
const contactRoutes=require('./routes/contactRoutes');
app.use('/api/contacts',contactRoutes);
const userRoutes=require('./routes/userRoutes');
app.use('/api/users',userRoutes);
app.use(errorHandler);


app.listen(port,()=>{
    console.log(`Server running on ${port}`);
    
})