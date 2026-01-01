@echo off
echo ========================================
echo   Visitor Management System Packager
echo ========================================
echo.

REM Get current directory name
for %%I in (.) do set FOLDER_NAME=%%~nxI

REM Create timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set DATE_TIME=%datetime:~0,8%-%datetime:~8,6%

REM Create zip filename
set ZIP_NAME=%FOLDER_NAME%-%DATE_TIME%.zip

echo Project: %FOLDER_NAME%
echo Date: %DATE_TIME%
echo.
echo Creating package...
echo This may take a few moments...
echo.

REM Create temporary directory for packaging
if not exist "..\temp_package" mkdir "..\temp_package"

REM Copy all files except excluded folders
echo Copying files...
xcopy /E /I /Y /Q . "..\temp_package\%FOLDER_NAME%\" /EXCLUDE:exclude_list.txt 2>nul

REM Create zip file
echo Creating zip file...
powershell -Command "Compress-Archive -Path ..\temp_package\%FOLDER_NAME% -DestinationPath ..\%ZIP_NAME% -Force"

REM Clean up temporary directory
echo Cleaning up...
rmdir /S /Q "..\temp_package"

echo.
echo ========================================
echo   Package Created Successfully!
echo ========================================
echo.
echo Filename: %ZIP_NAME%
echo Location: Parent directory
echo.
echo The package includes:
echo   - All source code
echo   - UI components
echo   - Database files
echo   - Documentation
echo   - Configuration files
echo.
echo Excluded (can be reinstalled):
echo   - node_modules folder
echo   - dist/build folders
echo   - .git folder
echo.
echo To use on another computer:
echo   1. Extract the zip file
echo   2. Open terminal in the folder
echo   3. Run: npm install
echo   4. Run: npm run dev
echo.
pause
