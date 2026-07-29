import os
import re

def process_files():
    # Mapping of files and the replacements to make
    replacements = {
        'src/pages/Dashboard.jsx': [
            ('Welcome back! 👋', 'Welcome back!'),
            ('<span className="text-2xl">🔥</span>', '<Flame className="text-orange-500 w-6 h-6" />'),
            ('<span className="text-white text-xl">🎭</span>', '<VenetianMask className="text-white w-6 h-6" />'),
            ('🎯 Weekly Focus Plan', 'Weekly Focus Plan'),
            ("import { RADAR_CATEGORIES", "import { Flame, VenetianMask } from 'lucide-react';\nimport { RADAR_CATEGORIES")
        ],
        'src/pages/Register.jsx': [
            ('Account created successfully! 🎉', 'Account created successfully!'),
            ("showPassword ? '🙈' : '👁️'", "showPassword ? <EyeOff size={18} /> : <Eye size={18} />"),
            ("import { registerUser", "import { Eye, EyeOff } from 'lucide-react';\nimport { registerUser")
        ],
        'src/pages/Login.jsx': [
            ("Welcome back! 🎉", "Welcome back!"),
            ("showPassword ? '🙈' : '👁️'", "showPassword ? <EyeOff size={18} /> : <Eye size={18} />"),
            ("import { loginUser", "import { Eye, EyeOff } from 'lucide-react';\nimport { loginUser")
        ],
        'src/pages/Leaderboard.jsx': [
            ('Leaderboard 🏆', 'Leaderboard'),
            ('{user.bestStreak} 🔥', '{user.bestStreak}'),
        ],
        'src/pages/CompanyPrep.jsx': [
            ('Company Prep 🏢', 'Company Prep'),
            ('Mock Interview 🚀', 'Mock Interview')
        ],
        'src/pages/MockInterview.jsx': [
            ('Mock Interview Setup 🎯', 'Mock Interview Setup'),
            ('Start Interview 🚀', 'Start Interview')
        ],
        'src/pages/RoleplayMode.jsx': [
            ('Roleplay Mode 🎭', 'Roleplay Mode'),
            ('🏢 Company Mode', 'Company Mode'),
            ('Start Interview with ${selected.name} 🚀', 'Start Interview with ${selected.name}')
        ],
        'src/pages/ResumeInterview.jsx': [
            ('📊 Skill Gap Analysis', 'Skill Gap Analysis'),
            ('🎯 Personalized Questions', 'Personalized Questions')
        ],
        'src/pages/InterviewSession.jsx': [
            ("🔥 You're on a roll!", "You're on a roll!"),
            ("💡 Adjusting difficulty", "Adjusting difficulty"),
            ("💡 Improved Sample Answer", "Improved Sample Answer"),
            ("View Results 🎉", "View Results")
        ],
        'src/pages/Onboarding.jsx': [
            ("Setup complete! Let's go! 🚀", "Setup complete! Let's go!"),
            ("What role are you targeting? 🎯", "What role are you targeting?"),
            ("What's your experience level? 📊", "What's your experience level?"),
            ("Target companies? 🏢", "Target companies?"),
            ("Complete Setup 🚀", "Complete Setup")
        ],
        'src/pages/QuestionBank.jsx': [
            ("⭐ Mastered", "Mastered")
        ],
        'src/components/layout/Sidebar.jsx': [
            ("icon: '📊'", "icon: <BarChart3 size={20} />"),
            ("icon: '🎯'", "icon: <Target size={20} />"),
            ("icon: '🎭'", "icon: <VenetianMask size={20} />"),
            ("icon: '🏢'", "icon: <Building size={20} />"),
            ("icon: '🏆'", "icon: <Trophy size={20} />"),
            ("import { useLocation", "import { BarChart3, Target, VenetianMask, Building, Trophy } from 'lucide-react';\nimport { useLocation")
        ],
        'src/pages/Landing.jsx': [
            ("icon: '🎯'", "icon: <Target className=\"w-6 h-6 text-indigo-500\" />"),
            ("icon: '🎭'", "icon: <VenetianMask className=\"w-6 h-6 text-indigo-500\" />"),
            ("icon: '📊'", "icon: <BarChart3 className=\"w-6 h-6 text-indigo-500\" />"),
            ("icon: '🏢'", "icon: <Building className=\"w-6 h-6 text-indigo-500\" />"),
            ("icon: '🤖'", "icon: <Bot className=\"w-6 h-6 text-indigo-500\" />"),
            ("import { Link", "import { Target, VenetianMask, BarChart3, Building, Bot } from 'lucide-react';\nimport { Link")
        ]
    }

    for file_path, rules in replacements.items():
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            for old, new in rules:
                content = content.replace(old, new)
                
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

process_files()
print("Emojis replaced successfully.")
