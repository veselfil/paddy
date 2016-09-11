/**
 * Created by vesel on 11.09.2016.
 */

const {app, BrowserWindow, ipcMain, dialog} = require("electron")
const fs = require("fs")
const markdown = require("markdown").markdown

let gWindow

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

ipcMain.on("export-document", (event, data) => {
	let htmlContent = markdown.toHTML(data)
	let path = dialog.showSaveDialog(gWindow, {defaultPath: app.getPath("documents") + "/document.html"})
	if(!path) {
		console.log("The path is invalid")
		return;
	}

	fs.readFile("export-template.html", "utf-8", (error,  data) => {
		if(error)
			console.log("Failed to load export template")
		else  {
			let template = data.toString()
			template = template.replace("%::MARKDOWN_CONTENT::%", htmlContent)
			fs.writeFile(path, template, (error) => {
				if (error)
					console.log("Error while saving the file!")

				console.log("Saved successfully.")
			})
		}
	})
})

let init = () => {
}