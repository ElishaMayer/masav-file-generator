set NODE_OPTIONS=--openssl-legacy-provider
rem call git add package.json
rem call git commit -m "pre-deploy-electron"
rem call npm version patch
call npm run build
call RMDIR "application/public" /S /Q
call RMDIR "dist" /S /Q
call RMDIR "installers" /S /Q
call MKDIR "application/public"
call XCOPY /S "build" "application/public"
call cd "application"
rem call npm version patch
call npm run pack
call npm run installer
REM call git push