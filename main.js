const { app, BrowserWindow } = require('electron')
const path = require('node:path')
const server = require('./server/server');
const log = require('electron-log')

const mainWin = require('./windows/app');

if (require('electron-squirrel-startup')) {
    app.quit()
    return
}

app.whenReady().then(() => {
    log.transports.file.encoding = 'utf8';
    log.transports.file.file = path.join(app.getPath('userData'), 'logs/iyuu.log');
    log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} {text}';
    log.info('App is starting...');

    server.startServer()

    require("./menu/tray.js")

    log.info("[About] 新疆萌森软件开发工作室提供技术支持");

    setTimeout(() => {
        mainWin.createWindow()
    }, 3000)
})

app.on('window-all-closed', () => {
    mainWin.hideWindows()
})

app.on('before-quit', () => {
    mainWin.hideWindows()
    server.stopServer()
    log.info('App is quitting...');
})

app.on('quit', () => {
    app.quit()
    log.info('App is quitted');
})