const {check}=require("express-validator")




const loginvalidations=[
    check('uname').not().isEmpty().withMessage("please enter the email"),check('psw').isLength({min:10}).withMessage("password must contain 10 characters")
 ]



 
const registervalidation=[
check('cno').isLength(),check('email').isEmail().withMessage("please enter valid email address"),check('uname').isLength({min:8}).withMessage("name must contain 8 characters"),check('psw').isLength({min:10}).withMessage("password must contain 10 characters")]

 

 module.exports={

loginvalidations,registervalidation

 }