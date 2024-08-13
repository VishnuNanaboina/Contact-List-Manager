
const asyncHandler=require('express-async-handler')
const User=require("../models/userModel")
const bcrypt=require("bcrypt");

const jwt=require('jsonwebtoken')

//@desc register a User
//@route POST /api/users/Register
//@access public
let current={};

const registerUser= asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password)
    {
        res.status(400);
        throw new Error('All fields are mondatory');
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable)
    {
        res.status(400);
        throw new Error("user already exists")
    }
    // hash password
    const hashedPassword=await bcrypt.hash(password,10);
    console.log("hashed password is",hashedPassword);
    console.log({username},{email},{password});
    const user=await User.create({
        username,
        email,
        password:hashedPassword,
    });
    // current=null;
    console.log(`user is created ${user}`);
    if(user)
    { 
        res.status(201).json({_id:user.id,email:user.email});
    }
    else{
        res.status(400);
        throw new Error("user data is not valid");
    }
    res.json({message:"Register the user"});
})


//@desc Login a User
//@route POST /api/users/login
//@access public
const loginUser= asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    //current={};
    if(!email || !password)
    {
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const user=await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password)))
    {
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:"200m"}
        );
        // console.log({user});
        current=user;
        const us={...user._doc,password:undefined}
        // console.log(us);
        res.status(200).json({accessToken,user});
    }
    else
    {
        res.status(401);
        throw new Error("email or password not valid")
    }
    // res.json({message:"login user"});
})


//@desc current User info
//@route GET /api/users/current
//@access private
const currentUser= asyncHandler(async (req,res)=>{
    console.log("current di called dick",current);
    return res.json(current);
})
module.exports={registerUser,loginUser,currentUser};