const { app, BrowserWindow, Menu } = require('electron')
const path = require('node:path')
const server = require('./server/server');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    require("./menu/menu.js")

    win.loadURL('http://127.0.0.1:8787')
}

app.whenReady().then(() => {
    server.startServer()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    server.stopServer()
    if (process.platform !== 'darwin') app.quit()
})