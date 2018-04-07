#!/usr/bin/env node
var child_process = require('child_process');
var fs = require('fs');

if(process.argv.length > 2) {
    if(!fs.existsSync(process.argv[2])) {
        throw new Error("File Not Found");
    }
    if(process.platform == "darwin") {
        var child = child_process.spawn("neutrino-osx/build/Debug/Neutrino", process.argv.slice(2));
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
    } else {
        console.log("Unsupported Platform");
    }
} else {
    console.log("Usage: neutrino [path]")
}