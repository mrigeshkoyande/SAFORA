@echo off
echo ==============================================
echo Installing dependencies in the root folder...
echo ==============================================
cd ..
call npm run install:all

echo ==============================================
echo Starting Frontend and Backend together...
echo ==============================================
call npm run dev
