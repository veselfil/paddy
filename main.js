/**
 * Created by vesel on 11.09.2016.
 */

const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const fs = require("fs")


let gWindow

let createWindow = () => {
	gWindow = new BrowserWindow({
		width: 800,
		height: 800,
		frame: false,
		title: "Paddy 0.1.0",
		'minHeight': 300,
		'minWidth': 300
	})
	gWindow.loadURL(`file://${__dirname}/index.html`)
	gWindow.on("closed", () => {
		gWindow = null
	})

	gWindow.webContents.on("did-finish-load", () => {
		init()
	})
}

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

ipcMain.on("save-document", (event, data) => {
	let path = dialog.showSaveDialog(gWindow, {defaultPath: app.getPath("documents") + "/document.txt"})
	fs.writeFile(path, data, (error) => {
		if (error)
			console.log("Error while saving the file!")

		console.log("Saved successfully.")
	})
})

ipcMain.on("load-document", (event, data) => {
	let path = dialog.showOpenDialog(gWindow, {
		properties: ["openFile"],
		defaultPath: app.getPath("documents") + "/document.txt"
	})[0]

	console.log(path)

	fs.readFile(path, "utf-8", (error,  data) => {
		if (error) console.log("Failed to load the data")
		else {
			let contentString = data.toString()
			console.log(contentString)
			gWindow.webContents.send("show-document", {docData: contentString})
			console.log("Success")
		}
	})
})

let init = () => {
	gWindow.webContents.send("show-document", {docData: "Some interesting stuff"})
}