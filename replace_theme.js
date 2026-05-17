const fs = require('fs');
const glob = require('glob');

// Map of light mode classes to dark mode / semantic classes
const replacements = {
  'bg-white': 'bg-card',
  'bg-[#f8fafc]': 'bg-background',
  'bg-[#fbfdff]': 'bg-card',
  'bg-slate-50/50': 'bg-muted/50',
  'bg-slate-50': 'bg-muted',
  'bg-gray-50': 'bg-muted',
  'bg-gray-100': 'bg-muted',
  'bg-gray-200': 'bg-muted',
  'text-slate-950': 'text-foreground',
  'text-slate-900': 'text-foreground',
  'text-slate-800': 'text-foreground',
  'text-slate-700': 'text-muted-foreground',
  'text-slate-600': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-gray-900': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-700': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',
  'text-black': 'text-foreground',
  'border-slate-200/80': 'border-border/80',
  'border-slate-200': 'border-border',
  'border-gray-200': 'border-border',
  'border-gray-100': 'border-border',
  'shadow-sm': 'shadow-sm shadow-black/50',
  'shadow-lg': 'shadow-lg shadow-black/50'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [light, dark] of Object.entries(replacements)) {
    // Regex to match exact word boundary or class names
    const regex = new RegExp(`\\b${light.replace(/[\\[\\]\\/\\#]/g, '\\$&')}\\b`, 'g');
    content = content.replace(regex, dark);
  }
  
  // Custom fixes for hardcoded components
  content = content.replace(/bg-background\/90/g, 'bg-background/90'); // fix if needed
  // specific fix for shadow classes that might have been doubled
  content = content.replace(/shadow-sm shadow-black\/50 shadow-black\/50/g, 'shadow-sm shadow-black/50');
  content = content.replace(/shadow-lg shadow-black\/50 shadow-black\/50/g, 'shadow-lg shadow-black/50');

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
}

const files = glob.sync('app/**/*.js*');
files.forEach(processFile);
