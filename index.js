const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = process.env.PROT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ssb3nmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const databest = client.db("BD_Shop").collection("Data");
  const UserInfho = client.db("BD_Shop").collection("user");
  try {
    // Pordak Data
    app.get("/allPodak", async (req, res) => {
      const { name, sot, brand } = req.query;
      const query = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }
      if (brand) {
        query.brand = brand;
      }
      const sotPrice = sot === "asc" ? 1 : -1;

      const rejart = await databest
        .find(query)
        .sort({ price: sotPrice })
        .toArray();
      res.send(rejart);
    });


// user Data 

app.post('/userInfho',async(req,res)=>{
  const body =req.body
const quear = {email:body.email}
const fine = await UserInfho.findOne(quear)
if(fine){
  return res.send({message:'not ok',insertedId:null})
}
  const rejart = await UserInfho.insertOne(body)
  res.send(rejart)
})



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("sarvar is renik");
});

app.listen(port, () => {
  console.log(`you are port,${port}`);
});
