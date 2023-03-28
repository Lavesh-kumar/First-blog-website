const express=require("express");
const {check,validationResult, Result}=require("express-validator");
const db=require("../models/db");
const { urlencoded } = require("express");
const path = require('path');
const customersupport=require("../models/customersupport");

require('dotenv').config();
const {auth}=require("../middlewares/auth")
const {stoplogin}=require("../middlewares/auth")
const formidable = require('formidable');
const nodemailer = require("nodemailer");
const fs=require('fs');





const users=require("../models/user");
const profilephoto = require("../models/profilephoto");
const posts=require("../models/post");
const moredetail=require("../models/moredetail")






const {login,register,postregistration,postloginform}=require("../controllers/usercontroller")
const{registervalidation,loginvalidations}=require("../validations/uservalidations");
const {profile,logout}=require('../controllers/UserHomePageControllers');
const {submitpostform,myposts,postdetail,updatepost,submitforupdate,deletepost}=require("../controllers/Postcontrollers")














//router is builten middleware in express js 
const router=express.Router();



//user routes  (logon and register)
router.get("/",stoplogin,(req,res)=>{res.render("assests/login",{title:"login",login:"false"})})
router.get("/login",stoplogin,login)//display login form page through ejs view engine
router.get("/register",stoplogin,register)//display register form page
router.post("/registration",registervalidation,postregistration)//post register form
router.post("/postlogin",loginvalidations,postloginform);//post login form

//user profile home page routes , when user successfully create account, it will redirect here  
router.get("/profile/:page",auth,profile)
router.get('/profile',(req,res)=>{res.redirect('/profile/1')})
router.get("/logout",logout)

//post routes, user can create post,update,delete,view
router.get("/createpost",auth,(req,res)=>{res.render("assests/postform",{login:true})}) //render create post/blog form
router.post("/submitpostform",auth,submitpostform)  //submit post/blog to database
router.get('/myposts/:page',auth,myposts)
router.get('/myposts',auth,async(req,res)=>{res.redirect('/myposts/1')});
router.get("/postdetail/:id",auth,postdetail)
router.get('/updatepost/:id',auth,updatepost)
router.post('/submitforupdate',[check('title').not().isEmpty().withMessage("please enter the title"),check('postblog').isLength({min:10}).withMessage("enter post ")],auth,submitforupdate)
router.get("/deletepost/:id",auth,deletepost)











