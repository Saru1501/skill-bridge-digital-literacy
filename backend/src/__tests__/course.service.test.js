const { createCourse, getCourses, togglePublish } = require("../controllers/courseController");
const { enrollCourse } = require("../controllers/enrollmentController");
const { updateLessonProgress, syncOfflineProgress } = require("../controllers/progressController");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");
const Lesson = require("../models/Lesson");
const { handleCourseCompletion } = require("../controllers/gamificationController");

jest.mock("../models/Course");
jest.mock("../models/Enrollment");
jest.mock("../models/Progress");
jest.mock("../models/Lesson");
jest.mock("../controllers/gamificationController");
jest.mock("../utils/cloudinary", () => ({
  uploadToCloudinary: jest.fn(),
  deleteFromCloudinary: jest.fn(),
}));

describe("Component 1 - Unit Tests (Business Logic)", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {}, user: { _id: "user123", role: "student" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("Course Visibility Logic", () => {
    test("getCourses should filter unpublished courses for students", async () => {
      req.user.role = "student";
      req.query = {};
      
      const mockCourses = [
        { title: "Course 1", isPublished: true },
      ];
      
      Course.countDocuments.mockResolvedValue(1);
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockCourses),
      });

      await getCourses(req, res);

      expect(Course.countDocuments).toHaveBeenCalledWith(expect.objectContaining({ isPublished: true }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: mockCourses }));
    });

    test("getCourses should NOT filter unpublished courses for admins", async () => {
      req.user.role = "admin";
      req.query = {};
      
      Course.countDocuments.mockResolvedValue(0);
      Course.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([]),
      });

      await getCourses(req, res);

      expect(Course.countDocuments).toHaveBeenCalledWith(expect.not.objectContaining({ isPublished: true }));
    });
  });

  describe("Enrollment Guard Logic", () => {
    test("enrollCourse should prevent duplicate enrollment", async () => {
      req.params.courseId = "course123";
      Course.findById.mockResolvedValue({ _id: "course123", isPublished: true });
      Enrollment.findOne.mockResolvedValue({ _id: "existing_enrollment" });

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Already enrolled" }));
    });

    test("enrollCourse should prevent enrollment in unpublished courses", async () => {
      req.params.courseId = "course123";
      Course.findById.mockResolvedValue({ _id: "course123", isPublished: false });

      await enrollCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Course is not available" }));
    });
  });

  describe("Progress Calculation & Completion Logic", () => {
    test("updateLessonProgress should correctly calculate percentage and trigger completion", async () => {
      req.params = { courseId: "course123", lessonId: "lesson1" };
      
      const mockEnrollment = { _id: "enr123", save: jest.fn() };
      const mockProgress = { 
        student: "user123", 
        course: "course123", 
        completedLessons: [], 
        save: jest.fn() 
      };
      const mockCourse = { _id: "course123", totalLessons: 2 };

      Enrollment.findOne.mockResolvedValue(mockEnrollment);
      Progress.findOne.mockResolvedValue(mockProgress);
      Course.findById.mockResolvedValue(mockCourse);

      await updateLessonProgress(req, res);

      expect(mockProgress.completedLessons).toContain("lesson1");
      expect(mockProgress.completionPercentage).toBe(50); // 1/2 * 100
      expect(mockProgress.isCourseCompleted).toBeFalsy();

      // Complete second lesson
      req.params.lessonId = "lesson2";
      mockProgress.completedLessons = ["lesson1"]; 
      await updateLessonProgress(req, res);

      expect(mockProgress.completionPercentage).toBe(100);
      expect(mockProgress.isCourseCompleted).toBe(true);
      expect(handleCourseCompletion).toHaveBeenCalled();
    });
  });

  describe("Offline Sync Logic", () => {
    test("syncOfflineProgress should merge multiple lessons and update completion", async () => {
      req.params.courseId = "course123";
      req.body.completedLessons = ["lesson1", "lesson2"];
      
      const mockProgress = { 
        completedLessons: [], 
        save: jest.fn() 
      };
      const mockCourse = { _id: "course123", totalLessons: 2 };

      Progress.findOne.mockResolvedValue(mockProgress);
      Course.findById.mockResolvedValue(mockCourse);

      await syncOfflineProgress(req, res);

      expect(mockProgress.completedLessons).toHaveLength(2);
      expect(mockProgress.completionPercentage).toBe(100);
      expect(mockProgress.isCourseCompleted).toBe(true);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
