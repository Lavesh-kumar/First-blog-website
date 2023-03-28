const profile=async(req,res)=>{
    const id=req.id;
    const currentuser=await users.findById(id);
    const name=currentuser.name;
    const email=currentuser.email;
    const phone=currentuser.phone;
    const currentposts=await posts.find().sort({updatedAt:-1});
    console.log(currentposts);
    
        //code for pagination

    let curretpage=1;
    const page=req.params.page;
    curretpage=page;       
    const perpage=4;
    const skippages=(curretpage - 1) * perpage;
     const allposts=await posts.find().skip(skippages).limit(perpage).sort({updatedAt:-1})
      const countDocuments=await posts.find().countDocuments();
    const existphoto=await profilephoto.findOne({userID:id})
     console.log(existphoto);
    
     //profile completeness calculations and logic
    //  (1)   20% after sucessful account creation
     // (1)profile photo 20%
    // (1)description/about 30%
    // (4)post >=1 add 30% (if post 0 than -20%)
    
    var profilecomlete=20;
    const photo=await profilephoto.findOne({userID:id})
    const moredetails=await moredetail.findOne({userID:id})
    const noofposts=await posts.find({userID:id}).countDocuments();
    console.log("Posts"+noofposts)
    if(photo!==null){
    profilecomlete=profilecomlete+20;
    
    }
    if(noofposts>=1){
    profilecomlete=profilecomlete+30;
          }
    if(moredetails!==null){
       profilecomlete=profilecomlete+30;
       
       }
    res.render("assests/profile",{login:true,id:id,name,email,phone,currentposts,allposts,count:countDocuments,current:curretpage,perpage:perpage,existphoto,pro:profilecomlete,currentuser});
    }


    module.exports=profile;