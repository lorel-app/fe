module.exports = {
  disableEmoji: false,
  format: "{type}{scope}: {emoji}{subject}",
  list: ["feat", "fix", "chore"],
  maxMessageLength: 64,
  minMessageLength: 3,
  questions: ["type", "subject"],
  scopes: [],
  types: {
    feat: {
      description: "A new feature",
      emoji: "🫡",
      value: "feat",
    },
    fix: {
      description: "A bug fix",
      emoji: "🐛",
      value: "fix",
    },
    chore: {
      description: "A chore",
      emoji: "🤸‍♀️",
      value: "chore",
    },
    messages: {
      type: "Select the type of change that you're committing:",
      subject: "Write a short, imperative mood description of the change:\n",
    },
  },
};
