const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const server = require('./server/server');
const log = require('electron-log')

if (require('electron-squirrel-startup')) {
    app.quit()
    return
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: false,
            webSecurity: false,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    require("./menu/menu.js")
    require("./menu/tray.js")

    const url = require('url').format({
        protocol: 'http',
        slashes: true,
        hostname: '127.0.0.1',
        port: 8787
    })

    win.loadURL(url)

    win.on('minimize', (event) => {
        event.preventDefault()
        win.hide()
    })

    win.on('close', (event) => {
        event.preventDefault()
        win.hide()
    })
}

app.whenReady().then(() => {
    log.transports.file.encoding = 'utf8';
    log.transports.file.file = path.join(app.getPath('userData'), 'logs/iyuu.log');
    log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} {text}';
    log.info('App is starting...');

    server.startServer()
    log.info("[About] 新疆萌森软件开发工作室提供技术支持");

    setTimeout(() => {
        createWindow()
    }, 5000)
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    } else {
        app.show()
        BrowserWindow.getAllWindows().forEach(win => {
            win.show()
        })
    }
})

app.on('window-all-closed', () => {
    BrowserWindow.getAllWindows().forEach(win => {
        win.hide()
    })
    app.hide()
})

app.on('before-quit', () => {
    server.stopServer()
    log.info('App is quitting...');
})

process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
