call npm run build
call npm version patch
call RMDIR "hosting/public" /S /Q
call MKDIR "hosting/public"
call XCOPY /S "build" "hosting/public"
call cd "hosting"
call firebase deploy
call cd ..
call git push