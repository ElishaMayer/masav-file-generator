call node configPackagesFile.js web
call git add package.json
call git commit -m "pre-deploy-web"
call npm version patch
call npm run build
call RMDIR "hosting/public" /S /Q
call MKDIR "hosting/public"
call XCOPY /S "build" "hosting/public"
call cd "hosting"
call firebase deploy
call cd ..
call git push