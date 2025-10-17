/**
 * Test script for admin location filter functionality
 * 
 * This script tests the newly implemented location filter in the admin listings page.
 * It verifies that:
 * 1. The location filter dropdown is properly displayed
 * 2. Selecting a location filters the listings correctly
 */

const { chromium } = require('playwright');

async function testAdminLocationFilter() {
  console.log('Starting admin location filter test...');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Navigate to the admin login page
    console.log('Navigating to admin login page...');
    await page.goto('http://localhost:5173/admin/login');
    
    // Login as admin
    console.log('Logging in as admin...');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation to admin dashboard
    await page.waitForURL('**/admin/dashboard');
    console.log('Successfully logged in to admin dashboard');
    
    // Navigate to manage listings page
    console.log('Navigating to manage listings page...');
    await page.click('text=Listings');
    await page.waitForURL('**/admin/listings');
    
    // Wait for the page to load completely
    await page.waitForSelector('.admin-table');
    console.log('Listings page loaded successfully');
    
    // Check if location filter exists
    const locationFilter = await page.$('.location-filter');
    if (!locationFilter) {
      throw new Error('Location filter not found on the page');
    }
    console.log('Location filter found on the page');
    
    // Get available locations from the dropdown
    const locationOptions = await page.$$eval('.location-filter option', options => 
      options.map(option => ({ value: option.value, text: option.textContent }))
    );
    
    console.log('Available locations:', locationOptions);
    
    // Skip "All Locations" option (index 0)
    if (locationOptions.length <= 1) {
      console.log('No specific locations available in the filter');
    } else {
      // Test each location filter
      for (let i = 1; i < locationOptions.length; i++) {
        const location = locationOptions[i];
        console.log(`Testing filter for location: ${location.text}`);
        
        // Select the location from dropdown
        await page.selectOption('.location-filter', location.value);
        
        // Wait for the table to update
        await page.waitForTimeout(1000);
        
        // Check if the filtered results contain only the selected location
        const locationCells = await page.$$eval('table tbody tr td:nth-child(2)', cells => 
          cells.map(cell => cell.textContent)
        );
        
        console.log(`Found ${locationCells.length} listings for location: ${location.text}`);
        
        // Verify each listing has the correct location
        let allMatch = true;
        for (const cell of locationCells) {
          if (!cell.includes(location.text)) {
            console.error(`Found mismatched location: ${cell} does not include ${location.text}`);
            allMatch = false;
          }
        }
        
        if (allMatch) {
          console.log(`✅ All listings correctly filtered for location: ${location.text}`);
        } else {
          console.error(`❌ Some listings do not match the selected location: ${location.text}`);
        }
      }
    }
    
    // Reset filter to "All Locations"
    await page.selectOption('.location-filter', 'all');
    console.log('Reset filter to "All Locations"');
    
    console.log('Admin location filter test completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// Run the test
testAdminLocationFilter().catch(console.error);
