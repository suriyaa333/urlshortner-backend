const express=require("express");
const bodyparser=require("body-parser");
var cors = require('cors')
const { MongoClient } = require('mongodb');
var useragent = require('express-useragent');
const sha256=require("sha256");


var useragent = require('express-useragent');
const requestIp = require('request-ip');
const app=express();
var get_ip = require('ipware')().get_ip;
const { detect } = require('detect-browser');
app.use(useragent.express());
app.use(cors());
app.use(bodyparser.json());
var http = require('http');
const { resolveSoa } = require("dns");

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
      
        if(cursor!=null)
        {
            
            var ans={output:0};
            ans=JSON.stringify(ans);
           
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

          const clientIp = requestIp.getClientIp(req);
          var useragent=req.headers['user-agent'];
          let chromeagent=useragent.indexOf("Chrome")>-1;
          let fxagent=useragent.indexOf("Firefox")>-1;
          let Safariagent=useragent.indexOf("Safari")>-1;
         
          if ((chromeagent) && (Safariagent)) 
          Safariagent = false;
         
          let Ieagent=useragent.indexOf("MSIE") > -1 || 
          useragent.indexOf("rv:") > -1;
         
          var agent="";
          if(chromeagent===true)
          {
              agent="Chrome";
      
          }
          else{
              if(fxagent===true)
              {
                  agent="Firefox";
              }
              else{
                  if(Ieagent===true)
                  {
                      agent="Internet Explorer";
                  }
                  else
                  agent="Other Browser";
              }
          }
        
          document={
              "ismobile":req.useragent.isMobile,
              "ip":clientIp.split(':').pop(),
              "browser":agent,
                "shorturl":req.body.shorturl
          };
          const ress = await client.db("Urldatabase").collection("statistics").insertOne(document);
          console.log(ress);

        var result={longurl:""};
       
      
        if(cursor!=null){
           
        result.longurl=cursor["longurl"];
        console.log(result.longurl);
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
        var finalarr=[];

        const cursor = await client.db("Urldatabase").collection("Urltable").find({"username":req.body.username});

        var arr= await cursor.toArray();
        const cursor2 = await client.db("Urldatabase").collection("statistics").find();
        var arr2= await cursor2.toArray();
      
          arr.forEach(async function (obj) {
        
           arr2.forEach((obj2)=>{
                if(obj["shorturl"]===obj2["shorturl"])
                {
                   
                       
                    var obj3={};
                    obj3["longurl"]=obj["longurl"];
                    obj3["shorturl"]=obj["shorturl"];
                    obj3["click"]=obj["click"];
                    obj3["ismobile"]=obj2["ismobile"];
                    obj3["browser"]=obj2["browser"];
                    obj3["ip"]=obj2["ip"];
                    finalarr.push(obj3);
                   
                        
                    
                }

           })
           
        })
        console.log("hi");
        console.log(finalarr);
       finalarr=JSON.stringify(finalarr);
       arr=JSON.stringify(arr);
        
      console.log(arr);
        var finalobj={};
        finalobj["arr"]=arr;
        finalobj["finalarr"]=finalarr
        finalobj=JSON.stringify(finalobj);
        res.send(arr);
        
       

         
    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
       //  await client.close();
    
    }
   
 })


 app.post("/getalltransactions",async function(req,res){
    await client.connect();
    
     
   
    const uri = "mongodb+srv://Suriyaa:mthaniga@cluster0.rsh4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  
  
    try {
        var finalarr=[];

        const cursor = await client.db("Urldatabase").collection("Urltable").find({"username":req.body.username});

        var arr= await cursor.toArray();
        const cursor2 = await client.db("Urldatabase").collection("statistics").find();
        var arr2= await cursor2.toArray();
      
          arr.forEach(async function (obj) {
        
           arr2.forEach((obj2)=>{
                if(obj["shorturl"]===obj2["shorturl"])
                {
                   
                       
                    var obj3={};
                    obj3["longurl"]=obj["longurl"];
                    obj3["shorturl"]=obj["shorturl"];
                    obj3["click"]=obj["click"];
                    obj3["ismobile"]=obj2["ismobile"];
                    obj3["browser"]=obj2["browser"];
                    obj3["ip"]=obj2["ip"];
                    finalarr.push(obj3);
                   
                        
                    
                }

           })
           
        })
        console.log("hi in getall trnas");
        
       finalarr=JSON.stringify(finalarr);
      
        console.log(finalarr);
        res.send(finalarr);
        
       

         
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


