let $ = require('jquery')
let electron = require('electron')
let fs = require('fs')
let remote = electron.remote
let dialog = remote.dialog

$(document).ready(function(){
	this.newProjectView = new NewProjectView()
	this.settingsView = new Settings()
	this.tilesetEditorView = new TilesetEditor()
})



function viewChange(){
	$("#main-menu-btns > button.active").removeClass("active")
	$('#current-menu-btns').html(``)
}

class NewProjectView{
	constructor(){
		$('#main-menu-btns').hide();
		$('#app-window').load('html/new_project.html')

		$("#app-window").on('click', "#new-project-btn", this.newProject)

	}

	newProject(){
		console.log('open')
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory', 'createDirectory']
		})

		if(!dir || dir.length < 1){
			return false;
		}
		dir = dir[0];

		console.log(dir)
		if(false){//if dir is !empty{

		}

		fs.mkdir(dir + '/assets', function(err){
			if(err){
				console.log(err);
			}
		})
		fs.writeFile(dir + '/settings.rpg', '', function(err){
			if(err){
				console.log(err);
			}
		});

	}
}

class Settings{
	constructor(){
		//add button listeners
		$("#app-window").on('click','#settings-menu-btn', this.selectWindow)
	}

	selectWindow(){
		console.log('settingsSelectedWindow')
		viewChange()

		$('#settings-menu-btn').addClass('active')
		$('#app-window').load('html/settings.html')
	}

}

class TilesetEditor{
	constructor(){
		//add button listeners
		$("#app-window").on('click','#open-tileset', this.button_openTileset_onClick)
		$("#app-window").on('click', '#tileset-menu-btn', this.selectWindow)
		// this.selectWindow();
	}

	selectWindow(){
		console.log('tilesetSelectedWindow')

		viewChange()

		$('#tileset-menu-btn').addClass('active')
		$('#current-menu-btns').load('html/tileset_menu.html')
		$('#app-window').load('html/tileset.html')

	}

	button_openTileset_onClick(){
		console.log('click')
		console.log(dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}))
	}
}
