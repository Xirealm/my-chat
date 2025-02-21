import { app, BrowserWindow } from "electron"
import path from 'path'
// const { app, BrowserWindow } = require('electron')
// const path = require('path')

// 屏蔽安全警告
// ectron Security Warning (Insecure Content-Security-Policy)
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 550,
        resizable: false,
        autoHideMenuBar: true,
        // frame: false,    // 移除窗口边框
        // webPreferences: {
        //     nodeIntegration: true,
        //     contextIsolation: false
        // }
    })

    // win.loadURL('http://localhost:3000')
    // development模式
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        // 开启调试台
        // win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))
    }
}

// Electron 会在初始化后并准备
app.whenReady().then(() => {
    createWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


