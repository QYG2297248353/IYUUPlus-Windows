const { app, Menu, Tray } = require("electron")
const path = require('node:path')
const log = require('electron-log')
const server = require('../server/server');
const mainWin = require('../windows/app');

const iconPath = path.join(__dirname, '..', 'iyuu.ico')
const tray = new Tray(iconPath);

const contextMenu = Menu.buildFromTemplate([
    {
        label: '打开主窗口',
        click: () => {
            mainWin.showWindows()
        }
    },
    {
        label: '通过浏览器打开',
        click: () => {
            require('electron').shell.openExternal('http://127.0.0.1:8787')
        }
    },
    {
        label: '重启服务',
        click: () => {
            server.restartServer()
        }
    },
    {
        label: '强制退出',
        click: () => {
            app.exit(414)
        }
    },
    {
        label: '退出',
        click: () => {
            app.quit()
        }
    }
]);

tray.setToolTip('IYUU');
tray.setContextMenu(contextMenu);

tray.on('double-click', () => {
    if (mainWin.visibleWindows()) {
        mainWin.hideWindows()
    } else {
        mainWin.showWindows()
    }
});