const express = require("express");
const connectToDb = require("../config/database");
const Resource = require("./modules/resources.model");
const app = express();

// middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!, henry");
});

//get resources
app.get("/api/resources", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = await Resource.countDocuments();

    const resources = await Resource.aggregate([
      { $sample: { size: total } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    res.status(200).json({
      success: true,
      data: resources,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResources: total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    // console.error(error);
  }
});

//get a resource
app.get("/api/resources/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resource = await Resource.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// post resources
app.post("/api/resources", async (req, res) => {
  try {
    const resources = Array.isArray(req.body) ? req.body : [req.body];
    const validResources = resources.filter((resource) => {
      const { title, description, link, image, category, tags } = resource;
      if (!title || !description || !link || !image || !category || !tags) {
        return res
          .status(400)
          .json({ success: false, message: "Please fill in all fields" });
      } else {
        return title && description && link && image && category && tags;
      }
    });

    const addedResources = await Resource.create(validResources);
    res.status(201).json({ success: true, data: addedResources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//update resources
app.put("/api/resources/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const resources = await Resource.findByIdAndUpdate(id, req.body);
    const updatedResources = await Resource.findById(id);
    res.status(200).json({ success: true, data: updatedResources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//delete
app.delete("/api/resources/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return res
        .status(404)
        .json({ success: false, message: `resource not found!` });
    }
    res
      .status(200)
      .json({ success: true, data: "Resource successful deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

connectToDb();
module.exports = app;
