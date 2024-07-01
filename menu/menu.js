const { Menu, BrowserWindow } = require("electron")
const path = require('node:path')
const server = require('../server/server');
const mainWin = require('../windows/app');

const iconPath = path.join(__dirname, '..', 'iyuu.ico')

let template = [
    {
        label: "IYUU",
        submenu: [
            {
                label: "刷新",
                click: () => {
                    mainWin.refreshUrl()
                }
            },
            {
                label: "重启服务",
                click: () => {
                    server.restartServer()
                }

            },
            {
                label: "文档中心",
                click: () => {
                    let win = new BrowserWindow({
                        width: 800,
                        height: 600,
                        icon: iconPath,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false,
                        }
                    });
                    win.loadURL("https://doc.iyuu.cn/");
                    win.on("closed", () => {
                        win = null;
                    });
                }
            },
        ]
    },
    {
        label: "帮助",
        submenu: [
            {
                label: "问题反馈",
                click: () => {
                    let win = new BrowserWindow({
                        width: 800,
                        height: 600,
                        icon: iconPath,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false,
                        }
                    });
                    win.loadURL("https://gitee.com/qyg2297248353/iyuuplus-windows/issues");
                    win.on("closed", () => {
                        win = null;
                    });
                }
            },
            {
                label: "新疆萌森软件开发工作室提供技术支持",
                click: () => {
                    let win = new BrowserWindow({
                        width: 800,
                        height: 600,
                        icon: iconPath,
                        webPreferences: {
                            nodeIntegration: true,
                            contextIsolation: false,
                        }
                    });
                    win.loadURL("https://lifebus.top/");
                    win.on("closed", () => {
                        win = null;
                    });
                }
            },
            {
                label: "关于"
            }
        ]
    }
]

const m = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(m)