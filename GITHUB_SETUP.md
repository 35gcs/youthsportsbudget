# 🚀 Push to GitHub - Step by Step

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `youth-sports-budget` (or any name you like)
3. Description: "Budgeting and financial management for youth sports organizations"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

## Step 2: Push Your Code

After creating the repo, GitHub will show you commands. Use these:

```bash
cd "/Users/stevengoldberg/Downloads/files (1)/youth-sports-budget"

# Add all files
git add .

# Commit
git commit -m "Initial commit: Youth Sports Budget Manager"

# Add your GitHub repo (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/youth-sports-budget.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository page
2. You should see all your files there!

## Quick Commands Reference

```bash
# Check status
git status

# See what will be committed
git status --short

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## What's Included

✅ All source code (frontend & backend)
✅ Configuration files
✅ Documentation
✅ .gitignore (excludes node_modules, venv, .db files, etc.)

## What's Excluded (via .gitignore)

❌ node_modules/ (too large, install with npm)
❌ venv/ (Python virtual environment)
❌ *.db (database files - create fresh on each deployment)
❌ .env files (environment variables - keep secret!)
❌ dist/ (build output - generated on deploy)

## After Pushing

Once on GitHub, you can:
- Deploy to Railway/Render directly from GitHub
- Share the code with others
- Track changes with version control
- Use GitHub Actions for CI/CD (optional)

## Need Help?

If you get authentication errors:
- Use GitHub CLI: `gh auth login`
- Or use SSH keys instead of HTTPS
- Or use a Personal Access Token
