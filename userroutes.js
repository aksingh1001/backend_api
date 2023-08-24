const express=require("express");
const router=express.Router()
const {registerUser,loginUser,updateUser,deleteUser,forgetPassword} =require("../Controller/UserController")


router.post('/user',registerUser);
router.get('/login',loginUser);
router.put('/updateUser/:userid',updateUser);
router.delete('/delete/:userid',deleteUser)
router.post('/forgot-password',forgetPassword)


module.exports=router;