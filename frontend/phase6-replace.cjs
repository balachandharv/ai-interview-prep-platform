/* Phase 6: Additional text color and chart color cleanup */
const fs = require('fs');
const path = require('path');

const replacements = [
  /* ── Text classes ── */
  [/text-\[#0F172A\]/g, 'text-[var(--text-primary)]'],
  [/text-\[#475569\]/g, 'text-[var(--text-secondary)]'],
  [/text-\[#64748B\]/g, 'text-[var(--text-muted)]'],
  [/text-\[#94A3B8\]/g, 'text-[var(--text-secondary)]'],
  [/text-\[#3B82F6\]/g, 'text-[var(--aqua-400)]'],
  [/text-\[#10B981\]/g, 'text-[var(--emerald-500)]'],
  [/text-\[#EF4444\]/g, 'text-[var(--danger-500)]'],
  [/text-\[#F59E0B\]/g, 'text-[var(--amber-500)]'],
  
  /* ── Background hover states and borders ── */
  [/hover:bg-\[#F8FAFC\]/g, 'hover:bg-[rgba(255,255,255,0.06)]'],
  [/border-\[#E2E8F0\]/g, 'border-[var(--glass-border)]'],
  [/border-\[#CBD5E1\]/g, 'border-[var(--glass-border)]'],

  /* ── Inline styles (Charts & SVGs) ── */
  [/fill: '#475569'/g, "fill: 'var(--text-secondary)'"],
  [/color: '#3B82F6'/g, "color: 'var(--aqua-400)'"],
  [/color: '#F1F5F9'/g, "color: 'var(--text-primary)'"],
  [/color: '#64748B'/g, "color: 'var(--text-muted)'"],
  [/fill="#4285F4"/g, 'fill="var(--blue-500)"'],
  [/fill="#34A853"/g, 'fill="var(--emerald-500)"'],
  [/fill="#FBBC05"/g, 'fill="var(--amber-500)"'],
  [/fill="#EA4335"/g, 'fill="var(--danger-500)"'],
  [/fill="#FBBF24"/g, 'fill="var(--amber-500)"'],
  [/color="#FBBF24"/g, 'color="var(--amber-500)"'],
  
  /* ── Miscellaneous specific fixes ── */
  [/'#10B981'/g, "'var(--emerald-500)'"],
  [/'#F59E0B'/g, "'var(--amber-500)'"],
];

function processDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      processDir(full);
    } else if (entry.isFile() && entry.name.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [regex, replacement] of replacements) {
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) { content = newContent; changed = true; }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated:', path.relative(process.cwd(), full));
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done.');
