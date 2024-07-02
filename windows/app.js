const { BrowserWindow } = require('electron')
const path = require('node:path')
const log = require('electron-log')
const server = require('../server/server');

const url = require('url').format({
    protocol: 'http',
    hostname: '127.0.0.1',
    port: 8787
})

/** @type {BrowserWindow | null} */
let mainWindow = null

const createWindow = () => {
    const iconPath = path.join(__dirname, '..', 'iyuu.ico')
    if (mainWindow === null) {
        log.info('Create main window')
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            icon: iconPath,
            webPreferences: {
                webSecurity: false,
                preload: path.join(__dirname, '..', 'preload.js')
            }
        })

        // mainWindow.webContents.openDevTools()

        require("../menu/menu")

        mainWindow.webContents.loadURL(url)
        // mainWindow.loadURL(url)

        mainWindow.on('minimize', (event) => {
            event.preventDefault()
            mainWindow.hide()
        })
        mainWindow.on('close', (event) => {
            event.preventDefault()
            if (mainWindow) {
                mainWindow.hide()
            }
        })
    } else {
        log.info('Main window already created')
    }
}

const showWindows = () => {
    log.info('Show main window')
    if (!mainWindow) {
        createWindow()
        return
    }
    if (!mainWindow.isVisible()) {
        mainWindow.show()
    }
}

const hideWindows = () => {
    log.info('Hide main window')
    if (mainWindow) {
        if (mainWindow.isDestroyed()) {
            return
        }
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        }
    }
}

const closeWindows = () => {
    log.info('Close main window')
    if (mainWindow) {
        BrowserWindow.getAllWindows().forEach(window => {
            if (window.id !== mainWindow.id) {
                window.close()
            }
        })
        mainWindow.destroy()
    }
}

const refreshWindows = () => {
    log.info('Refresh main window')
    hideWindows()
    if (mainWindow) {
        mainWindow.reload()
    }
}

const refreshUrl = () => {
    log.info('Refresh main window')
    if (mainWindow) {
        mainWindow.loadURL(url)
    }
}

const rebootWindows = () => {
    log.info('Reboot main window')
    server.restartServer()
}

const visibleWindows = () => {
    return mainWindow && mainWindow.isVisible()
}


module.exports = { hideWindows, showWindows, createWindow, closeWindows, refreshWindows, rebootWindows, visibleWindows, refreshUrl };