router.get("/uploadprofile",auth,async(req,res)=>{
const id=req.id;
const existphoto=await profilephoto.findOne({userID:id})
console.log(existphoto)




      res.render("assests/photouploader",{login:true,existphoto})   
      })
   




      router.post("/postprofile",auth,(req,res)=>{

         const forms = formidable();
         forms.parse(req, async(err, fields, files) => {
      
if(files.length!==0){
   console.log(files);    
   

const imagename=files.profileimage.originalFilename;
const split=imagename.split(".");
const imageext=split[split.length-1].toUpperCase();

files.profileimage.originalFilename=uuidv4()+'.'+imageext;
const oldpath=files.profileimage.filepath;


 console.log( path.join(__dirname, '../views/profiles'))


const newpath=path.join(__dirname, '../views/profiles/')+files.profileimage.originalFilename;




fs.readFile(oldpath,(err,data)=>{

if(!err){

      fs.writeFile(newpath,data,(err)=>{

if(!err){
    fs.unlink(oldpath,(err)=>{

    })
}
   })}

})






const id=req.id;
const data=await users.findOne({_id:id})


const name=data.name

const userid=data._id;



const photo=new profilephoto({

userID: userid,
name:name,
userimage:files.profileimage.originalFilename


});

const savedimage=await photo.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})





res.redirect('/uploadprofile')




   





}
else{

   res.send("Not uploaded and try again")


}
   
                     })
         })








         router.post("/updateprofilephoto",auth,(req,res)=>{

console.log("req came")

            const forms = formidable();
            forms.parse(req, async(err, fields, files) => {
         
   if(files.length!==0){
      console.log(files);    
      
   
   const imagename=files.profileimage.originalFilename;
   const split=imagename.split(".");
   const imageext=split[split.length-1].toUpperCase();
   
   files.profileimage.originalFilename=uuidv4()+'.'+imageext;
   const oldpath=files.profileimage.filepath;

   
 console.log( path.join(__dirname, '../views/profiles'))

   const newpath=path.join(__dirname, '../views/profiles/')+files.profileimage.originalFilename;
   
   
   
   
   fs.readFile(oldpath,(err,data)=>{
   
   if(!err){
   
         fs.writeFile(newpath,data,(err)=>{
   
   if(!err){
       fs.unlink(oldpath,(err)=>{
   
       })
   }
      })}
   
   })
   
   
   
   const id=req.id;
   
   const filter = { userID: id };
   const updateimage = { userimage: files.profileimage.originalFilename };
   const updatephoto=await profilephoto.findOneAndUpdate(filter,updateimage)
   
   
   
   

   
   
   
   res.redirect('/uploadprofile')
   
   
   
   
      
   
   
   
   
   
   }
      





         
           
            })
         





         })


          









         router.get("/customersupport",auth,(req,res)=>{
            res.render("assests/customersupport",{login:true,title:'customer support'})   
           })
        

           router.post("/supportmessage",auth,async(req,res)=>{






            const id=req.id;
            const data=await users.findOne({_id:id})
            const message=req.body.message;
            const reason =req.body.reason;
            
            const name=data.name;
            const email=data.email;
         
         
            
      


            console.log(process.env.email)

            //step 1
            let transporter = nodemailer.createTransport({
               service:'gmail',
               auth: {
                 user:'', // generated ethereal user
                 pass: 'gyegiwtbyxsuwqai' // generated ethereal password
               },
             });



        //step2
        let mailoptions={


         from: '', // sender address
         to: email, // list of receivers
         subject:"hey!"+name +"✔ we are working on your request", // Subject line
         //text: "thanks for contacting bloging.pk ", // plain text body
         html: `"<h2>thanks ${name} for contacting bloging.pk. we are working on your req and respond you as soon as possible .</h2>"`, // html body

        }




transporter.sendMail(mailoptions,(err,info)=>{


   if(err){
      console.log(err)
   }
   else{

      console.log("message sent!!!")
   }
})







const savecs=new customersupport({
   
   userID:id,
      name:name,
      message:message,
      reason:reason
     
   
   
   })
   
const cs=await savecs.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})













     


            res.redirect('/profile')
           })





           router.get("/settings",auth,(req,res)=>{
            res.redirect('/uploadprofile')   
           })


















router.get("/userprofilepage/:id",auth,async(req,res)=>{



   const id=req.params.id;
console.log(id);


   const userdata=await users.findOne({_id:id});
   
   const totalposts=await posts.find({userID:id}).limit(2);
console.log(totalposts);
 

const countposts=await posts.find({userID:id}).countDocuments();
console.log(countposts);



   const userprofile=await profilephoto.findOne({userID:id});

   console.log(userprofile);


   const addmoredata=await moredetail.findOne({userID:id})

   console.log(path.join(__dirname, '../views/assests/images'));

const loggeduser=req.id;

res.render("assests/userprofilepage",{login:true,userdata,userprofile,countposts,totalposts,addmoredata,loggeduser,id})


})





router.get("/userprofilepage",auth,async(req,res)=>{


   const id=req.id;
res.redirect(`/userprofilepage/${id}`)   
  })

   

router.get("/verifyaccount",auth,async(req,res)=>{
const id=req.id;
const userdata=await users.findOne({_id:id})









          //step 1
            let transporter = nodemailer.createTransport({
               service:'gmail',
               auth: {
                 user:'', // generated ethereal user
                 pass: 'gyegiwtbyxsuwqai' // generated ethereal password
               },
             });



        //step2
        let mailoptions={


         from: '', // sender address
         to:userdata.email, // list of receivers
         subject:"hey!"+userdata.name+"verify your account ✔ ", // Subject line
         //text: "thanks for contacting bloging.pk ", // plain text body
         html: `<h2>hey! ${userdata.name} welcome bloging.pk<br>
          please click the link below to verify your account here</h2><br>
          <a href="http://localhost:5000/verifyaccount/${userdata._id}" style="text-decoration: none;"><button class="btn btn-danger" class="desc-stat">verifey </button></a>
          `, // html body

        }




transporter.sendMail(mailoptions,(err,info)=>{


   if(err){
      console.log(err)
   }
   else{

      console.log("message sent!!!")
      
   }


res.redirect('/userprofilepage')

})











  })








  router.get("/verifyaccount/:id",auth,async(req,res)=>{

   const id=req.params.id

   try{
   const userdata=await users.findOne({_id:id})
   if(userdata!==null){


const verify=await users.findByIdAndUpdate(id,{verify:"verified"});
console.log(verify)









      res.render("assests/verifymessage",{userdata})
      }
   
   }
   catch(err){

      res.send("we could not verify your account");
   }
   

  })


