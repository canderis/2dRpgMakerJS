let $ = require('jquery');
let electron = require('electron')
let remote = electron.remote
let dialog = remote.dialog

$(document).ready(function(){
    this.tilesetEditor = new TilesetEditor();
})

class TilesetEditor{
    constructor(){
        this.selectTilesetWindow();
    }

    selectTilesetWindow(){
        var me = this;
        $('#tileset-menu-btn').addClass('active');
        $('#current-menu-btns').html(
            `<button id='open-tileset' class='btn btn-default'>
                <span class='icon icon-home icon-folder'></span>
                &nbsp;&nbsp;Open Tileset
            </button>`
        );
        $('#open-tileset').click(me.button_openTileset_onClick);


    }

    button_openTileset_onClick(){
        console.log('click');
        console.log(dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}))
    }
}
