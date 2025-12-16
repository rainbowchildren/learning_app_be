import userProgress from "../models/userProgress.js";

import ContentMapModel from "../models/contentMapModel.js";

export const saveJourney = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware
    const { contentUUID } = req.body;

    if (!contentUUID) {
      return res.status(400).json({ message: "content UUID required" });
    }

    // Find or Create journey document for this user
    let userJourney = await ContentMapModel.findOne({ userId });

    if (!userJourney) {
      userJourney = await ContentMapModel.create({
        userId,
        journeyTracker: [contentUUID],
      });

      return res.status(201).json({
        success: true,
        message: "Journey started",
        data: userJourney,
      });
    }

    // Check if uuid already exists -> prevent duplicates
    if (!userJourney.journeyTracker.includes(contentUUID)) {
      userJourney.journeyTracker.push(contentUUID);
      await userJourney.save();
    }

    return res.status(200).json({
      success: true,
      message: "Progress updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
      success: false,
    });
  }
};

export const getProgressByUserId = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("userId", userId);
    const userJourney = await ContentMapModel.findOne({ userId });
    console.log("userJourney", userJourney);
    if (!userJourney || userJourney.journeyTracker.length === 0) {
      return res.status(200).json({
        message: "No progress found",
        uuid: null,
        data: null,
      });
    }

    const journeyArr = userJourney.journeyTracker;
    const lastCompletedUUID = journeyArr[journeyArr.length - 1];

    // Find progress for that UUID
    const userProgressData = await userProgress.findOne({
      userId,
      contentUUID: lastCompletedUUID,
    });
    console.log("userProgressData", userProgressData);
    return res.status(200).json({
      success: true,
      // lastCompletedUUID,
      data: userProgressData,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const storeProgress = async (req, res) => {
  try {
    const {
      type,
      contentUUID,
      level,
      subLevel,
      exersiceSubLevelUUID,
      status,
      result,
      feedbackType,
    } = req.body;
    const userId = req.userId;

    if (!contentUUID || !type || !level) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let record = await userProgress.findOne({ userId, contentUUID });
    let questionRecord = {};

    if (type === "Exersice") {
      questionRecord = {
        userId,
        type,
        contentUUID,
        level,
        exersiceSubLevelUUID,
        status: "Pending",
      };
    } else {
      const subKey = Object.keys(subLevel)[0]; // "0" or "1"
      const newSubLevelData = subLevel[subKey];
      questionRecord = {
        userId,
        type,
        contentUUID,
        level,
        subLevel: { [subKey]: newSubLevelData },
        result,
        status,
        feedbackType,
      };
    }
    // First time — create & save subLevel
    if (!record) {
      await userProgress.create(questionRecord);

      return res.status(201).json({
        message: "Saved 1st attempt",
        success: true,
      });
    }

    if (record && type === "Exersice") {
      const uuid = exersiceSubLevelUUID[0];

      const result = await userProgress.updateOne(
        { _id: record._id },
        { $addToSet: { exersiceSubLevelUUID: uuid }, $set: { status } }
      );

      // MongoDB response check
      if (result.modifiedCount === 0) {
        return res.status(200).json({
          success: false,
          message: "Already exists",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Updated",
      });
    }
    const subKey = Object.keys(subLevel)[0]; // "0" or "1"
    const newSubLevelData = subLevel[subKey];
    // Existing record — check number of subLevel keys
    const existingKeys = Object.keys(record.subLevel || {});

    if (existingKeys.length >= 2 && !record.subLevel[subKey]) {
      return res.status(400).json({
        message: "Already attempted 2 times",
        success: false,
      });
    }

    // Update/Insert the subLevel key
    record.subLevel[subKey] = newSubLevelData;
    record.result = result;
    record.status = status;
    record.markModified("subLevel");
    await record.save();

    return res.status(200).json({
      message: "Attempt stored/updated",
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
      success: false,
    });
  }
};

export const getLevelQuestionProgress = async (req, res) => {
  try {
    // const userId = req.userId;
    const { level, studentId } = req.params; // example: "1"
    const userId = studentId;

    if (!userId || !level) {
      return res.status(400).json({
        success: false,
        message: "UserId or level missing",
      });
    }

    // 1️⃣ Get ALL questions for this student
    const allQuestions = await userProgress
      .find({
        userId,
        type: "Question",
      })
      .lean();

    // 2️⃣ Filter questions belonging to this level
    // level format: "1_1", "1_2" → split by "_"
    const questions = allQuestions.filter((q) => {
      const [parentLevel] = q.level.split("_");
      return parentLevel === level;
    });

    if (!questions.length) {
      return res.status(200).json({
        success: true,
        data: {
          level,
          totalQuestions: 0,
          metrics: {},
          progress: {
            completedPercent: 0,
            scorePercent: 0,
          },
          lastUpdatedAt: null,
        },
      });
    }

    // 3️⃣ Metrics + calculations
    const metrics = {};
    let passedCount = 0;
    let completedCount = 0;
    let latestUpdatedAt = null;

    questions.forEach((q) => {
      // metric count
      const metric = q.subLevel?.feedbackType;
      if (metric) {
        metrics[metric] = (metrics[metric] || 0) + 1;
      }

      if (q.result === true) passedCount++;
      if (q.status === "Completed") completedCount++;

      if (!latestUpdatedAt || q.updatedAt > latestUpdatedAt) {
        latestUpdatedAt = q.updatedAt;
      }
    });

    const totalQuestions = questions.length;

    const completedPercent = Math.round(
      (completedCount / totalQuestions) * 100
    );

    // score rule: passed / 25
    const scorePercent = Math.round((passedCount / 25) * 100);

    // 4️⃣ Final response
    res.status(200).json({
      success: true,
      data: {
        level,
        totalQuestions,
        metrics,
        progress: {
          completedPercent, // linear progress
          scorePercent, // pie chart
        },
        lastUpdatedAt: latestUpdatedAt,
      },
    });
  } catch (err) {
    console.error("getLevelQuestionProgress error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
