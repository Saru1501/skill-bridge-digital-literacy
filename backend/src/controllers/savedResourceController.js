const SavedResource = require("../models/SavedResource");
const Lesson = require("../models/Lesson");

const toggleSaveResource = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    const resource = lesson.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
    const resourceId = String(resource._id);
    const existing = await SavedResource.findOne({
      student: req.user._id,
      lesson: lesson._id,
      $or: [{ resourceId }, { resourceUrl: resource.url }],
    });
    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ success: true, message: "Resource unsaved", isSaved: false });
    }
    await SavedResource.create({
      student: req.user._id,
      lesson: lesson._id,
      resourceId,
      resourceName: resource.name || "Learning resource",
      resourceType: resource.type || "other",
      resourceUrl: resource.url,
    });
    res.status(201).json({ success: true, message: "Resource saved", isSaved: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMySavedResources = async (req, res) => {
  try {
    const saved = await SavedResource.find({ student: req.user._id })
      .populate({
        path: "lesson",
        select: "title course resources",
        populate: { path: "course", select: "title" },
      })
      .sort({ savedAt: -1 });

    const data = saved.map((item) => {
      const lesson = item.lesson;
      const matchedResource =
        lesson?.resources?.find(
          (resource) =>
            String(resource._id) === item.resourceId || resource.url === item.resourceUrl
        ) || null;

      return {
        _id: item._id,
        savedAt: item.savedAt,
        resourceId: matchedResource?._id ? String(matchedResource._id) : item.resourceId,
        resourceName:
          matchedResource?.name || item.resourceName || item.resourceUrl.split("/").pop(),
        resourceType: matchedResource?.type || item.resourceType || "other",
        resourceUrl: matchedResource?.url || item.resourceUrl,
        isDownloadable:
          matchedResource?.isDownloadable !== undefined ? matchedResource.isDownloadable : true,
        lesson: lesson
          ? {
              _id: lesson._id,
              title: lesson.title,
              course: lesson.course
                ? {
                    _id: lesson.course._id,
                    title: lesson.course.title,
                  }
                : null,
            }
          : null,
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { toggleSaveResource, getMySavedResources };
