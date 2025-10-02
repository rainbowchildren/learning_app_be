import mongoose from "mongoose";

const subExerciseSchema = new mongoose.Schema({
  title: { type: String },
  alphabetPhonetic: { type: String },
  audio_video_url: { type: String },
});

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["exercise", "voice", "blanks", "drag_drop", "match"],
      required: true,
    },

    order: {
      globalIndex: { type: Number, required: true, unique: true },
      level: {
        type: Number,
      },
      levelIndex: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
