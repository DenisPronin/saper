/**
 * Created by pronin on 13.02.14.
 */

define(['jquery', 'Controllers/GameController'], function($, GameController){

    var parameters = GameController.getGameParameters();

    var flagged_bombs = 0;

    var MOUSE_LEFT_BUTTON = 1;
    var MOUSE_SCROLL_BUTTON = 2;
    var MOUSE_RIGHT_BUTTON = 3;

    var left = false;
    var right = false;

    var timer = null;

    function createView(){
        createTable();
        createClockBlock();
        createBalanceBlock();
        initHandlers();
    }

    function createTable(){
        var table_sem = [
            '<table id="gameTable" class="table">',
            '</table>',
            '<div id="controls_container"></div>'
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

    function createClockBlock(){
        var sem = [
            '<div id="clock_container">',
                '<div id="clock">0</div>',
            '</div>'
        ];
        $('#controls_container').append(sem.join(''));
    }

    function startGameTimer(){
        var clock_block = $('#clock');
        timer = setInterval(function(){
            var seconds = parseInt(clock_block.text());
            clock_block.text(++seconds);
        }, 1000);
    }

    function stopGameTimer(){
        clearInterval(timer);
    }

    function createBalanceBlock(){
        var sem = [
            '<div id="balance_container">',
                '<div id="balance_count">' + parameters.bombs_count + '</div>',
            '</div>'
        ];
        $('#controls_container').append(sem.join(''));
    }

    function initHandlers(){
        var table = $('#gameTable');
        table.mousedown(function(e){
            if(e.which == MOUSE_LEFT_BUTTON || e.isTrigger){
                left = true;
                if(right){
                    lightFieldsAround(e);
                }
            }
            if(e.which == MOUSE_RIGHT_BUTTON){
                right = true;
                if(left){
                    lightFieldsAround(e);
                }
            }
        }).mousemove(function(e){
            clearSelection();
            if(right && left){
                lightFieldsAround(e);
            }
        }).mouseup(function(e){
            window.setTimeout(function(){
                handler(e);
            }, 100);
        });
    }

    function handler(e){
        clearHovered();
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
        if($field.hasClass('resolute')){
            return false;
        }
        else if($field.hasClass('clicked')){
            var around_fields = getFieldsAround($field);
            var bomb_count = 0;
            var flag_count = 0;
            for(var k=0; k < around_fields.length; k++){
                var _field = around_fields[k];
                var coord = getCoordFormFieldBlock(_field);
                var fieldData = GameController.chooseField(coord.row, coord.col);
                if(fieldData === 'bomb'){
                    bomb_count++;
                }
                if(_field.hasClass('resolute')){
                    flag_count++;
                }
            }
            if(bomb_count === flag_count){
                showNumbersAround($field);
            }
        }
    }

    function clearHovered(){
        $('.hovered').each(function(){
            $(this).removeClass('hovered');
        });
    }

    function leftHandler($field){
        if(!timer){
            startGameTimer();
        }
        var coord_obj = getCoordFormFieldBlock($field);
        var fieldData = GameController.chooseField(coord_obj.row, coord_obj.col);
        if(!$field.hasClass('clicked') && !$field.hasClass('resolute')){
            if(fieldData === 'bomb'){
                gameOver();
            }
            else if(fieldData === 0){
                showNumbersAround($field);
            }
            else if(fieldData > 0){
                setViewFieldNumber($field, fieldData);
            }
        }
    }

    function rightHandler($field){
        var coord_obj = getCoordFormFieldBlock($field);
        if(!$field.hasClass('clicked')){
            $field.toggleClass('resolute');
            if($field.hasClass('resolute')){
                flagged_bombs++;
            }
            else{
                flagged_bombs--;
            }
            var balance = parameters.bombs_count - flagged_bombs;
            if(balance >= 0 && balance <= parameters.bombs_count){
                setBalance(balance);
            }
            if(balance == 0){
                validWin();
            }
        }
    }

    function lightFieldsAround(e){
        clearHovered();
        var $field = $(e.target);
        var around_fields = getFieldsAround($field);
        for(var k=0; k < around_fields.length; k++){
            around_fields[k].addClass('hovered');
        }
    }

    function getFieldsAround($field){
        var around_fields = [];
        var coord = getCoordFormFieldBlock($field);
        var numRow = coord.row;
        var numCol = coord.col;
        for(var i = numRow-1; i < numRow + 2; i++){
            if(i >= 0 && i < parameters.row_count){
                for(var j = numCol-1; j < numCol + 2; j++){
                    if(j >= 0 && j < parameters.column_count){
                        var $new_field = getFieldBlockByCoord(i, j);
                        around_fields.push($new_field);
                    }
                }
            }
        }
        return around_fields;
    }

    function showNumbersAround($field){
        if(!$field.hasClass('clicked')){
            $field.css('background', 'white').addClass('clicked');
        }
        var coord = getCoordFormFieldBlock($field);
        var numRow = coord.row;
        var numCol = coord.col;
        for(var i = numRow-1; i < numRow + 2; i++){
            if(i >= 0 && i < parameters.row_count){
                for(var j = numCol-1; j < numCol + 2; j++){
                    if(j >= 0 && j < parameters.column_count){
                        var $new_field = getFieldBlockByCoord(i, j);
                        leftHandler($new_field);
                    }
                }
            }
        }
    }

    function setViewFieldNumber($field, number){
        $field.text(number).css('background', 'green').addClass('clicked');
    }

    function gameOver(){
        stopGameTimer();
        var bombs = GameController.getBombs();
        for(var i=0; i < bombs.length; i++){
            var $field = getFieldBlockByCoord(bombs[i].row, bombs[i].col);
            setViewFieldBomb($field);
        }
        $('#gameTable').unbind('mousedown');
    }

    function setBalance(balance){
        $('#balance_count').empty().append(balance);
    }

    function validWin(){
        var correctBomb = 0;
        $('.resolute').each(function(){
            var _coord = getCoordFormFieldBlock($(this));
            var _fieldData = GameController.chooseField(_coord.row, _coord.col);
            if(_fieldData === 'bomb'){
                correctBomb++;
            }
        });
        if(correctBomb === parameters.bombs_count){
            win();
        }
    }

    function win(){
        stopGameTimer();
        $('.field').each(function(){
            if(!$(this).hasClass('clicked') && !$(this).hasClass('resolute')){
                leftHandler($(this));
            }
        });
        $('#gameTable').unbind('mousedown');
        alert('WIN!!!');
    }

    function setViewFieldBomb($field){
        $field.addClass('bomb clicked');
    }

    function getCoordFormFieldBlock($field){
        var params = $field.attr('id').split('_');
        var row_id = parseInt(params[1]);
        var col_id = parseInt(params[2]);
        return {row: row_id, col: col_id};
    }

    function getFieldBlockByCoord(rowNum, colNum){
        return $('#col_' + rowNum + '_' + colNum);
    }

    /*Снятие выделения текста в таблице*/
    function clearSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else { // старый IE
            document.selection.empty();
        }
    }

    return {
        createView: createView,
        setViewFieldNumber: setViewFieldNumber
    }
});