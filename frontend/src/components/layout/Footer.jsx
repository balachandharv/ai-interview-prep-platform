export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-16" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold">InterviewAI</span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              AI-powered interview preparation platform helping thousands land their dream jobs at top tech companies.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#94A3B8]">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Mock Interviews</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">AI Roleplay</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Question Bank</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Company Prep</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Analytics</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#94A3B8]">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">About Us</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Blog</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Careers</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-[#94A3B8]">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Privacy Policy</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Terms of Service</a></li>
              <li><a href="#" className="text-[#CBD5E1] hover:text-white text-sm transition-colors no-underline">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1E293B] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#64748B] text-sm">© 2026 InterviewAI. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-[#64748B] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" className="text-[#64748B] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="#" className="text-[#64748B] hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zm-15.11-13.019c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019h-3.564v-11.452h3.564v11.452zm15.106-20.452h-20.454c-.979 0-1.771.774-1.771 1.729v20.542c0 .956.792 1.729 1.771 1.729h20.451c.978 0 1.778-.773 1.778-1.729v-20.542c0-.955-.8-1.729-1.778-1.729z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
