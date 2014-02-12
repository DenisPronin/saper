/**
 * Created with IntelliJ IDEA.
 * User: pronin
 * Date: 07.10.13
 * Time: 12:30
 * To change this template use File | Settings | File Templates.
 */

var game_params = {};
document.oncontextmenu = function(){return false};

//$(document).ready(function(){
//    initDefaults();
//    createUI();
//});

function initDefaults() {
    game_params = {
        column_count: 15,
        row_count: 15,
        bombs_count: 30
    };
}

function createUI(){
    createGameTable();
    createBombs();
    createNumbers();
    initHandlers();
    setBalance(game_params.bombs_count);
}

function createGameTable() {
    var table = $('#gameTable');
    var sem = '';
    for(var i=1; i <= game_params.row_count; i++){
        sem += '<tr id="row_' + i + '">';
        for(var j=1; j <= game_params.column_count; j++){
            sem += '<td class="field" id="col_' + i + '_' + j + '"></td>';
        }
        sem += '</tr>'
    }
    table.append(sem);
}

function createBombs(){
    for(var i=0; i < game_params.bombs_count; i++){
        var sel_row = false;
        var num_row = 0;
        while(!sel_row){
            num_row = Math.round(Math.random() * (game_params.row_count - 1) + 1);
            var row_block = $('#row_' + num_row);
            if(num_row <= game_params.row_count && row_block.length > 0 && !isBomb(row_block)){
                sel_row = true;
            }
        }
        var sel_col = false;
        var num_col = 0;
        while(!sel_col){
            num_col = Math.round(Math.random() * (game_params.column_count - 1) + 1);
            var col_block = $('#col_' + num_row + '_' + num_col);
            if(num_col <= game_params.column_count && col_block.length > 0 && !isBomb(col_block)){
//                col_block.css('background', 'red');
                col_block.data('filling', true);
                checkRowFilling(num_row);
                sel_col = true;
            }
        }
    }
}

function createNumbers(){
    var table = $('#gameTable');
    table.find('td').each(function(){
        if(!isBomb(this)){
            var params = getParams(this.id);
            var row_id = params.row;
            var col_id = params.col;
            simplyCalcNumberBombsAround(row_id, col_id);
        }
    });

}

function getNumber(row_id, col_id){
    var number = $('#col_' + row_id + '_' + col_id).data('number');
    if(number){
        return parseInt(number);
    }
    else{
        return null;
    }
}

function checkRowFilling(num_row){
    var row_block = $('#row_' + num_row);
    var count = 0;
    var row_length = row_block.find('td').length;
    row_block.find('td').each(function(){
        if(isBomb($(this))){
            count++;
        }
    });
    if(count == row_length){
        row_block.data('filling');
    }
}

function simplyCalcNumberBombsAround(row_id, col_id){
    var bomb_count = 0;
    var current_block = $("#col_" + (row_id) + "_" + (col_id));
    for(var i = row_id-1; i < row_id + 2; i++){
        for(var j = col_id-1; j < col_id + 2; j++){
            var block = $("#col_" + i + "_" + j);
            var hasBomb = isBomb(block);
            if(hasBomb){
                bomb_count++;
            }
        }
    }
    current_block.data('number', bomb_count);
}

var MOUSE_LEFT_BUTTON = 1;
var MOUSE_SCROLL_BUTTON = 2;
var MOUSE_RIGHT_BUTTON = 3;

var flagged_bombs = 0;

var twoButtons = false;
var super_open = false;

var left = false;
var right = false;

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

function leftHandler($field){
    if(!$field.hasClass('clicked')){
        if(isBomb($field)){
            gameEnd();
        }
        else{
            var params = getParams($field.attr('id'));
            var row_id = params.row;
            var col_id = params.col;
            showNumberBombsAround(row_id, col_id);
        }
    }
}

