// Simple script to check for jsx attribute issues
const fs = require('fs');
const path = require('path');

// Directories to search
const searchDirs = [
  path.resolve(__dirname, 'components'),
  path.resolve(__dirname, 'assets')
];

// Regex to find potential issues with jsx attribute
const problematicPatterns = [
  /jsx\s*=\s*{true}/g,
  /jsx\s*=\s*\{false\}/g,
  /jsx\s*=\s*["']true["']/g,
  /jsx\s*=\s*["']false["']/g,
  /jsx\s*=\s*true/g,
  /jsx\s*=/g,
];

// Function to search for the pattern in a file
function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of problematicPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        console.log(`Found in ${filePath}: ${matches.join(', ')}`);
        
        // Show context around the match
        matches.forEach(match => {
          const index = content.indexOf(match);
          const start = Math.max(0, index - 100);
          const end = Math.min(content.length, index + match.length + 100);
          const context = content.substring(start, end);
          console.log(`Context: ...${context}...`);
        });
        
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    return false;
  }
}

// Function to recursively scan directories
function scanDirectory(directory) {
  let found = false;
  try {
    const items = fs.readdirSync(directory);
    for (const item of items) {
      const itemPath = path.join(directory, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const foundInSubdir = scanDirectory(itemPath);
        found = found || foundInSubdir;
      } else if (stats.isFile() && 
                (itemPath.endsWith('.js') || 
                 itemPath.endsWith('.jsx') || 
                 itemPath.endsWith('.tsx'))) {
        const foundInFile = searchFile(itemPath);
        found = found || foundInFile;
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${directory}: ${error.message}`);
  }
  return found;
}

// Main execution
console.log('Scanning for problematic JSX attributes...');
let foundAnyIssues = false;

for (const dir of searchDirs) {
  console.log(`Scanning directory: ${dir}`);
  const found = scanDirectory(dir);
  foundAnyIssues = foundAnyIssues || found;
}

if (!foundAnyIssues) {
  console.log('No jsx attribute issues found in the scanned files.');
}
