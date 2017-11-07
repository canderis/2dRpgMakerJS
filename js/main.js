let $ = require('jquery')
let electron = require('electron')
let fs = require('fs')
let remote = electron.remote
let dialog = remote.dialog
var sizeOf = require('image-size');

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
		//console.log('existing')
		var dir = dialog.showOpenDialog({
			properties: ['openDirectory']
		})

		if(!dir || dir.length < 1){
			return false
		}
		dir = dir[0]

		//console.log(dir)
		if (fs.existsSync(dir + '/settings.rpg')) {
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

		//console.log(dir)
		if(false){//if dir is !empty{

		}

		fs.mkdir(dir + '/maps', function(err){
			if(err){
				console.log(err)
			}
		})

		fs.mkdirSync(dir + '/assets', function(err){
			if(err){
				console.log(err)
			}
		})
		fs.mkdirSync(dir + '/assets/tilesets', function(err){
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
			//console.log('click')
			me.selectWindow()
		})

		$("#app-window").on('click', '#add-tileset', function(){
			//console.log('click')
			var files = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})

			if(!files || files.length < 1 ){
				return false
			}

			files.forEach(function(path){
				var filename = path.replace(/^.*[\\\/]/, '')
				fs.createReadStream(path).pipe(fs.createWriteStream(me.main.dir + '/assets/tilesets/' + filename ))


				var dimensions = sizeOf(path);
				console.log(dimensions);

				var tilesetInfo = {
					dimensions: dimensions,
					collision: [],
				}

				for(var i = 0; i < dimensions.height / 32; i++ ){
					if(!tilesetInfo.collision[i])
						tilesetInfo.collision[i] = []

					for(var j = 0; j < dimensions.width / 32; j++){
						tilesetInfo.collision[i].push(1)
					}
				}
				console.log(tilesetInfo)

				fs.writeFile(me.main.dir + '/assets/tilesets/'+ filename +'.json', JSON.stringify(tilesetInfo), {flag:'wx'}, function(err){
					if(err){
						console.log(err)
					}
					else{
						console.log('success')
					}
				})

			})

			me.loadTilesets()

		})
	}



	selectWindow(){
		//console.log('settingsSelectedWindow')
		viewChange()

		var me = this
		$('#settings-menu-btn').addClass('active')
		$('#app-window').load('html/settings.html', function(){
			me.loadTilesets()
		})

	}

	loadTilesets(){
		var tilesetHtml = ``
		var me = this;

		fs.readdirSync(me.main.dir + '/assets/tilesets/').forEach(function(tileset){
			if(tileset.includes('.png'))
				tilesetHtml += '<li class="file-list tileset-btn" id ="'+tileset+'" >'+tileset.slice(0, -4)+`&nbsp&nbsp<span class="edit-icon icon icon-pencil"></span></li>`
		})

		//console.log($('#tilesets'))

		$('#tileset-list').html(tilesetHtml)

		$('.tileset-btn').click(function(ev){
			//console.log(ev.target.id)
			$('#tileset-image-viewer').html('<img src="'+ me.main.dir + '/assets/tilesets/'+ ev.target.id +'">')
		})
	}

}

class MapMaker{


	constructor(main){
		var me = this
		me.blankMap = {
			x: 10,
			y: 10,
			events: [],
			layers: [{}],
			tileset: ''
		};
		me.main = main

		$("#editor-menu-btn").click( function(){
			viewChange()
			$('#editor-menu-btn').addClass('active')
			$('#current-menu-btns').load('html/editor_menu.html')
			$('#app-window').load('html/editor.html', function(){
				me.loadMaps()
			})

		})

		$("#app-window").on('click', '#new-map-btn', function(){
			//console.log('click')
			//$('#new-map-form').show()
			me.createNewMapFile()

		})

	}

	createNewMapFile(i = 0){
		var me = this
		fs.writeFile(me.main.dir + '/maps/map'+i+'.json', JSON.stringify(me.blankMap), {flag:'wx'}, function(err){
			if(err){
				if(err.message.includes('EEXIST')){
					me.createNewMapFile(i+1)
				}
				else{
					console.log(err)
				}
			}
			else{
				me.loadMaps()
			}
		})
	}

	loadMaps(){
		var html = ``
		var me = this

		fs.readdirSync(me.main.dir + '/maps/').forEach(function(map){
			if(map.includes('.json'))
				html += '<li class="file-list map-btn" id ="'+map+'" >'+map.slice(0, -5)+`&nbsp&nbsp<span class="edit-icon icon icon-pencil"></span></li>`
		})


		$('#map-list').html(html)

		$('.map-btn').click(function(ev){
			me.loadMap(ev.target.id)
			//$('#tileset-image-viewer').html('<img src="'+ me.main.dir + '/assets/tilesets/'+ ev.target.id +'">')
		})
	}

	loadMap(filename){
		var me = this
		fs.readFile(me.main.dir + '/maps/' + filename, function(err, file){
			if(err){
				console.log(err)
				return;
			}
			var currentMap = JSON.parse(file)
			console.log(me.main.dir +'/assets/tilesets/'+currentMap.tileset)

			$('#map-viewer').click(function(e){
				console.log(Math.floor(e.offsetX / 32), Math.floor(e.offsetX / 32))
			})

			$('#map-viewer').css({'max-width':currentMap.x * 32, height: currentMap.y * 32})
			//$('#tileset').css('background-image', 'url("'+me.main.dir +'/assets/tilesets/'+currentMap.tileset+'")')
			$('#tileset').html(`<svg id='tileset-grid' style='position: absolute;' width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
			    <defs>
			      <pattern id="smallGrid" width="32" height="32" patternUnits="userSpaceOnUse">
			        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="gray" stroke-width="0.8"/>
			      </pattern>
			      <pattern id="grid" width="128" height="128" patternUnits="userSpaceOnUse">
			        <rect width="128" height="128" fill="url(#smallGrid)"/>
			        <path d="M 128 0 L 0 0 0 128" fill="none" stroke="gray" stroke-width="1"/>
			      </pattern>
			    </defs>

			    <rect width="100%" height="100%" fill="url(#grid)" />
			  </svg><img id='tileset-image' style="padding-right: 20px;" src="`+me.main.dir +'/assets/tilesets/'+currentMap.tileset+'">').find( '#tileset-image' ).ready(
		  function(){
			  var height = $('#tileset-image').height()
			  console.log($('#tileset-image').outerHeight())


			  $('#tileset-grid').css('height',height)
			  $('#tileset').click(function(e){
				  console.log('here',e )
				  me.calcTilesetLocation(e.offsetX, e.offsetY)
			  })
		  })

		});

		//
	}
	calcTilesetLocation(x, y){
		var me = this
		me.selectedTile = {x: Math.floor(x/32),y: Math.floor(y/32)};
		console.log(me.selectedTile)
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
