const { execSync } = require('child_process');
const fs = require('fs');

console.log('=== Link to Existing Netlify Project and Deploy ===');

try {
  // Check if .netlify directory exists
  if (!fs.existsSync('.netlify')) {
    console.log('🔗 Linking to existing Netlify project...');
    
    // Try to link to the existing site
    try {
      execSync('npx netlify link --name addisnesttest', { stdio: 'inherit' });
      console.log('✅ Successfully linked to addisnesttest');
    } catch (linkError) {
      console.log('⚠️  Auto-link failed, trying manual approach...');
      
      // Create .netlify directory manually if we know the site ID
      fs.mkdirSync('.netlify', { recursive: true });
      
      // You might need to get the actual site ID from Netlify dashboard
      // For now, let's try a different approach
      console.log('Please manually link using: npx netlify link');
      console.log('Or check your Netlify dashboard for the site ID');
    }
  } else {
    console.log('✅ Already linked to Netlify project');
  }
  
  console.log('📦 Installing function dependencies...');
  execSync('npm install', { cwd: 'functions', stdio: 'inherit' });
  
  console.log('🏗️  Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('🚀 Deploying to Netlify...');
  execSync('npx netlify deploy --prod', { stdio: 'inherit' });
  
  console.log('✅ Deployment complete!');
  console.log('🔗 Function should now be available at: https://addisnesttest.netlify.app/.netlify/functions/properties');
  
} catch (error) {
  console.error('❌ Process failed:', error.message);
  console.log('\n📋 Manual steps to fix:');
  console.log('1. Run: npx netlify link');
  console.log('2. Select "Link this directory to an existing project"');
  console.log('3. Choose "addisnesttest" from the list');
  console.log('4. Run: npx netlify deploy --prod');
}
