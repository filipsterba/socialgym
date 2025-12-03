@echo off
set PATH=%PATH%;C:\Program Files\nodejs
echo Starting Social Skill Gym...
echo.
call npm install
echo.
echo Starting Dev Server...
npm run dev
pause
