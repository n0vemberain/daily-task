const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  version: '1.0.0',
  openWidget: (type) => ipcRenderer.send('widget:open', type),
  closeWidget: (type) => ipcRenderer.send('widget:close', type)
});
