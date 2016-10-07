const fs = require("fs")
const PathDialogManager = require("./path-dialog-manager")
const {dialog} = require("electron")
const markdown = require("markdown").markdown

class FileManager {
  constructor(app, window) {
    this.contextApp = app
    this.contextWindow = window
    this.dialogManager = new PathDialogManager(this.contextWindow, this.contextApp)
  }

  writeFile(data, path) {
    fs.writeFile(path, data, (error) => {
      if(error)
        throw "An error occurred while writing the file!"
    })
  }

  readFile(path, callback) {
    fs.readFile(path, (error, data) => {
      if(error)
        throw "An error occurred while reading the file!"
      else callback(data)
    })
  }

  exportMarkdown(markdownData) {
    let htmlContent = markdown.toHTML(markdownData)
    try {
      readFile("./export-template.html", (templateData) => {
        saveFile(data.replace("%::MARKDOWN_CONTENT::%", htmlContent))
      })
    } catch(e) {
      dialog.showMessageBox(this.contextWindow, {
        type: "error",
        title: "Error",
        buttons: ["OK"],
        message: e.message
      })
    }
  }
}

class EditorFile {
  constructor(path = undefined, charset = "utf-8") {
    this.path = path
    this.content = content
    this.charset = "utf-8"
  }

  save(fileManager, dialogManager) {
    if(this.path === undefined)
      if(dialogManager === undefined)
        throw "One of the path and dialog manager paratemeters must be set to a value."

      this.path = dialogManager.getSavePath("document.txt", (success, path) => {
        if(success) {
          this.path = path
          fileManager.writeFile(this.content, this.path)
        }
      })
    } else {
      fileManager.writeFile(this.content, this.path)
    }
  }
}

module.exports = Files
module.exports = EditorFile
