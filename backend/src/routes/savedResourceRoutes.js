const express = require("express");
const { toggleSaveResource, getMySavedResources } = require("../controllers/savedResourceController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:lessonId/resources/:resourceId", protect, toggleSaveResource);
router.get("/my", protect, getMySavedResources);

module.exports = router;
