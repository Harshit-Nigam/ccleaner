const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

function createWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    win.loadFile('frontend/index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('scan-files', async () => {
        try {
            const response = await axios.post('http://localhost:3000/scan');
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            return { success: false, threats: [] };
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
