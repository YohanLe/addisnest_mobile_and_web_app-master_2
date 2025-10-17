const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Linking to Netlify Project with Site ID ===');

const siteId = '68c70fa7b358252fc3166c23';

try {
  // Create .netlify directory and state.json file
  if (!fs.existsSync('.netlify')) {
    fs.mkdirSync('.netlify');
  }
  
  const stateConfig = {
    siteId: siteId
  };
  
  fs.writeFileSync('.netlify/state.json', JSON.stringify(stateConfig, null, 2));
  console.log('✅ Created .netlify/state.json with site ID:', siteId);
  
  // Install function dependencies
  console.log('📦 Installing function dependencies...');
  execSync('npm install', { cwd: 'functions', stdio: 'inherit' });
  
  // Build the project
  console.log('🏗️  Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Deploy to Netlify
  console.log('🚀 Deploying to Netlify...');
  execSync('npx netlify deploy --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🔗 Function should now be available at: https://addisnesttest.netlify.app/.netlify/functions/properties');
  
} catch (error) {
  console.error('❌ Process failed:', error.message);
}
