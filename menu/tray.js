const { app, Menu, Tray, BrowserWindow } = require("electron")
const path = require('node:path')
const server = require('../server/server');

const tray = new Tray('iyuu.ico');

const contextMenu = Menu.buildFromTemplate([{
    label: '打开主窗口',
    click: () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.show()
        })
    }
}, {
    label: '重启服务',
    click: () => {
        BrowserWindow.getAllWindows().forEach(win => {
            win.hide()
        })
        server.restartServer()
        setTimeout(() => {
            BrowserWindow.getAllWindows().forEach(win => {
                win.show()
                win.reload()
            })
        }, 1000)
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
    win.isVisible() ? win.hide() : win.show()
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
});