function rightHandler($field){
    if(!$field.hasClass('clicked')){
        $field.toggleClass('resolute');
        if($field.hasClass('resolute')){
            flagged_bombs++;
        }
        else{
            flagged_bombs--;
        }
        var balance = game_params.bombs_count - flagged_bombs;
        setBalance(balance);
        if(balance == 0){
            win();
        }
    }
}

var checking_fields = [];
function showNumberBombsAround(row_id, col_id){
    var block = $("#col_" + (row_id) + "_" + (col_id));
    if(!block.hasClass('clicked')){
        var number = getNumber(row_id, col_id);
        block.addClass('clicked');
        if(number > 0){
            block.append(number);
            block.css('background', 'green');
        }
        else{
            block.css('background', 'white');
            for(var k=row_id-1; k <= row_id+1; k++){
                var tek_row_num = k;
                if(tek_row_num > 0 && tek_row_num < game_params.row_count +1){
                    for(var n=col_id-1; n <= col_id+1; n++){
                        var tek_col_num = n;
                        if(tek_col_num > 0 && tek_col_num < game_params.column_count +1){
                            if(!(tek_col_num == col_id && tek_row_num == row_id)){
                                var isChecked = false;
                                for(var z=0; z < checking_fields.length; z++){
                                    if(checking_fields[z].row == tek_row_num && checking_fields[z].col == tek_col_num){
                                        isChecked = true;
                                        break;
                                    }
                                }
                                if(!isChecked){
                                    checking_fields.push({row: tek_row_num, col: tek_col_num});
                                    showNumberBombsAround(tek_row_num, tek_col_num);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function gameEnd(){
    var table = $('#gameTable');
    table.find('td').each(function(){
        if(isBomb($(this))){
            $(this).addClass('bomb');
        }
        else{
            leftHandler($(this));
        }
    });
    table.unbind('mousedown');
}

function win(){
    var table = $('#gameTable');
    table.find('td').each(function(){
        if(!isBomb($(this))){
            leftHandler(this);
        }
    });
    table.unbind('mousedown');
    alert('WIN!!!');
}

function isBomb(block){
    return $(block).data('filling');
}

function getParams(id){
    var params = id.split('_');
    var row_id = parseInt(params[1]);
    var col_id = parseInt(params[2]);
    return {row: row_id, col: col_id};
}

function setBalance(balance){
    $('#balance').empty().append(balance);
}

function togetherHandler($field){
    superOpener($field);
}

function superOpener(block){
    if(block.hasClass('clicked')) {
        var id = block.attr('id');
        var coords = getParams(id);
        var row = coords.row;
        var col = coords.col;
        var number_bomb = getNumber(row, col);
        if(number_bomb){
            var around_fields = getFieldsAround(row, col);
            var empty_fields = [];
            var resolute_fields = [];
            for(var i=0; i < around_fields.length; i++){
                var field = around_fields[i];
                if(!field.hasClass('clicked') && !field.hasClass('resolute')){
                    empty_fields.push(field);
                }
                else if(field.hasClass('resolute')){
                    resolute_fields.push(field);
                }
            }
//            Todo: сделать hover ячеек
//            for(var j=0; j < empty_fields.length; j++){
//                empty_fields[j].hover();
//            }

            if(number_bomb === resolute_fields.length){
                for(var j=0; j < empty_fields.length; j++){
                    var empty_coord = getParams(empty_fields[j].attr('id'));
                    showNumberBombsAround(empty_coord.row, empty_coord.col);
                }
            }
        }
    }
}

function getFieldsAround(row_id, col_id){
    var fields = [];
    for(var i=row_id-1; i<row_id+2; i++){
        var tek_row = i;
        if(tek_row > 0 && tek_row < game_params.row_count +1){
            for(var j=col_id-1; j<col_id+2; j++){
                var tek_col = j;
                if(tek_col > 0 && tek_col < game_params.column_count +1){
                    var field = $("#col_" + (tek_row) + "_" + (tek_col));
                    fields.push(field);
                }
            }
        }
    }
    return fields;
}
