const electron = require ('electron');
const url = require ('url');
const path = require ('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

//Set Environment

process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// listen for the app to be ready

app.on('ready', function () {

    // create new window

    mainWindow = new BrowserWindow({});

    // load html into window

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // quit app when closed

    mainWindow.on('closed', function() {
        app.quit();
    });

    // build main menu from template

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    
    // insert menu

    Menu.setApplicationMenu(mainMenu);
});

// Handel add window

function clreateAddWindow() { 

    // create new window

    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    });

    // load html into window

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // gurbage collection handel

    addWindow.on('close', function () {
        addWindow = null;
    })
}

// catch item add

ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// create main menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    clreateAddWindow();
                }
            },
            {
                label: 'Clear Items',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            },
        ]
    }
];

// if mac, add empty object to menu
if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// add developer tool item if not in production

if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}