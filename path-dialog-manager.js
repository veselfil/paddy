const {dialog} = require("electron")

class PathDialogManager {
  constructor(contextWindow, app) {
    this.contextWindow = contextWindow
    this.contextApp = app
  }

  getOpenPath(callback) {
    let path = dialog.showOpenDialog(this.contextWindow, {
      defaultPath: this.contextApp.getPath("documents") + "/",
    })

    if(path !== undefined)
      callback(true, path[0])
    else callback(false, "")
  }

// Callback(success, path)
  getSavePath(defaultFilename, callback) {
    let path = dialog.showSaveDialog(this.contextWindow, {
      defaultPath: this.contextApp.getPath("documents") + "/" + defaultFilename
    })

    if (path !== undefined)
      callback(true, path)
    else callback(false, "")
  }
}

module.exports = PathDialogManager
