@echo off
set /p commit_message="Enter commit message: "
echo Staging all changes...
git add .

echo Committing changes...
git commit -m "%commit_message%"

echo Pushing changes to the main branch...
git push origin main

echo Deploying to GitHub Pages...
npm run deploy

echo Done!
pause