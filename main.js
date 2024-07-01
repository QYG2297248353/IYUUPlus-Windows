const { app } = require('electron')
const path = require('node:path')
const server = require('./server/server');
const log = require('electron-log')

const mainWin = require('./windows/app');

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
    mainWin.closeWindows()
    log.info('App Windows are closing...');
})

app.on('will-quit', () => {
    server.stopServer()
    log.info('App is quitting...');
})

app.on('quit', () => {
    mainWin.closeWindows()
    server.stopServer()
    log.info('App is quitted');
})

if (require('electron-squirrel-startup')) {
    server.stopServer()
    app.quit()
    return
}