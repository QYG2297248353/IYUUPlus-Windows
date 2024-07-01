const { app, Menu, Tray } = require("electron")
const path = require('node:path')
const server = require('../server/server');
const mainWin = require('../windows/app');

const tray = new Tray('iyuu.ico');

const contextMenu = Menu.buildFromTemplate([
    {
        label: '打开主窗口',
        click: () => {
            mainWin.showWindows()
        }
    },
    {
        label: '重启服务',
        click: () => {
            server.restartServer()
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
        mainWin.showWindows()
    } else {
        mainWin.hideWindows()
    }
});