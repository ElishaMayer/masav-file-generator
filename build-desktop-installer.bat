call git add package.json
call git commit -m "pre-deploy-electron"
call npm version patch
call npm run build
call RMDIR "application/public" /S /Q
call RMDIR "dist" /S /Q
call RMDIR "installers" /S /Q
call MKDIR "application/public"
call XCOPY /S "build" "application/public"
call npm run electron-pack
call npm run electron-installer
