const fs=require('fs');
const users=require("../models/user");
const posts=require("../models/post");
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

//create post
//updatepost
//deletepost 
//postdetail
//my posts





const submitpostform=(req,res)=>{

//save image using formidable package and used uuid package for assign unique id to image 

    const form = formidable();
    form.parse(req, async(err, fields, files) => {
    const {title,postblog}=fields;
  const errors=[];
 //here we used custom validation , not the express validator    
 if(title.length===0){
  errors.push({msg:'title length is very less'})
   }
     
    if(postblog.length<50){
       errors.push({msg:'title length should minimum 50 characters'})   
        }
 
  if(files.image.originalFilename.length===0){
 errors.push({msg:'image not uploaded so try again'})   
       }
 
 
     const imagename=files.image.originalFilename;
    const split=imagename.split(".");
    const imageext=split[split.length-1].toUpperCase();
 
 if(imageext!='JPG' && imageext!='PNG'){
 errors.push({msg:'kindly upload jpg or png files. '+imageext+' is not supported'})
 }
 
    if(errors.length!==0){
       console.log(errors);
       console.log(imageext);
       res.render("assests/postform",{errors,login:true})
    }else{
 files.image.originalFilename=uuidv4()+'.'+imageext;
       const oldpath=files.image.filepath;
    const newpath=path.join(__dirname, '../views/uploads/')+files.image.originalFilename;
   
           fs.readFile(oldpath,(err,data)=>{
       if(!err){
             fs.writeFile(newpath,data,(err)=>{
       if(!err){
           fs.unlink(oldpath,(err)=>{
       if(!err){
          res.redirect('/myposts/1')
       }
           })
       }
          })}
       
       })
       
 
 // send data to database
       const ids=req.id;
       const usname=await users.findOne({_id:ids});
       const username=usname.name
       
       const saveposts=new posts({
         userID:ids,
          title:title,
          image:files.image.originalFilename,
          post:postblog,
          uname:username
       })
       
    const post=await saveposts.save().then(data=>{console.log(data)}).catch(err=>{console.log(err)})
    }
    })
 }
 
 const myposts=async(req,res)=>{ //show posts

    //code for paginations such as
    //myposts/1
    //myposts/2
    //each page contain 4 post
    let curretpage=1;
    const page=req.params.page;
    curretpage=page;
    const perpage=4;
    const skippages=(curretpage - 1) * perpage;
    const id=req.id;
    const allposts=await posts.find({userID:id}).skip(skippages).limit(perpage).sort({updatedAt:-1})
    const countDocuments=await posts.find({userID:id}).countDocuments();
    res.render('assests/showposts',{login:true,post:allposts,count:countDocuments,current:curretpage,perpage:perpage});
    }





    const postdetail=async(req,res)=>{
        const postid=req.params.id;
        const loggeduser=req.id
        
        const postdata=await posts.findOne({_id:postid})
        console.log(postdata);
         res.render('assests/postdetail',{postdata:postdata,loggeduser,postid,login:true})}






const updatepost=async(req,res)=>{
            const id =req.params.id;
            const datatoupdate=await posts.findOne({_id:id})            
            res.render('assests/update',{datatoupdate:datatoupdate,login:true})
        
            }




            const submitforupdate= async(req,res)=>{
                const errors=validationResult(req);
                const title=req.body.title;
                  console.log(title);
                console.log(errors);
              
              if(!errors.isEmpty()){
                 const uid=req.body.hiddenid;
                 console.log(uid)
              
              const datatoupdate=await posts.findOne({_id:uid})
              res.render('assests/update',{login:true,errors:errors.array(),datatoupdate})
              
              
              
                }else{
                 const title=req.body.title;
                 const hiddenid=req.body.hiddenid;
                 const blogpost=req.body.postblog;
              try{
              
                 const updatingdata=await posts.findByIdAndUpdate(hiddenid,{title:title,post:blogpost})
              
              
              }catch(err){
              
              res.send(err.msg)
              //msg is function of err
              
              }
              
              
              
                 res.redirect('myposts/1')
              
              
                }
                 
                 }






  const deletepost=async(req,res)=>{
   
                 try{
                const id=req.params.id;
                const deletingdata=await posts.findByIdAndRemove(id);
                 res.redirect("/myposts/1")
                 }catch(err){
                    res.send(err.msg)
                 }
                 }







 module.exports={submitpostform,myposts,postdetail,updatepost,submitforupdate,deletepost};