const { app, Menu, BrowserWindow } = require("electron")
const path = require('node:path')
const server = require('../server/server');
const mainWin = require('../windows/app');

const iconPath = path.join(__dirname, '..', 'iyuu.ico')
const iconPngPath = path.join(__dirname, '..', 'iyuu.png')

const { version } = require('../package.json')

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
                        icon: iconPath
                    });
                    win.loadURL("https://doc.iyuu.cn/");
                    win.on("closed", () => {
                        win = null;
                    });
                }
            },
            {
                label: "数据统计",
                click: () => {
                    let win = new BrowserWindow({
                        width: 800,
                        height: 600,
                        icon: iconPath
                    });
                    win.loadURL("https://analytics.lifebus.top/share/uz482jXYOxwnoRRZ/iyuu.lifebus.top");
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
                        icon: iconPath
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
                        icon: iconPath
                    });
                    win.loadURL("https://blog.lifebus.top/");
                    win.on("closed", () => {
                        win = null;
                    });
                }
            },
            {
                label: "关于",
                click: () => {
                    app.setAboutPanelOptions({
                        applicationName: "IYUU Plus Windows",
                        applicationVersion: version,
                        version: version,
                        copyright: "新疆萌森软件开发工作室",
                        authors: ["新疆萌森软件开发工作室", "大卫"],
                        website: "https://blog.lifebus.top/",
                        iconPath: iconPngPath
                    })
                    app.showAboutPanel()
                }
            }
        ]
    }
]

const m = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(m)