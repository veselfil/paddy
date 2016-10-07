/**
 * Created by vesel on 11.09.2016.
 */

const {ipcRenderer} = require("electron")

let textArea = document.querySelector("#fake-textarea")
let control = false

let deltaFontSize = (delta) => {
	if (textArea.style.fontSize == "")
		textArea.style.fontSize = "20px"

	let current = parseInt(textArea.style.fontSize)
	current += delta
	textArea.style.fontSize = current + "px"
}

let handleWindowResize = () => {
	document.documentElement.style.height = (parseInt(window.innerHeight) - 96) + "px"
}

document.querySelector("body").addEventListener("keydown", (event) => {
	if (event.keyCode == 17)
		control = true
	else if (event.keyCode == 116)
		ipcRenderer.send("refresh-page")
	else if (event.keyCode == 107 && control)
		deltaFontSize(1)
	else if (event.keyCode == 109 && control)
		deltaFontSize(-1)
})
document.querySelector("body").addEventListener("keyup", (event) => {
	if (event.keyCode == 17) control = false
})

document.querySelector("#exit-button").addEventListener("click", () => {
	ipcRenderer.send("app-exit")
})

document.querySelector("#collapse-button").addEventListener("click", () => ipcRenderer.send("app-minimize"))
document.querySelector("#save-button").addEventListener("click", () => ipcRenderer.send("save-document", textArea.innerText))
document.querySelector("#load-button").addEventListener("click", () => ipcRenderer.send("load-document"))
document.querySelector("#export-button").addEventListener("click", () => ipcRenderer.send("export-document", textArea.innerText))

ipcRenderer.on("show-document", (event, data) => {
	document.querySelector("#fake-textarea").innerText = data.docData
})

window.onload = function () {
	handleWindowResize()
	window.addEventListener("resize", handleWindowResize)
	window.addEventListener("minimize", handleWindowResize)
	window.addEventListener("maximize", handleWindowResize)
}
