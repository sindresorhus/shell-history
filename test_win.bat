:: Acts as a windows tester.

@echo off

echo Print entire history
node -p "const history = require('./'); history()"
pause
echo.
echo Print last command (which will be "test_win.bat")
node -p "const history = require('./'); let h = history(); h[h.length-1]"
pause

