const { execSync } = require('child_process');

console.log('=== Quick Deploy to Fix Netlify Function ===');

try {
  console.log('1. Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('2. Installing function dependencies...');
  execSync('npm install', { cwd: 'functions', stdio: 'inherit' });
  
  console.log('3. Deploying to Netlify...');
  execSync('npx netlify deploy --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🔗 Function URL: https://addisnesttest.netlify.app/.netlify/functions/properties');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  
  // Try alternative deployment method
  console.log('🔄 Trying alternative deployment...');
  try {
    execSync('npx netlify deploy --dir=dist --functions=functions --prod', { stdio: 'inherit' });
    console.log('✅ Alternative deployment successful!');
  } catch (altError) {
    console.error('❌ Alternative deployment also failed:', altError.message);
  }
}
