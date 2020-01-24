const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;

//TODO: add our data access layer file
const DAL = require("./dataAccessLayer");

const port = process.env.PORT;
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(cors());

DAL.Connect();

//ENDPOINTS CURD create update read delete, Get Push Put Patch
app.get("/api/posts", (req, res) => {
  DAL.Find().then(response => {
    res.send(response);
  });
});

app.get("/api/posts/:id", (req, res) => {});

app.post("/api/post", (req, res) => {
  const data = req.body;
  const payload = {
    name: data.name,
    price: data.price,
    category: data.category
  };
  //TODO: validate request (required fields, min length, is number)

  DAL.Insert(payload)
    .then(response => {
      res.send();
    })
    .catch(error => {
      res.send(error);
    });
  //TODO: if validation fails, res.sendStatus(400).send('name field is missing');

  //TODO: sanitize data
  // const payload = {
  //   name: data.name,
  //   price: data.price,
  //   category: data.category
  // };

  //TODO: insert into database
  //await DAL.insert (payload)

  //TODO: send back correct status codes and useful error messages

  // res.send(data);
});

//TODO: add a put/patch endpoint

app.put("/api/products/:id", cors(), async function(req, res) {
  const id = req.params.id;
  const newProduct = req.body;

  // const product = products[id];

  const updatedProduct = {
    $set: newProduct
  };

  const product = {
    _id: ObjectId(id)
  };

  if (product) {
    const result = await DAL.Update(product, updatedProduct);
    res.status(200).json({ message: "Successfully updated product!" });
  } else {
    res.send("No product with ID: " + id + "found!");
  }
});

//TODO: add a delete endpoint
app.delete("/api/posts/:id", (req, res) => {
  const id = req.params.id;
  const product = {
    _id: ObjectId(id)
  };
  DAL.Delete(product)
    .then(response => {
      res.send(response);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log("Server Started!");

  // console.log(
  //   `MONGODB_CONNECTION_STRING: ${process.env.MONGODB_CONNECTION_STRING}`
  // );
});
