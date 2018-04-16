window.__NEUTRINO_MESSAGE_HANDLER = function ([seq, data]) {
    callbacks[seq] && callbacks[seq](data);
};
window.__NEUTRINO_BROADCAST_HANDLER = function (args) {
    for (var listener of broadcastListeners) {
        listener.call(listener, args);
    }
};
function sendMessage(module, method, args = {}, seq, cb) {
    __NEUTRINO_SEND_MESSAGE(JSON.stringify({
        module,
        method,
        arguments: args,
        seq
    }));
}
function setCallbackHandler(seq, cb) {
    callbacks[seq] = cb;
}
var menuIndex = 0;
var menuCallbacks = {};
var broadcastListeners = [];
window.__NEUTRINO_MENU_HANDLER = function (tag) {
    menuCallbacks[tag] && menuCallbacks[tag]();
};
function refactorMenu(menu) {
    return menu.map((item) => {
        item.id = ++menuIndex;
        if (item.click) {
            menuCallbacks[menuIndex] = item.click;
        }
        delete item.click;
        if (item.submenu) {
            item.submenu = refactorMenu(item.submenu);
        }
        return item;
    });
}
var windowIndex = -1;
var callbacks = {
    0: function () {
        console.log(JSON.stringify(arguments));
    }
};
var seq = 0;
class Module {
}
export class App extends Module {
    static quit() {
        sendMessage("App", "quit");
    }
    static broadcast(...args) {
        sendMessage("App", "broadcast", args);
    }
    static onMessage(cb) {
        broadcastListeners.push(cb);
    }
}
export class Window {
    constructor(title, url) {
        sendMessage("Window", "create", {
            title,
            url
        }, 0);
        this._index = ++windowIndex;
    }
    maximize() {
        sendMessage("Window", "maximize", {
            index: this._index
        }, 0);
        return this;
    }
    close() {
        sendMessage("Window", "close", {
            index: this._index,
        }, 0);
        return this;
    }
}
export class Menu extends Module {
    static setApplicationMenu(menu) {
        menuIndex = 0;
        refactorMenu(menu);
        sendMessage("Menu", "setApplicationMenu", menu);
    }
}
export class FileSystem extends Module {
    static async readFile(filePath) {
        return new Promise((resolve, reject) => {
            setCallbackHandler(++seq, (value) => {
                delete callbacks[seq];
                if (value[1]) {
                    reject(value[1]);
                }
                else {
                    resolve(value[0]);
                }
            });
            sendMessage("FileSystem", "readFile", {
                filePath
            }, seq);
        });
    }
    static async readdir(filePath) {
        return new Promise((resolve) => {
            setCallbackHandler(++seq, (value) => {
                delete callbacks[seq];
                resolve(value);
            });
            sendMessage("FileSystem", "readdir", {
                filePath
            }, seq);
        });
    }
    static async writeFile(filePath, contents) {
        return new Promise((resolve) => {
            setCallbackHandler(++seq, (value) => {
                delete callbacks[seq];
                resolve(value);
            });
            sendMessage("FileSystem", "writeFile", {
                filePath,
                contents
            }, seq);
        });
    }
}
