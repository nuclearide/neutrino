var child_process = require('child_process');
var fs = require('fs');

if(process.platform == "darwin") {
    if(!fs.existsSync('./neutrino-osx')) {
        child_process.execSync("grep url .gitmodules | sed 's/.*= //' | while read url; do git clone $url; done");
    }
    if (!~child_process.execSync("which xcodebuild").toString().indexOf('not found')) {
        var child = child_process.spawn("xcodebuild", ['CODE_SIGNING_REQUIRED=NO','CODE_SIGNING_ALLOWED=NO', "-configuration","Debug","-alltargets"], {
            cwd: 'neutrino-osx'
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    } else {
        console.log("Please install XCode");
    }
} else if(process.platform == "win32") {
    console.log("Window Build Unsupported");
} else {
    console.log("Unsupported Platform");
}