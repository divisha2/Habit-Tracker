export const motivationalQuotes = [
  {
    text: "Small steps every day lead to big changes every year.",
    author: "James Clear"
  },
  {
    text: "You are what you repeatedly do. Excellence is not an act, but a habit.",
    author: "Aristotle"
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Progress, not perfection, is the goal.",
    author: "Unknown"
  },
  {
    text: "Every expert was once a beginner.",
    author: "Robin Sharma"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },
  {
    text: "Your future self will thank you for the habits you build today.",
    author: "Unknown"
  },
  {
    text: "Consistency is the mother of mastery.",
    author: "Robin Sharma"
  },
  {
    text: "A journey of a thousand miles begins with a single step.",
    author: "Lao Tzu"
  }
];

export const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};