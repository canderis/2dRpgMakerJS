let $ = require('jquery')
let electron = require('electron')
let fs = require('fs')
let remote = electron.remote
let dialog = remote.dialog

$(document).ready(function(){
	window.program = {}
	window.program.settingsView = new Settings(window.program)
	//console.log(Number(process.version.match(/^v(\d+\.\d+)/)[1]))
	//this.tilesetEditorView = new TilesetEditor(this)
	window.program.newProjectView = new NewProjectView(window.program)
	window.program.mapMaker = new MapMaker(window.program)

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
			this.main.dir = dir
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
		fs.mkdir(dir + '/assets/tilesets', function(err){
			if(err){
				console.log(err)
			}
		})
		fs.writeFile(dir + '/settings.rpg', '', function(err){
			if(err){
				console.log(err)
			}
		})

		this.main.dir = dir

	}

	loadMainView(){
		$('#main-menu-btns').show()
		this.main.settingsView.selectWindow()
	}
}

class Settings{
	constructor(main){
		this.main = main

		//add button listeners
		var me = this
		// $("#app-window").on('click','#settings-menu-btn', function(){
		$('#settings-menu-btn').click(function(){
			console.log('click')
			me.selectWindow()
		})

		$("#app-window").on('click', '#add-tileset', function(){
			console.log('click')
			var files = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})

			if(!files || files.length < 1 ){
				return false;
			}

			files.forEach(function(path){
				//console.log(me.main.dir + '/assets/tilesets/' + path.replace(/^.*[\\\/]/, ''))
				fs.createReadStream(path).pipe(fs.createWriteStream(me.main.dir + '/assets/tilesets/' + path.replace(/^.*[\\\/]/, '')));

				//fs.copyFile(path, )
			})

		})
	}

	selectWindow(){
		console.log('settingsSelectedWindow')
		viewChange()

		var me = this
		$('#settings-menu-btn').addClass('active')
		$('#app-window').load('html/settings.html', function(){
			fs.readdirSync(me.main.dir + '/assets/tilesets/').forEach(function(tileset){
				tilesetHtml += '<li class="tileset-btn" id ="'+tileset+'" >'+tileset.slice(0, -4)+`&nbsp;&nbsp;<span class="icon icon-pencil"></span></li>`
			})
			console.log(tilesetHtml)

			console.log($('#tilesets'))

			$('#tileset-list').html(tilesetHtml);
			$('.tileset-btn').click(function(ev){
				console.log(ev.target.id);
				$('#tileset-image-viewer').html('<img src="'+ me.main.dir + '/assets/tilesets/'+ ev.target.id +'">')
			})
		})

		var tilesetHtml = ``;
	}

}

class MapMaker{
	constructor(main){
		this.main = main

		$("#editor-menu-btn").click( function(){
			viewChange()
			$('#editor-menu-btn').addClass('active')
			$('#app-window').load('html/editor.html')
		})
	}
}

class TilesetEditor{
	// constructor(){
	// 	//add button listeners
	// 	var me = this
	// 	$('#open-tileset').click( function(){
	// 		console.log('clicked')
	//
	// 		me.button_openTileset_onClick()
	// 	})
	// 	$("#tileset-menu-btn").click( function(){
	// 		me.selectWindow()
	// 	})
	// 	// this.selectWindow()
	// }
	//
	// selectWindow(){
	// 	console.log('tilesetSelectedWindow')
	//
	// 	viewChange()
	//
	// 	$('#tileset-menu-btn').addClass('active')
	// 	$('#current-menu-btns').load('html/tileset_menu.html')
	// 	$('#app-window').load('html/tileset.html')
	//
	// }
	//
	// button_openTileset_onClick(){
	// 	console.log('click')
	// 	console.log(dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}))
	// }
}
