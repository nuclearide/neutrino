var child_process = require('child_process');

if(process.platform == "darwin") {
    if (!~child_process.execSync("which xcodebuild").toString().indexOf('not found')) {
        var child = child_process.spawn("xcodebuild", ["-configuration","Debug","-alltargets"], {
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