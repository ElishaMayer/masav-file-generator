call npm run build
call npm version patch
call RMDIR "hosting/public" /S /Q
call MKDIR "hosting/public"
call XCOPY "build" "hosting/public"
call cd "hosting"
call firebase deploy