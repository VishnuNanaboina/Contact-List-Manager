const express=require('express');
const router=express.Router();
const validateToken=require("../middleware/validateTokenHandler")
const {registerUser,loginUser,currentUser}=require('../controllers/userController')
// router.post("/",(req,res)=>{
//     res.json({message:"Welcome user"});
// })
router.post("/register",registerUser);


router.post("/login",loginUser);
router.get("/current",validateToken,currentUser);
router.get("/me",validateToken,async(req,res,next)=>{
    return res.status(200).json({...req.user._doc});
})
module.exports=router;

