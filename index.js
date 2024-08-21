const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

// const data = require("./MOCK_DATA.json");

const app = express();

//Connection
mongoose
  .connect("{your mongo db link}/youtube-app-1")
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => console.log("Mongo Error", err));

//Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    Gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile("log.txt", `\n${Date.now()}:${req.method}`, (err, datas) => {
    next();
  });
});

app.get("/", async(req, res) => {
  const allDbUsers = await User.find({})
  const html = `
      <ul>
          ${allDbUsers.map((user) => `<li>${user.firstName} - ${user.email}</li>`).join("")}
      </ul>
      `;
  res.send(html);
});

app.get("/api/users", async(req, res) => {
  const allDbUsers = await User.find({})  
  return res.json(allDbUsers);
});

app
  .route("/api/users/:id")
  .get(async(req, res) => {
    // const id = Number(req.params.id);
    // const user = data.find((user) => user.id === id);
    const user = await User.findById(req.params.id)
    return res.json(user);
  })
  .patch(async(req, res) => {
    // const id = Number(req.params.id);
    // const index = data.findIndex((user) => user.id === id);

    // if (index !== -1) {
    //   // Update user with new data from the request body
    //   data[index] = { ...data[index], ...req.body };

    //   // Write updated data to the JSON file
    //   fs.writeFile("./MOCK_DATA.json", JSON.stringify(data, null, 2), (err) => {
    //     if (err) return res.status(500).json({ status: "Failed", error: err });
    //     return res.json({ status: "Success", user: data[index] });
    //   });
    // } else {
    //   return res.status(404).json({ status: "User not found" });
    // }
    await User.findByIdAndUpdate(req.params.id,{lastName:'Changed'});
    return res.json({status : "Sucess"})
  })
  .delete(async(req, res) => {
    // const id = Number(req.params.id);
    // const index = data.findIndex((user) => user.id === id);

    // if (index !== -1) {
    //   const deleteUser = data.splice(index, 1)[0]; // Use index to remove the correct user

    //   fs.writeFile("./MOCK_DATA.json", JSON.stringify(data, null, 2), (err) => {
    //     if (err) return res.status(500).json({ status: "Failed", error: err });
    //     return res.json({ status: "Success", deleteUser });
    //   });
    // } else {
    //   return res.status(404).json({ status: "User not found" });
    // }
    await User.findByIdAndDelete(req.params.id);
    return res.json({status:"Success"})
  });

app.post("/api/users", async (req, res) => {
  const body = req.body;

  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    Gender: body.gender,
    jobTitle: body.job_title,
  });

  

  return res.status(201).json({ msg: "Success" });
  //   data.push({ ...body, id: data.length + 1 });
  //   fs.writeFile("./MOCK_DATA.json", JSON.stringify(data), (err, datas) => {
  //     return res.status(201).json({ status: "Success", id: data.length });
  //   });
});

// app.patch("/api/users/:id", (req, res) => {
//     // ToDo : Ediit the with id
//     return res.json({ status: "Pending" });
//   });

//   app.delete("/api/users/:id", (req, res) => {
//     // ToDo : Delete the user with id
//     return res.json({ status: "Pending" });
//   });

app.listen(8000, () => {
  console.log("Server Started!");
});
