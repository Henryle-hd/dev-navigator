const Resource = require("../modules/resources.model");

const searchResources = async (req, res) => {
  try {
    const { search, category, tags } = req.query;
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        {
          description: { $regex: search, $options: "i" }
        },
        { link: { $regex: search, $options: "i" } },
        { image: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    if (category) {
      searchQuery.category = { $regex: category, $options: "i" };
    }
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      searchQuery.tags = { $in: tagArray.map((tag) => new RegExp(tag, "i")) };
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Resource.countDocuments(searchQuery);
    const resources = await Resource.find(searchQuery).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: resources,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      TotalMatchFound: total
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
      error: error.message
    });
  }
};
module.exports = searchResources;
