import userProgress from "../models/userProgress.js";

export const byLevel = async (req, res) => {
  try {
    const userId = req.userId;
    const { levelId } = req.params;

    const records = await userProgress.find({
      userId,
      type: "Question",
      level: { $regex: `^${levelId}_` }, // matches 1_1, 1_3, etc.
    });

    if (!records.length) {
      return res.status(200).json({
        success: true,
        accuracy: 0,
        timeTaken: 0,
      });
    }

    // 2️⃣ Accuracy Calculation
    const total = records.length;
    const correct = records.filter((r) => r.result === true).length;

    const accuracy = ((correct / total) * 100).toFixed(2);

    const totalTime = records.reduce((sum, record) => {
      const subLevels = record?.subLevel || {};

      const subLevelTime = Object.values(subLevels).reduce(
        (subSum, attempt) => {
          const time = attempt?.timeTaken;
          return subSum + (typeof time === "number" ? time : 0);
        },
        0,
      );

      return sum + subLevelTime;
    }, 0);

    return res.status(200).json({
      success: true,
      accuracy: Number(accuracy), // return as number
      timeTaken: totalTime,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error calculating feedback by level",
      error: error.message,
    });
  }
};
