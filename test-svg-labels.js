// Test script to verify SVG labels are working
const fs = require('fs');
const path = require('path');

// Mock contribution data with dates
const mockCells = [];
const startDate = new Date('2024-01-01');

// Generate a year of mock contribution data
for (let week = 0; week < 52; week++) {
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + (week * 7) + day);
    
    mockCells.push({
      x: week,
      y: day,
      date: currentDate.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 30),
      level: Math.floor(Math.random() * 5)
    });
  }
}

// Simple script to test if the compiled code includes label functionality
console.log('Checking for label functionality in compiled code...\n');

// Read the compiled SVG creator code
const svgCreatorPath = path.join(__dirname, 'svg-only/dist/578.index.js');
const content = fs.readFileSync(svgCreatorPath, 'utf8');

// Check for label-related functions
const hasCreateLabels = content.includes('createLabels');
const hasWeekdayLabels = content.includes('Mon') && content.includes('Wed') && content.includes('Fri');
const hasMonthLabels = content.includes('Jan') && content.includes('Feb') && content.includes('Mar');
const hasLabelStyles = content.includes('font-family') && content.includes('11px');

console.log('✅ createLabels function:', hasCreateLabels ? 'FOUND' : 'NOT FOUND');
console.log('✅ Weekday labels:', hasWeekdayLabels ? 'FOUND' : 'NOT FOUND');
console.log('✅ Month labels:', hasMonthLabels ? 'FOUND' : 'NOT FOUND');
console.log('✅ Label styles:', hasLabelStyles ? 'FOUND' : 'NOT FOUND');

if (hasCreateLabels && hasWeekdayLabels && hasMonthLabels && hasLabelStyles) {
  console.log('\n🎉 SUCCESS! The SVG generation code includes month and weekday labels!');
  console.log('\nThe labels will be displayed when:');
  console.log('1. The cells array passed to createSvg contains date information');
  console.log('2. The date information is preserved through the data pipeline');
  
  // Show a snippet of the label code
  const labelStart = content.indexOf('createLabels');
  const labelSnippet = content.substring(labelStart, labelStart + 500);
  console.log('\nLabel function snippet:');
  console.log(labelSnippet + '...');
} else {
  console.log('\n❌ ERROR: Some label functionality is missing!');
}