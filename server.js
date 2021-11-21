const express=require("express");
const bodyparser=require("body-parser");
var cors = require('cors')
const { MongoClient } = require('mongodb');
var useragent = require('express-useragent');
const sha256=require("sha256");

const app=express();
app.use(cors());
app.use(bodyparser.json());
const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri);

var fun=async()=>{ 
 
 await client.connect();
}
fun();
const GenerateCharSet=()=>{

    
    let s="";
    for(let i=0;i<10;i++)
    {
        let ch=i.toString();
        s=s+ch;
    }
    let ch="a";
    for(let i=0;i<26;i++)
    {
       
        s=s+ch;
        ch=String.fromCharCode(ch.charCodeAt() + 1)
    }
    ch="A";
    for(let i=0;i<26;i++)
    {
       
        s=s+ch;
        ch=String.fromCharCode(ch.charCodeAt() + 1)
    }

    return s;

}

const base62=(deci)=>{
   
    let hash_str="";
    let s=GenerateCharSet();
  
    while(deci>0)
    {
        hash_str=s[deci%62]+hash_str;
        deci=Math.floor(deci/62);
    }
     return hash_str;
}


app.post("/",async function(req,res){

//    console.log(req.headers['user-agent']);

   //console.log(req.socket.remoteAddress);
    try {
        // Connect to the MongoDB cluster
       
        let longurl=req.body.url;
        
        obj=await Find(client);
        res.send(obj);


    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        // await client.close();
    
    }
  




})
   
   
app.post("/insertshorturl",async function(req,res){

  
   
   const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  
   try {
       // Connect to the MongoDB cluster
       var obj=req.body;
       console.log(req.body);

        if(req.body.choicetype===0){
        await updatecounter(client,obj);
        
        var document={
            username:obj.username,
            longurl:obj.longurl,
            shorturl:obj.chosenshorturl,
            click:0
        };
        await createListings(client, document);
        var ans={output:1};
        ans=JSON.stringify(ans);
            
        res.send(ans);
         }
    else{
       
        const cursor = await client.db("Urldatabase").collection("Urltable").findOne({"shorturl":req.body.chosenshorturl});
        console.log("hiiii");
        if(cursor!=null)
        {
            console.log("duplicate");
            var ans={output:0};
            ans=JSON.stringify(ans);
            console.log(ans);
            res.send(ans);
            
           
        }
        else{
            var obj=req.body;
            var document={
            username:obj.username,
            longurl:obj.longurl,
            shorturl:obj.chosenshorturl,
            click:0
            };
            await createListings(client, document);
            var ans={output:1};
            ans=JSON.stringify(ans);

            res.send(ans);
        }

        
       


    }


   } catch (e) {
       console.error(e);
   } finally {
       // Close the connection to the MongoDB cluster
      //  await client.close();
   
   }
 
})


app.post("/signup",async function(req,res){


    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  
    try {
        // Connect to the MongoDB cluster
       
        
         var document={
             username:req.body.name,
             password:sha256(req.body.password)
         };
        
         const result = await client.db("Urldatabase").collection("Users").insertOne(document);
         console.log(result);
         
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
       //  await client.close();
    
    }
   
 })

 app.post("/login",async function(req,res){
    await client.connect();

    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  
    try {
        // Connect to the MongoDB cluster
       obj=req.body;
       
        const result=await Findone(client,obj.name);
        var finalans={};
        
        if(result.password===sha256(req.body.password))
        {
            finalans["success"]=1;
        }
        else
        finalans["success"]=0;
      
        res.send(JSON.stringify(finalans));
       
         
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
       //  await client.close();
    
    }
   
 })
 app.post("/search",async function(req,res){
    await client.connect();

    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  
    try {
        var shorturl=req.body.shorturl;
        const cursor = await client.db("Urldatabase").collection("Urltable").findOne({"shorturl":shorturl});
        var myquery = {"shorturl":shorturl};
        var clicks=cursor["click"];
        clicks=clicks+1;
        var newvalues = { $set: {click:clicks } };
        const re=await client.db("Urldatabase").collection("Urltable").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          
          });
        console.log(re);
        var result={longurl:""}
        console.log("inside post");
        console.log(cursor);
        if(cursor!=null){
            console.log("inside if");
        result.longurl=cursor["longurl"];
        result=JSON.stringify(result);
       
      

     
        res.send(result);
        }
        else{
        console.log('not found');

        res.send(result);
        }

         
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
       //  await client.close();
    
    }
   
 })


 app.post("/gettable",async function(req,res){
    await client.connect();

    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  
    try {
        console.log
        const cursor = await client.db("Urldatabase").collection("Urltable").find({"username":req.body.username});

        var arr= await cursor.toArray();
       arr=JSON.stringify(arr);

      

       console.log(arr);
        res.send(arr);
        
       

         
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
       //  await client.close();
    
    }
   
 })


app.listen(process.env.PORT||8000,async function(){
console.log("listening");
});


async function Findone(client,username){
    const cursor = await client.db("Urldatabase").collection("Users").findOne({"username":username});
   
   return cursor;
}



async function Find(client){
    const cursor = await client.db("Urldatabase").collection("Counters").find();
   const arr= await cursor.toArray();
   hashes=[];
    obj={};
   obj["Ahash"]=base62(arr[0]['CounterA']);
   obj["Bhash"]=base62(arr[0]['CounterB']);
   obj["Chash"]=base62(arr[0]['CounterC']);
  hashes.push(obj);
   const j=JSON.stringify(hashes);
  
  return j;
}

async function createListings(client, document){
    const result = await client.db("Urldatabase").collection("Urltable").insertOne(document);
   return result;

}


async function updatecounter(client,obj){
   
    var myquery = { _id:1 };
    const cursor = await client.db("Urldatabase").collection("Counters").find();
    const arr= await cursor.toArray();
   
    if(obj.userchoice=="A")
    {
      
        let currvalue=arr[0]["CounterA"];
        currvalue+=1;
        var newvalues = { $set: {CounterA:currvalue } };
        const result=await client.db("Urldatabase").collection("Counters").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          
          });
    }
    if(obj.userchoice=="B")
    {
      
        let currvalue=arr[0]["CounterB"];
        currvalue+=1;
        var newvalues = { $set: {CounterB:currvalue } };
       const result= await client.db("Urldatabase").collection("Counters").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          
          });
    }
    if(obj.userchoice=="C")
    {
      
        let currvalue=arr[0]["CounterC"];
        currvalue+=1;
        var newvalues = { $set: {CounterC:currvalue } };
        const result= await client.db("Urldatabase").collection("Counters").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
           
          
          });
    }

    
}


