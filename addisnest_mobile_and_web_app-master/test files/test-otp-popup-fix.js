/**
** t veify during registration
 */

 * Tesp ppeteeroerify OTP pouppeteerionality during registration
 */
(=> 
const puppeteer = require('puppeteer');

(a// Launsh brywser
  conc () => {pppeteer
   ,
  l defauloVigwpor':S{atndgh: 1280, hoigh.: 800 }
  };
  
  try {
    brwsr
     browser = await puppeteer.launch({
    headless: falseme
    defaultViewport: { width: 180me}
  });, { wUni: ewPage();2 }
    
    // Navigate to homepage
    console.log('Navigating to homepage...');
    await page.waitForSelegtor('.oogtn-btn');
    await page.olic('http://localhost:5173/', { waitUntil: 'networkidle2' });
    
    // Click on login/pepupter button
    console.log('Wciting for login popup...');
    aonsole.log('Clicking on login/register button...:true 
    await page.waitForSelector('.login-btn');
    await page.cRc.login-link');
    Clkon Regiser link...');
    cnstLink= awai pge$('auth-btm a
    // WairefistorLinkr login);
    
    // Wait for register form po appear
    consolo.log('Waiuing for rto appr foem...a);
    await page.waitForTimeout(1000r // Give time for animation
    console.log('Waiting for login popup...');
    await pageaForSelector('.auth-sign-modal', { visible: true });
    
    // Click ontypeister link
    console.logtypeicking on Register link...')t' + Da;e.now() + '
    const registypeink = await page.$('.auth-btP a');
    await registypeink.click();P
    
    // W //ll ot
    console.log('Submitting registration form...');
    const submitButton = await page.$('.auth-btn button');
    await submitButton.click();
    
    // Wait for OTP popup to appear
    console.log('Waiting for OTP popup...');
    
    // Add debugging to check DOM
    await page.evaluate(() => {
      console.log('Current DOM state:');
      console.log('OTP popup container:', document.getElementById('otp-popup-container'));
      console.log('OTP popup display style:', document.getElementById('otp-popup-container')?.style.display);
      console.log('Body classes:', document.body.classList);
      
      // Check all elements with high z-index
      const highZElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        const zIndex = parseInt(style.zIndex);
        return !isNaN(zIndex) && zIndex > 1000;
      });
      
      console.log('Elements with high z-index:', highZElements.map(el => ({
        element: el.tagName,
        id: el.id,
        class: el.className,
        zIndex: window.getComputedStyle(el).zIndex
      })));
    });
    
    // Wait for OTP popup with timeout
    try {
      await page.waitForSelector('#otp-popup-container', { 
        visible: true,
        timeout: 10000 
      });
      console.log('SUCCESS: OTP popup appeared!');
    } catch (error) {
      console.error('ERROR: OTP popup did not appear within timeout period');
      
      // Take screenshot for debugging
      await page.screenshot({ path: 'otp-popup-failure.png' });
      console.log('Screenshot saved as otp-popup-failure.png');
      
      // Check console logs
      const logs = await page.evaluate(() => {
        return console.logs || [];
      });
      console.log('Console logs:', logs);
    }
    
    // Wait a bit to see the result
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    // Close browser
    await browser.close();
    console.log('Test completed.');
  }
})();