//display add more detail form
  
  router.get("/addinfo",auth,async(req,res)=>{

const id =req.id
   const addmoredata=await moredetail.findOne({userID:id})

   

   res.render("assests/aboutuser",{login:true,addmoredata});   
  })




//recieve the data of user here
  
  router.post("/userinfo",auth,async(req,res)=>{
   const occupation=req.body.accupation

   const message=req.body.message;
   console.log(occupation+message)


   const userid=req.id;
   

const userdetail=new moredetail({

   userID: userid,
   occupation:occupation,
   about:message
   
   
   });
   
   const savedetails=await userdetail.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})

   res.redirect("/addinfo")
  })










//update the userinfo here 


  router.post("/updateuserinfo",auth,async(req,res)=>{

 const accupation=req.body.accupation;
 const message=req.body.message;
 const id=req.id;


 try{

   const data=await moredetail.findOneAndUpdate({userID:id,about:message,occupation:accupation})
 }catch(err){

res.send("data could not updated please try again")
 }





   res.redirect("/addinfo")   
  })






  router.get("/changeusername",auth,async(req,res)=>{
   const id =req.id;
   const user =await users.findOne({_id:id})
    console.log(user.name);
   res.render("assests/changeusername",{login:true,user})   
  })


router.post('/updateusername',auth,async(req,res)=>{
const username=req.body.term;




const id =req.id;
console.log(id)
console.log(username)

try{

   const data=await users.findByIdAndUpdate(id,{name:username})
const data2=await posts.updateMany({userID:id},{$set:{uname:username}})


 }catch(err){

res.send(err)
 }






   
})





router.get("/findposts",(req,res)=>{

res.render("assests/searchpage",{login:true})



})

router.get("/search",auth,async(req,res)=>{
   const data=req.query.post
console.log(data);


//here is the code to use regex and find data related to search 
const relatedposts=await posts.find({



   "$or":[
   
   
      {"post":{$regex:data}},
      {"title":{$regex:data}}
      
      ]
      
      
      
   



   }).limit(5);
   



res.render("assests/searchpage",{login:true,relatedposts,data})




   

})





router.get('/users',async(req,res)=>{

   //write code to find user
const lin=req.body.term;


console.log("here is"+lin)

   res.render("assests/searchuser",{login:true})
   
      })
      
   



      router.post('/searchusersnames',auth,async(req,res)=>{

         //write code to find user
      const data=req.body.name;
      
const totalusers=await users.find(

{


   "$or":[
   
   
      {"name":{$regex:data}},
      {"email":{$regex:data}}
      
      ]



}

);
      

      
      
   res.send(totalusers)
         
            })
            
      







            router.get('/user',auth,async(req,res)=>{
const id=req.query.id;
               




const userdata=await users.findOne({_id:id});
   
   const totalposts=await posts.find({userID:id}).limit(2);
console.log(totalposts);
 

const countposts=await posts.find({userID:id}).countDocuments();
console.log(countposts);



   const userprofile=await profilephoto.findOne({userID:id});

   console.log(userprofile);


   const addmoredata=await moredetail.findOne({userID:id})

   console.log(path.join(__dirname, '../views/assests/images'));

const loggeduser=req.id;

res.render("assests/searchuserspage",{login:true,userdata,userprofile,countposts,totalposts,addmoredata,loggeduser,id})














                  })
                  
               






  router.post('/searchrelatedposts',async(req,res)=>{


//write code to combine the collection

const searchreq=req.body.name;



const relatedpost=await posts.find({



   "$or":[
   
   
      {"title":{$regex:searchreq}},
      {"post":{$regex:searchreq}}
      
      ]




})


res.send(relatedpost)


   })
   


router.post("/viewscounter",async(req,res)=>{

const data =req.body.term
console.log(data);

const postdata=await posts.findById(data);
console.log(postdata)
 
const a=postdata.views;
console.log(a)
 if(typeof a!=="undefined"){
const calculateviews=a+1;

const updateview=await posts.findByIdAndUpdate(data,{views:calculateviews})

 }
 else{

const view=1;
const updateview=await posts.findByIdAndUpdate(data,{views:view})

 }




})

router.use((req,res,next)=>{

res.send("this page does not exist");

})
module.exports=router;





      
   







