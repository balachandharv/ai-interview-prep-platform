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
 * Generate mock questions
 */
export function generateMockQuestions() {
  return [
    { id: 1, text: "Can you tell me a little about yourself?", category: "Behavioral", difficulty: "Easy", bookmarked: false, company: "Amazon", masteryCount: 3, modelAnswer: "Focus on your professional journey, highlighting key achievements.", keyPoints: ["Keep it under 2 minutes", "Highlight relevant experience"] },
    { id: 2, text: "How would you design a URL shortening service?", category: "System Design", difficulty: "Hard", bookmarked: true, company: "Google", masteryCount: 0, modelAnswer: "Discuss requirements, capacity estimation, and high-level design.", keyPoints: ["Database schema", "Hashing strategy", "Caching"] },
    { id: 3, text: "Explain the difference between a process and a thread.", category: "DSA", difficulty: "Medium", bookmarked: false, company: "Microsoft", masteryCount: 1, modelAnswer: "A process is an executing instance of an application, while a thread is a path of execution within a process.", keyPoints: ["Memory sharing", "Context switching overhead"] },
    { id: 4, text: "Describe a time you failed and what you learned.", category: "HR", difficulty: "Medium", bookmarked: false, company: null, masteryCount: 4, modelAnswer: "Use the STAR method to describe a genuine failure and emphasize the learning outcome.", keyPoints: ["Take accountability", "Show growth"] },
    { id: 5, text: "Implement a binary search tree in Java.", category: "DSA", difficulty: "Medium", bookmarked: false, company: null, masteryCount: 0, modelAnswer: "Create Node class with left/right pointers, then implement insert and search methods.", keyPoints: ["O(log n) time complexity", "Handling edge cases"] },
  ];
}
