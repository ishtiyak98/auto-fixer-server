const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

//!----middle-wire
app.use(cors());
app.use(express.json());

//yySRKi0xgY4Mn4mi
//autoFixer

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u5thy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.get("/", (req, res)=>{
    res.send("Auto Repair Server");
})

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db("autoFixer").collection("services");
        
        app.get("/services", async(req, res)=>{
            const query = {} ;
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        //!------- Show one service details---------
        app.get("/services/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })

        app.post("/newService", async(req, res)=> {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            console.log("new-service added");
            res.send(result);
        })

        //!---------- Update one service ------------
        app.put("/updateService/:id", async(req, res)=> {
            const {name, price, description, img} = req.body;
            const id = req.params.id;
            const filter = { _id : ObjectId(id) };
            const options = { upsert: true };
            console.log(name);
            const updateDoc = {
                $set: {
                  name : name,
                  price: price,
                  description: description,
                  img: img
                },
            };
            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        //!---------- Delete one service ------------
        app.delete('/deleteService/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
      }
}

run().catch(console.dir);

app.listen(port, ()=>{
    console.log("listening from port: ", port);
})
