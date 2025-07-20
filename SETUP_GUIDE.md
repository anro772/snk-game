# Setup Guide for GitHub Profile Snake with Month/Weekday Labels

This guide will help you set up the modified snake animation with month and weekday labels in your GitHub profile.

## Step 1: Fork and Deploy

1. Create a new repository on GitHub (e.g., `my-snk-action`)
2. Upload all the files from this modified snk-3.3.0 folder to your repository
3. Make sure the `action.yml` file is in the root of your repository

## Step 2: Create GitHub Action in Your Profile Repository

In your GitHub profile repository (`YOUR_USERNAME/YOUR_USERNAME`):

1. Create `.github/workflows/snake.yml`:

```yaml
name: Generate Snake

on:
  # run automatically every 24 hours
  schedule:
    - cron: "0 0 * * *" 
  
  # allows to manually run the job at any time
  workflow_dispatch:
  
  # run on every push on the master branch
  push:
    branches:
    - main

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      - name: Generate github-contribution-grid-snake.svg
        uses: YOUR_USERNAME/my-snk-action@main  # Replace with your repo
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark

      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Step 3: Update Your README.md

Add this to your profile `README.md`:

```markdown
## My Contributions 🐍

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake.svg" />
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake.svg" />
</picture>
```

## Step 4: Run the Workflow

1. Go to the Actions tab in your profile repository
2. Click on "Generate Snake" workflow
3. Click "Run workflow" button
4. Wait for it to complete

## What's New

Your snake animation will now include:
- **Month labels** at the top (Jan, Feb, Mar, etc.)
- **Weekday labels** on the left (Mon, Wed, Fri)
- Same styling as GitHub's official contribution graph
- Full dark mode support

## Troubleshooting

If the action fails:
1. Make sure you've enabled GitHub Actions in your repository settings
2. Check that the GITHUB_TOKEN has proper permissions
3. Verify that your forked action repository is public

## Testing Locally

To test if the SVG generation works correctly:
1. The SVG files will be generated in the `output` branch of your profile repository
2. You can access them directly via:
   - `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_USERNAME/output/github-contribution-grid-snake.svg`