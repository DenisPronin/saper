/**
 * Created by pronin on 13.02.14.
 */

define(['jquery', 'Controllers/GameController'], function($, GameController){

    var parameters = GameController.getGameParameters();

    var MOUSE_LEFT_BUTTON = 1;
    var MOUSE_SCROLL_BUTTON = 2;
    var MOUSE_RIGHT_BUTTON = 3;

    var left = false;
    var right = false;

    function createView(){
        createTable();
        initHandlers();
    }

    function createTable(){
        var table_sem = [
            '<table id="gameTable" class="table">',
            '</table>'
        ];
        $('#gameContainer').append(table_sem.join(''));

        var field_sem = '';
        for(var i=0; i < parameters.row_count; i++){
            field_sem += '<tr id="row_' + i + '">';
            for(var j=0; j < parameters.column_count; j++){
                field_sem += '<td class="field" id="col_' + i + '_' + j + '"></td>';
            }
            field_sem += '</tr>';
        }
        var table = $('#gameTable');
        table.append(field_sem);
        table[0].oncontextmenu = function(){
            return false
        };
    }

    function initHandlers(){
        var table = $('#gameTable');
        table.mousedown(function(e){
            if(e.which == MOUSE_LEFT_BUTTON || e.isTrigger){
                left = true;
            }
            if(e.which == MOUSE_RIGHT_BUTTON){
                right = true;
            }
        }).mouseup(function(e){
            window.setTimeout(function(){
                handler(e);
            }, 100);
        });
    }

    function handler(e){
        var block = $(e.target);
        if(left && right){
            togetherHandler(block);
        }
        else if(left){
            leftHandler(block);
        }
        else if(right){
            rightHandler(block);
        }
        left = false;
        right = false;
    }

    function togetherHandler($field){
        console.log('together');
    }

    function leftHandler($field){
        var coord_obj = getCoordFormFieldBlock($field);
        GameController.chooseField(coord_obj.row, coord_obj.col);
    }

    function rightHandler($field){
        console.log('right');
    }

    function getCoordFormFieldBlock($field){
        var params = $field.attr('id').split('_');
        var row_id = parseInt(params[1]);
        var col_id = parseInt(params[2]);
        return {row: row_id, col: col_id};
    }

    return {
        createView: createView
    }
});