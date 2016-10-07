/**
 * Created by vesel on 11.09.2016.
 */

const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const fs = require("fs")
const markdown = require("markdown").markdown
const PathDialogManager = require("./path-dialog-manager")
const FileManager = require("./files")

let gWindow
let gDialogManager
let gFiles
let gCurrentlyOpen = undefined

let createWindow = () => {
	gWindow = new BrowserWindow({
		width: 800,
		height: 800,
		frame: false,
		title: "Paddy 0.1.0",
		'minHeight': 300,
		'minWidth': 300,
		icon: __dirname + "/res/images/icon.png"
	})
	gWindow.loadURL(`file://${__dirname}/index.html`)
	gWindow.on("closed", () => {
		gWindow = null
	})

	gDialogManager = new PathDialogManager(gWindow, app)
	gFiles = new FileManager(app, gWindow)
	gWindow.webContents.on("did-finish-load", () => {
		init()
	})
}

ipcMain.on("save-document", (event, data) => {
	gFiles.saveFile(data)
})

ipcMain.on("load-document", (event, data) => {
	gFiles.openFile((data) => {
		gWindow.webContents.send("show-document", { docData: data })
	})
})

ipcMain.on("export-document", (event, data) => {
	gFiles.exportMarkdown(data)
})

let init = () => {

}

// System events handling

app.on("ready", createWindow)

app.on("window-all-closed", () => {
	if (process.platform !== "darwin")
		app.quit()
})


app.on("activate", () => {
	if (gWindow === null)
		createWindow()
})

ipcMain.on("refresh-page", () => {
	gWindow.loadURL(gWindow.getURL())
})

ipcMain.on("app-exit", () => {
	app.exit(0)
})

ipcMain.on("app-minimize", () => {
	gWindow.minimize()
})

ipcMain.on("log", (event, data) => {
	console.log(data)
})
