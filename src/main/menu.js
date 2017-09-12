// 导航条menu

var electron = require('electron')
var app = electron.app
var shell = electron.shell
var Menu = electron.Menu

var template = [{
  label: '编辑',
  submenu: [{
    label: '撤销',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: '重做',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: '剪切',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: '复制',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: '粘贴',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: '全选',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }, ]
}, {
  label: '视图',
  submenu: [
  {
    label: '重新载入',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.reload()
    }
  }, 
  {
    label: '全屏切换',
    accelerator: (function () {
      if (process.platform === 'darwin')
        return 'Ctrl+Command+F'
      else
        return 'F11'
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
    }
  },
  {
    label: 'Toggle Developer Tools',
    accelerator: (function () {
      if (process.platform === 'darwin')
        return 'Alt+Command+I'
      else
        return 'Ctrl+Shift+I'
    })(),
    click: function (item, focusedWindow) {
      if (focusedWindow)
        focusedWindow.toggleDevTools()
    }
  }
  ]
}, {
  label: '窗口',
  role: 'window',
  submenu: [{
    label: '最小化',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: '关闭',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }, ]
}]

if (process.platform === 'darwin') {
  template.unshift({
      submenu: [{
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function () {
          app.quit()
        }
      }, ]
    })
  //   // Window menu.
  // template[3].submenu.push({
  //   type: 'separator'
  // }, {
  //   label: 'Bring All to Front',
  //   role: 'front'
  // })
}
else {

}
var menu = Menu.buildFromTemplate(template)

module.exports = menu
