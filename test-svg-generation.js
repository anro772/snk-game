// Test script to generate SVG with labels
const { createSvg } = require('./packages/svg-creator/dist');
const { userContributionToGrid } = require('./packages/action/dist');

// Mock data with dates for testing
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

// Create grid from cells
const grid = userContributionToGrid(mockCells);

// Mock snake chain
const chain = [{ nx: 0, ny: 0 }];

// Draw options
const drawOptions = {
  colorDots: {
    0: '#ebedf0',
    1: '#9be9a8',
    2: '#40c463',
    3: '#30a14e',
    4: '#216e39'
  },
  colorEmpty: '#ebedf0',
  colorDotBorder: '#1b1f230a',
  colorSnake: '#216e39',
  sizeCell: 16,
  sizeDot: 12,
  sizeDotBorderRadius: 2
};

const animationOptions = {
  frameDuration: 100
};

try {
  const svg = createSvg(grid, mockCells, chain, drawOptions, animationOptions);
  console.log('SVG generated successfully!');
  console.log('First 500 characters:', svg.substring(0, 500));
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('test-output.svg', svg);
  console.log('SVG saved to test-output.svg');
} catch (error) {
  console.error('Error generating SVG:', error);
}