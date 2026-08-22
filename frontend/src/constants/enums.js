export const CATEGORIES = ['Technical', 'Behavioral', 'HR', 'System Design', 'DSA'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
export const EXPERIENCE_LEVELS = ['Fresher', 'Junior (0-2 yrs)', 'Mid (2-5 yrs)', 'Senior (5-8 yrs)', 'Staff (8+ yrs)'];

export const TARGET_ROLES = [
  { id: 'sde1', label: 'SDE-1 / Junior Developer', icon: '💻' },
  { id: 'sde2', label: 'SDE-2 / Mid Developer', icon: '🖥️' },
  { id: 'sde3', label: 'SDE-3 / Senior Developer' },
  { id: 'frontend', label: 'Frontend Engineer', icon: '🎨' },
  { id: 'backend', label: 'Backend Engineer', icon: '️' },
  { id: 'fullstack', label: 'Full Stack Engineer', icon: '🔄' },
  { id: 'devops', label: 'DevOps Engineer' },
  { id: 'data', label: 'Data Engineer / Scientist' },
  { id: 'ml', label: 'ML Engineer' },
  { id: 'pm', label: 'Product Manager', icon: '📋' },
  { id: 'qa', label: 'QA Engineer', icon: '🧪' },
  { id: 'mobile', label: 'Mobile Developer', icon: '📱' },
];

export const COMPANIES = [
  { id: 'google', name: 'Google', logo: '🔍', rounds: 5 },
  { id: 'amazon', name: 'Amazon', logo: '📦', rounds: 5 },
  { id: 'microsoft', name: 'Microsoft', logo: '🪟', rounds: 4 },
  { id: 'meta', name: 'Meta', logo: '👤', rounds: 4 },
  { id: 'apple', name: 'Apple', logo: '🍎', rounds: 4 },
  { id: 'netflix', name: 'Netflix', logo: '🎬', rounds: 3 },
  { id: 'flipkart', name: 'Flipkart', logo: '🛒', rounds: 4 },
  { id: 'goldman', name: 'Goldman Sachs', logo: '🏦', rounds: 4 },
];

export const WEAK_AREAS = [
  'Data Structures', 'Algorithms', 'System Design', 'Database Design',
  'Object Oriented Programming', 'Behavioral Questions', 'HR Questions',
  'Communication Skills', 'Problem Solving', 'Time Complexity',
  'Networking', 'Operating Systems', 'Web Technologies', 'Cloud Computing',
];

export const RADAR_CATEGORIES = ['DSA', 'System Design', 'Behavioral', 'Communication', 'Domain Knowledge', 'HR'];

export const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'sort of', 'kind of', 'i mean', 'right', 'so yeah'];

