import questionsModel from "../models/questionsModel.js";
import levelProgress from "../models/levelProgress.js";

export const addQuestion = async (req, res) => {
  try {
    const { questions } = req.body;
    console.log("QUESTIONS", questions);
    const res = await Promise.all(
      questions.forEach(async (question) => {
        console.log("question", question);
        const record = await new questionsModel({
          questionId: question,
        });
        console.log("record", record);
        await record.save();
      })
    );
    res.status(200).send({ message: true });
  } catch (e) {
    console.log(e);
  }
};

export const fetchQuestions = async (req, res) => {
  try {
    const { type } = req.query;
    console.log("type", type);
    //res.status(400).send({ message: req.query });
    if (type != "start" && type != "progress") {
      res.status(400).send({ message: "invalid query" });
    }

    let limit = type === "start" ? 3 : 1;

    let userProgress = 0;
    let questions = [];
    if (!userProgress) {
      questions = await questionsModel.find().limit(limit).sort({ index: 1 });
    }
    res.status(200).send({ message: questions });
  } catch (e) {
    console.log(e);
  }
};
