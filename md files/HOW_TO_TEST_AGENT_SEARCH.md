# Testing the Agent Search Feature

This document provides instructions for testing the newly implemented Agent Search functionality in the Addinest platform.

## Prerequisites

- The application should be running locally with `start-app.bat`
- Your browser should have JavaScript enabled

## Test Cases

### 1. Accessing the Agent Search Page

1. Navigate to the homepage
2. Click on "Find Agent" in the navigation menu (if available)
3. Alternatively, navigate directly to `/find-agent` in your browser

**Expected Result:** The agent search page should load with a search form containing fields for Region, Specialty, Language, and Rating filters.

### 2. Searching for Agents

1. On the agent search page, select the following filter options:
   - Region: "Addis Ababa"
   - Specialty: "Buying"
   - Language: "Amharic"
   - Rating: "4+ Stars"
   - Check "Show only verified agents"
2. Click the "Search Agents" button

**Expected Result:** You should be redirected to the agent list page with applied filters, showing only agents that match all criteria.

### 3. Browsing All Agents

1. On the agent search page, click "Browse All Agents"

**Expected Result:** You should be redirected to the agent list page showing all available agents without any filters applied.

### 4. Testing Filters on Agent List Page

1. On the agent list page, apply the following filters:
   - Region: "Bahir Dar"
   - Click "Apply Filters"
2. Remove the region filter by clicking the "X" next to it
3. Apply a different filter (e.g., "Specialty: Selling")
4. Click "Clear All" to remove all filters

**Expected Result:** The agent list should update accordingly after each filter change, showing only matching agents. After clearing all filters, all agents should be displayed.

### 5. Pagination

1. Browse all agents to view the full list
2. If there are more than 5 agents, pagination controls should appear
3. Click "Next" to go to the next page
4. Click "Previous" to go back
5. Click on a specific page number

**Expected Result:** The agent list should update to show the correct set of agents for each page, and the active page should be highlighted.

### 6. Viewing Agent Details

1. Click on any agent card in the list

**Expected Result:** A popup should appear showing detailed information about the selected agent, including:
   - Name, photo, and verification badge (if verified)
   - Contact information
   - Rating
   - Experience and transaction history
   - Bio
   - Specialties and languages
   - Reviews (if available)

### 7. Agent Contact Options

1. Open an agent's detail popup
2. Test each contact button:
   - Call (should attempt to initiate a phone call)
   - Email (should open email client)
   - Chat (currently shows an alert)
   - Schedule Meeting (currently shows an alert)

**Expected Result:** Each button should trigger the appropriate action or display a message indicating future functionality.

### 8. Mobile Responsiveness

1. Test the agent search and list pages on different screen sizes (you can use browser developer tools to simulate mobile devices)

**Expected Result:** The layout should adapt to different screen sizes, with elements stacking vertically on smaller screens.

## Reporting Issues

If you encounter any issues during testing, please document:
1. The test case number
2. Steps to reproduce
3. Expected vs. actual behavior
4. Screenshots (if applicable)