export const ROLEPLAY_PERSONAS = [
  {
    id: 'priya',
    backendId: 'd50c18d2-430b-4d43-9878-a5ecfbe62451',
    name: 'Priya Sharma',
    role: 'Senior Software Engineer',
    company: 'Google',
    style: 'Technical',
    difficulty: 'Hard',
    duration: '25 min',
    description: 'Focuses on algorithms, data structures, and system design. Expects clean code and optimal solutions.',
    avatar: '👩‍💻',
    color: '#4285F4',
  },
  {
    id: 'david',
    backendId: 'b69f64a5-1d48-4e31-8919-4cb34f2d5e3c',
    name: 'David Chen',
    role: 'Engineering Manager',
    company: 'Amazon',
    style: 'Mixed',
    difficulty: 'Hard',
    duration: '30 min',
    description: 'Combines leadership principles with technical depth. Tests decision-making and ownership.',
    color: '#FF9900',
  },
  {
    id: 'sarah',
    backendId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Sarah Johnson',
    role: 'HR Business Partner',
    company: 'Microsoft',
    style: 'Behavioral',
    difficulty: 'Medium',
    duration: '20 min',
    description: 'Expert in behavioral interviewing with STAR methodology. Tests culture fit and collaboration.',
    color: '#00A4EF',
  },
  {
    id: 'rahul',
    backendId: 'c0a80121-a3f8-4a6c-9c98-1e47f2a1b9d4',
    name: 'Rahul Gupta',
    role: 'CTO',
    company: 'TechStartup',
    style: 'Technical',
    difficulty: 'Medium',
    duration: '25 min',
    description: 'Looks for product thinking, speed, and versatility. Values practical problem-solving over theory.',
    color: '#6366F1',
  },
  {
    id: 'jennifer',
    backendId: 'e6b4c3b6-277d-411a-bd44-245780517861',
    name: 'Jennifer Lee',
    role: 'Technical Recruiter',
    company: 'Goldman Sachs',
    style: 'Behavioral',
    difficulty: 'Medium',
    duration: '20 min',
    description: 'Screens for analytical thinking, attention to detail, and financial domain awareness.',
    color: '#6D9EEB',
  },
  {
    id: 'michael',
    backendId: '8f1c8491-03a8-4c68-b7db-115f53096fa1',
    name: 'Michael Brown',
    role: 'Staff Engineer',
    company: 'Meta',
    style: 'Technical',
    difficulty: 'Hard',
    duration: '30 min',
    description: 'Deep dives into system design at scale. Tests distributed systems knowledge and trade-off analysis.',
    color: '#0668E1',
  },
  {
    id: 'anjali',
    backendId: 'a78f2302-3b09-4e78-9047-97558661b12b',
    name: 'Anjali Verma',
    role: 'Product Manager',
    company: 'Flipkart',
    style: 'Mixed',
    difficulty: 'Medium',
    duration: '25 min',
    description: 'Evaluates product sense, user empathy, and technical communication skills.',
    color: '#F7CB0A',
  },
  {
    id: 'james',
    backendId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    name: 'James Wilson',
    role: 'Consultant',
    company: 'McKinsey',
    style: 'Behavioral',
    difficulty: 'Hard',
    duration: '25 min',
    description: 'Tests structured thinking, case analysis, and executive communication.',
    color: '#004B8D',
  },
];

export const MOTIVATIONAL_QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "The interview is not a test of knowledge; it's a test of how you think.", author: "Gayle McDowell" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Practice is the hardest part of learning, and training is the essence of transformation.", author: "Ann Voskamp" },
];

export const BADGE_DEFINITIONS = [
  { name: 'First Steps', description: 'Complete your first mock interview', requirement: 1 },
  { name: 'Practice Makes Perfect', description: 'Complete 10 mock sessions', requirement: 10 },
  { name: 'Interview Marathon', description: 'Complete 50 mock sessions', requirement: 50 },
  { name: 'Streak Master', description: 'Maintain a 7-day streak', requirement: 7 },
  { name: 'Consistency King', description: 'Maintain a 30-day streak', requirement: 30 },
  { name: 'Roleplay Rookie', description: 'Complete first roleplay session', requirement: 1 },
  { name: 'Roleplay Pro', description: 'Complete 10 roleplay sessions', requirement: 10 },
  { name: 'Score Hunter', description: 'Score 9+ on any question', requirement: 9 },
  { name: 'Perfect Round', description: 'Score 10/10 on all questions in a session', requirement: 10 },
  { name: 'Speed Demon', description: 'Complete a session in under 10 minutes', requirement: 1 },
  { name: 'Streak Shield', description: 'Use a streak freeze', requirement: 1 },
  { name: 'Company Ready', description: 'Complete a company preparation module', requirement: 1 },
];

export const GRADE_COLORS = {
  A: { bg: '#ECFDF5', text: '#10B981' },
  B: { bg: '#EEF2FF', text: '#6366F1' },
  C: { bg: '#FFFBEB', text: '#F59E0B' },
  D: { bg: '#FEF2F2', text: '#EF4444' }
};
