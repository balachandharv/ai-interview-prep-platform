export default function Footer() {
  const linkStyle = { color: '#64748B', fontSize: '0.875rem', textDecoration: 'none', display: 'block', padding: '4px 0', transition: 'color 0.3s' };
  return (
    <footer style={{ background: '#080B14', color: '#F1F5F9', padding: '80px 0 0', fontFamily: 'Inter, sans-serif', borderTop: '1px solid rgba(148,163,184,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #818CF8, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Interview<span style={{ color: '#818CF8' }}>AI</span></span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>AI-powered interview preparation platform helping thousands land their dream jobs.</p>
          </div>
          {[
            { title: 'Product', links: ['Mock Interviews', 'AI Roleplay', 'Question Bank', 'Company Prep', 'Analytics'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', marginBottom: '16px' }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {col.links.map(link => <a key={link} href="#" style={linkStyle}>{link}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(148,163,184,0.06)', padding: '24px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ color: '#475569', fontSize: '0.8125rem', margin: 0 }}>© 2026 InterviewAI. All rights reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {['Twitter', 'GitHub', 'LinkedIn'].map(s => (
              <a key={s} href="#" style={{ color: '#475569', transition: 'color 0.3s', padding: '4px' }} aria-label={s}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.15" /><circle cx="12" cy="12" r="4" /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
