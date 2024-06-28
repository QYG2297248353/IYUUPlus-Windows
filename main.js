const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const server = require('./server/server');
const log = require('electron-log')


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    require("./menu/menu.js")

    win.loadURL('http://127.0.0.1:8787')
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
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    }, 5000)
})

app.on('window-all-closed', () => {
    server.stopServer()
    if (process.platform !== 'darwin') app.quit()
})


process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
