// Enhanced script to check for jsx attribute issues
const fs = require('fs');
const path = require('path');

// Directories to search
const searchDirs = [
  path.resolve(__dirname, 'components')
];

// Common boolean props that might cause issues
const booleanAttributes = [
  'jsx', 'disabled', 'selected', 'checked', 'required', 'readOnly',
  'autoFocus', 'autoPlay', 'controls', 'loop', 'muted', 'default',
  'capture', 'multiple', 'noValidate', 'formNoValidate', 'open',
  'scoped', 'reversed', 'async', 'defer', 'download', 'allowFullScreen',
  'hidden', 'spellCheck', 'translate', 'draggable', 'contentEditable',
  'debug', 'visible', 'active', 'expanded', 'test', 'dev', 'mobile'
];

// Function to search for problematic patterns in a file
function searchFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let issues = [];
    
    // General boolean attribute pattern for React
    const booleanPattern = new RegExp(`(${booleanAttributes.join('|')})\\s*=\\s*(\\{(true|false)\\}|["'](true|false)["'])`, 'g');
    
    // Check for matches line by line for better context
    const lines = content.split('\n');
    lines.forEach((line, lineNumber) => {
      // Find any boolean attributes
      const match = line.match(booleanPattern);
      if (match) {
        issues.push({
          lineNumber: lineNumber + 1,
          line,
          match
        });
      }
      
      // Find any attribute="true" pattern (bad practice in React)
      const stringBoolPattern = new RegExp(`(${booleanAttributes.join('|')})\\s*=\\s*["'](true|false)["']`, 'g');
      const stringBoolMatch = line.match(stringBoolPattern);
      if (stringBoolMatch) {
        issues.push({
          lineNumber: lineNumber + 1,
          line,
          match: stringBoolMatch,
          issue: 'String boolean (use curly braces instead)'
        });
      }
      
      // Look for non-HTML compliant boolean props (should just use prop name without value)
      const nonCompliantPattern = new RegExp(`(${booleanAttributes.join('|')})\\s*=\\s*\\{true\\}`, 'g');
      const nonCompliantMatch = line.match(nonCompliantPattern);
      if (nonCompliantMatch) {
        issues.push({
          lineNumber: lineNumber + 1,
          line,
          match: nonCompliantMatch,
          issue: 'Non-compliant boolean prop (use just the prop name without value)'
        });
      }
    });
    
    if (issues.length > 0) {
      console.log(`\n✘ Issues found in ${filePath}:`);
      issues.forEach(issue => {
        console.log(`  Line ${issue.lineNumber}: ${issue.match.join(', ')}${issue.issue ? ` - ${issue.issue}` : ''}`);
        console.log(`    ${issue.line.trim()}`);
        
        // Suggest fix
        if (issue.line.includes('jsx={true}') || issue.line.includes('jsx="true"')) {
          console.log('    Suggestion: Replace with jsx="true" (as a string attribute)');
        } else if (issue.issue && issue.issue.includes('String boolean')) {
          const fixedLine = issue.line.replace(/(\w+)=['"]true['"]/g, '$1={true}').replace(/(\w+)=['"]false['"]/g, '$1={false}');
          console.log(`    Suggestion: ${fixedLine.trim()}`);
        } else if (issue.issue && issue.issue.includes('Non-compliant boolean')) {
          const fixedLine = issue.line.replace(/(\w+)=\{true\}/g, '$1');
          console.log(`    Suggestion: ${fixedLine.trim()}`);
        }
      });
      return true;
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
console.log('🔍 Scanning for problematic JSX attributes...');
let foundAnyIssues = false;

for (const dir of searchDirs) {
  console.log(`📁 Scanning directory: ${dir}`);
  const found = scanDirectory(dir);
  foundAnyIssues = foundAnyIssues || found;
}

if (!foundAnyIssues) {
  console.log('✓ No JSX attribute issues found in the scanned files.');
} else {
  console.log('\n📝 Summary: Review the issues above and fix them according to React best practices.');
  console.log('   For boolean props, either use the prop without a value or use {true} with curly braces.');
  console.log('   For string attributes, use quotes: attr="value"');
}
