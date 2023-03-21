


//login
//register





const {validationResult}=require("express-validator");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require('dotenv').config();
const users=require("../models/user");







//this is get request for login form,display form 
const login=(req,res)=>{
   const title="user login";
   res.render('assests/login',{title,login:false});
}


//this is the GET req for the registration form, display form
const register=(req,res)=>{
    const title="create new account";
    res.render('assests/register',{title,inputs:req.body,login:false});

}








//this is post req for registration form, when user fill the form and submit the form.




const postregistration=async(req,res)=>{
   const title="registration";
    const errors=validationResult(req);
    const name=req.body.uname;
    const email=req.body.email;
    const password=req.body.psw;
    const phone=req.body.cno;
     if(!errors.isEmpty()){
       res.render("assests/register",{title,errors:errors.array(),login:false});
    
 }
    else{
    
    try{
    
    const emailcheck= await users.findOne({email:email})
    
    if(emailcheck==null){
    //send data to database if email does not exist
    const salt =await bcrypt.genSalt(10);
    const hashedpassword=await bcrypt.hash(password,salt);
     const data=new users({
   name:name,email:email,phone:phone,password:hashedpassword
   })
    const datasent=await data.save().then(user=>{console.log(user)}).catch(err=>{console.log(err.message)})
 res.render('assests/login',{title,inputs:req.body,login:false});
        }else{
       //if email exist then again render the resister wit error message
       res.render('assests/register',{title,errors:[{msg:"the email already exists in database"}],login:false})
       
       
}
    
    }catch(err){
     console.log(err.message);
    
    }
    
    }
      //array() converts the object/json in to array
       // for each loop used to print array elements
   }













const postloginform=async(req,res)=>{
    const errors=validationResult(req);
    const title="login"
    const name =req.body.uname.replace(/\s/g, ''); ;
    const password =req.body.psw;
    
    if(!errors.isEmpty()){
    res.render("assests/login",{errors:errors.array(),title,login:false});
    }else{
    
    console.log(name);
    console.log(password)
       const checkemail=await users.findOne({email:name})
       console.log("email"+checkemail)
       
       if(checkemail==null){
         
       console.log(checkemail);
       res.render("assests/login",{errors:[{msg:"sorry email does not exist"}],title,login:false})
       }
       
       else{
          const useremail=checkemail._id;
          const userpassword=checkemail.password;
          const verifypassword=await bcrypt.compare(password,userpassword);
          console.log(verifypassword);
          
           if(verifypassword==false){
    
             res.render("assests/login",{errors:[{msg:"password does not match"}],title,login:false})
    
    
           }else{
    //Create token for authorization
    const token=jwt.sign({USERID:useremail},process.env.jwtkey,{expiresIn:"7d"})
    // ceate session variable
    
    req.session.user=token;
    console.log(token);
    res.redirect("/profile");
    }
          
       }
       
    
    
    
    
    
    }
    





}






module.exports={
login,register,postregistration,postloginform
}