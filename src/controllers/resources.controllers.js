const Resource = require("../modules/resources.model");
//get resources
const getResources = async (req, res) => {
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
    console.log("get all resources done!"); //test
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    // console.error(error);
  }
};

//get a resource
const getResource = async (req, res) => {
  try {
    const id = req.params.id;
    const resource = await Resource.findById(id);
    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
    console.log("get resources done!"); //test
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//post resources
const addResources = async (req, res) => {
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
    console.log("post done!"); //test
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//update resources
const updateResource = async (req, res) => {
  try {
    const id = req.params.id;
    const resources = await Resource.findByIdAndUpdate(id, req.body);
    const updatedResources = await Resource.findById(id);
    res.status(200).json({ success: true, data: updatedResources });
    console.log("update done!"); //test
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete resources
const deleteResource = async (req, res) => {
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
    console.log("delete done!"); //test
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getResource,
  getResources,
  addResources,
  updateResource,
  deleteResource
};
