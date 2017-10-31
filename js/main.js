let $ = require('jquery')
let electron = require('electron')
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

	}
}

class Settings{
	constructor(){
		//add button listeners
		$('#settings-menu-btn').click(this.selectWindow)
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
		$('#open-tileset').click(this.button_openTileset_onClick)
		$('#tileset-menu-btn').click(this.selectWindow)
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
