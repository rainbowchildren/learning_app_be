const questions = [
  {
    type: ["tap"],
    meta: {
      tags: ["memorization"],
      level: 1,
      globalIndex: 0,
      levelIndex: 1,
    },
    content: {
      prompt:
        "Tap the appropriate letter from the box given below and fill the blank with upper case letters.",
      layout: {
        leftOptions: ["A", "B", "C", "D"],
        rightOptions: ["ABC_", "A_CD", "_BCD", "AB_D"],
      },
      correctAnswer: ["ABCD", "ABCD", "ABCD", "ABCD"],
    },
  },
];
