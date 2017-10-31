let $ = require('jquery')
let electron = require('electron')
let fs = require('fs')
let remote = electron.remote
let dialog = remote.dialog

$(document).ready(function(){
	this.settingsView = new Settings()
	this.tilesetEditorView = new TilesetEditor()
	this.newProjectView = new NewProjectView(this)
})



function viewChange(){
	$("#main-menu-btns > button.active").removeClass("active")
	$('#current-menu-btns').html(``)
}

class NewProjectView{
	constructor(main){
		this.main = main
		var me = this
		$('#main-menu-btns').hide()
		$('#app-window').load('html/new_project.html')

		$("#app-window").on('click', "#new-project-btn", function(){
			me.newProject()
			me.loadMainView()
		})

		$("#app-window").on('click', "#open-project-btn", function(){
			if(me.existingProject()){
				me.loadMainView()
			}
		})

	}
	existingProject(){
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		})

		if(!dir || dir.length < 1){
			return false
		}
		dir = dir[0]

		console.log(dir)
		if (path.existsSync(dir + '/settings.rpg')) {
			return true
		}

		return false


	}


	newProject(){
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory', 'createDirectory']
		})

		if(!dir || dir.length < 1){
			return false
		}
		dir = dir[0]

		console.log(dir)
		if(false){//if dir is !empty{

		}

		fs.mkdir(dir + '/assets', function(err){
			if(err){
				console.log(err)
			}
		})
		fs.writeFile(dir + '/settings.rpg', '', function(err){
			if(err){
				console.log(err)
			}
		})
	}

	loadMainView(){
		$('#main-menu-btns').show()
		this.main.tilesetEditorView.selectWindow()
	}
}

class Settings{
	constructor(){
		//add button listeners
		var me = this
		// $("#app-window").on('click','#settings-menu-btn', function(){
		$('#settings-menu-btn').click(function(){
			console.log('click')
			me.selectWindow()
		})
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
		var me = this
		$('#open-tileset').click( function(){
			console.log('clicked')

			me.button_openTileset_onClick()
		})
		$("#tileset-menu-btn").click( function(){
			me.selectWindow()
		})
		// this.selectWindow()
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
