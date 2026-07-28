/**
 * Calculate grade from score
 */
export function getGrade(score) {
  if (score >= 8) return 'A';
  if (score >= 6) return 'B';
  if (score >= 4) return 'C';
  return 'D';
}

/**
 * Format date for display
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format time (seconds to mm:ss)
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Count words in text
 */
export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Check answer quality gate (min 20 words)
 */
export function checkAnswerQuality(answer) {
  const words = wordCount(answer);
  return {
    isValid: words >= 20,
    wordCount: words,
    message: words < 20
      ? 'Your answer seems too short. Interviewers expect detailed responses.'
      : null,
  };
}

/**
 * Generate streak grid data (last 12 weeks)
 */
export function generateStreakGrid(activeDates = []) {
  const grid = [];
  const today = new Date();
  const activeDateSet = new Set(activeDates.map(d => new Date(d).toDateString()));

  for (let week = 11; week >= 0; week--) {
    const weekData = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      weekData.push({
        date: date.toDateString(),
        isActive: activeDateSet.has(date.toDateString()),
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    grid.push(weekData);
  }
  return grid;
}

/**
 * Calculate readiness score from radar scores
 */
export function calculateReadiness(radarScores) {
  if (!radarScores || Object.keys(radarScores).length === 0) return 0;
  const values = Object.values(radarScores);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate random color from a string (for avatars)
 */
export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate mock data for demo purposes (used when backend is not connected)
 */
export function generateMockDashboardData() {
  return {
    readinessScore: 72,
    radarScores: {
      DSA: 75, 'System Design': 60, Behavioral: 85,
      Communication: 78, 'Domain Knowledge': 65, HR: 80,
    },
    streak: { current: 5, best: 14, lastDate: new Date().toISOString() },
    totalSessions: 24,
    averageScore: 7.2,
    questionsAnswered: 156,
    recentSessions: [
      { id: '1', date: new Date().toISOString(), mode: 'Mock', score: 7.8, grade: 'B', questionCount: 5 },
      { id: '2', date: new Date(Date.now() - 86400000).toISOString(), mode: 'Roleplay', score: 8.5, grade: 'A', questionCount: 8 },
      { id: '3', date: new Date(Date.now() - 172800000).toISOString(), mode: 'Mock', score: 6.2, grade: 'B', questionCount: 5 },
      { id: '4', date: new Date(Date.now() - 259200000).toISOString(), mode: 'Mock', score: 5.5, grade: 'C', questionCount: 5 },
      { id: '5', date: new Date(Date.now() - 345600000).toISOString(), mode: 'Roleplay', score: 7.0, grade: 'B', questionCount: 6 },
    ],
    badges: ['First Steps', 'Practice Makes Perfect', 'Streak Master'],
    weeklyFocusPlan: {
      priorities: [
        { category: 'System Design', description: 'Focus on scalability patterns and distributed systems concepts.', color: '#6366F1' },
        { category: 'DSA', description: 'Practice graph algorithms and dynamic programming problems.', color: '#8B5CF6' },
        { category: 'Domain Knowledge', description: 'Review database internals and caching strategies.', color: '#10B981' },
      ],
    },
    activeDates: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - Math.floor(Math.random() * 84));
      return d.toISOString();
    }),
  };
}

export function generateMockQuestions() {
  const categories = ['Technical', 'Behavioral', 'HR', 'System Design', 'DSA'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const questions = [
    { text: 'Explain the difference between REST and GraphQL APIs.', category: 'Technical', difficulty: 'Medium', company: 'Google' },
    { text: 'Tell me about a time you had to deal with a difficult team member.', category: 'Behavioral', difficulty: 'Medium', company: 'Amazon' },
    { text: 'Design a URL shortening service like bit.ly.', category: 'System Design', difficulty: 'Hard', company: 'Meta' },
    { text: 'Implement a LRU Cache with O(1) time complexity.', category: 'DSA', difficulty: 'Hard', company: 'Google' },
    { text: 'What is your greatest strength and how does it relate to this role?', category: 'HR', difficulty: 'Easy', company: 'Microsoft' },
    { text: 'Explain how a hash map works internally.', category: 'Technical', difficulty: 'Medium', company: 'Amazon' },
    { text: 'Describe a situation where you failed and what you learned.', category: 'Behavioral', difficulty: 'Medium', company: 'Meta' },
    { text: 'Design a notification system for a social media platform.', category: 'System Design', difficulty: 'Hard', company: 'Meta' },
    { text: 'Find the longest palindromic substring in a given string.', category: 'DSA', difficulty: 'Medium', company: 'Microsoft' },
    { text: 'Why do you want to work at our company?', category: 'HR', difficulty: 'Easy', company: 'Google' },
    { text: 'Explain microservices architecture and its pros and cons.', category: 'Technical', difficulty: 'Medium', company: 'Netflix' },
    { text: 'Tell me about a time you showed leadership without authority.', category: 'Behavioral', difficulty: 'Hard', company: 'Amazon' },
    { text: 'Design a real-time chat application.', category: 'System Design', difficulty: 'Medium', company: 'Flipkart' },
    { text: 'Implement binary search on a rotated sorted array.', category: 'DSA', difficulty: 'Medium', company: 'Goldman Sachs' },
    { text: 'Where do you see yourself in 5 years?', category: 'HR', difficulty: 'Easy', company: 'Microsoft' },
    { text: 'Explain the CAP theorem with real-world examples.', category: 'Technical', difficulty: 'Hard', company: 'Google' },
    { text: 'Describe a project you are most proud of.', category: 'Behavioral', difficulty: 'Easy', company: 'Apple' },
    { text: 'Design an e-commerce recommendation engine.', category: 'System Design', difficulty: 'Hard', company: 'Amazon' },
    { text: 'Merge K sorted linked lists efficiently.', category: 'DSA', difficulty: 'Hard', company: 'Google' },
    { text: 'How do you handle work-life balance?', category: 'HR', difficulty: 'Easy', company: 'Netflix' },
  ];

  return questions.map((q, i) => ({
    id: `q${i + 1}`,
    ...q,
    modelAnswer: 'This is a sample model answer for demonstration purposes. The actual model answer would provide a comprehensive, structured response covering all key points.',
    keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
    roleTag: 'SDE-1',
    bookmarked: i % 5 === 0,
    masteryCount: Math.floor(Math.random() * 5),
  }));
}

export function generateMockLeaderboard() {
  const names = ['Alice Chen', 'Bob Kumar', 'Charlie Wang', 'Diana Patel', 'Eva Singh', 'Frank Miller', 'Grace Lee', 'Henry Zhang', 'Ivy Sharma', 'Jack Wilson'];
  return names.map((name, i) => ({
    rank: i + 1,
    name,
    totalSessions: Math.floor(Math.random() * 50) + 10,
    averageScore: (6 + Math.random() * 4).toFixed(1),
    bestStreak: Math.floor(Math.random() * 30) + 5,
    badges: Math.floor(Math.random() * 8) + 1,
    rankChange: Math.floor(Math.random() * 5) - 2,
  })).sort((a, b) => b.averageScore - a.averageScore).map((u, i) => ({ ...u, rank: i + 1 }));
}
