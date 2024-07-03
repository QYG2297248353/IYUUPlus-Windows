const { app } = require('electron')
const path = require('node:path')
const log = require('electron-log')
log.initialize();
console.log = log.log;
log.transports.file.resolvePathFn = () => path.join(app.getPath('appData'), 'iyuu-plus/logs/iyuu.log');
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
log.transports.file.encoding = 'utf8';

log.info('App is starting...');

const server = require('./server/server');
const mainWin = require('./windows/app');


app.whenReady().then(() => {
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