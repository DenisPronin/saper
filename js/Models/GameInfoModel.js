/**
 * Created by pronin on 12.02.14.
 */

define(['GameParameters'], function(GameParameters){

    var game_info_object = [];
    var bombs_array = [];
    var parameters = getGameParameters();

    function createInfo(){
        createEmptyModel();
        createBombs();
        createNumbers();
    }

    function createEmptyModel(){
        var rowCount = parameters.row_count;
        var columnCount = parameters.column_count;
        for(var i=0; i<rowCount; i++){
            var column = [];
            for(var j=0; j < columnCount; j++){
                var field_data = {
                    data: null
                };
                column.push(field_data);
            }
            game_info_object.push(column);
        }
    }

    function createBombs(){
        var bombsCount = parameters.bombs_count;

        for(var i=0; i<bombsCount; i++){
            var empty = false;
            var coords;
            while(!empty){
                coords = generateRandomCoord();
                if(coords && !hasBombInField(coords.numRow, coords.numCol)){
                    empty = true;
                }
            }
            setFieldData(coords.numRow, coords.numCol, 'bomb');
            setBombsCoords(coords.numRow, coords.numCol);
        }
    }

    function generateRandomCoord(){
        var rowCount = parameters.row_count;
        var columnCount = parameters.column_count;
        var numRow = 0, numCol = 0;
        var random_num_row = Math.round(Math.random() * (rowCount - 1) + 1);
        if(random_num_row < rowCount){
            numRow = random_num_row;
        }
        var random_num_col = Math.round(Math.random() * (columnCount - 1) + 1);
        if(random_num_col < columnCount){
            numCol = random_num_col;
        }
        return {
            numRow: numRow,
            numCol: numCol
        }
    }

    function createNumbers(){
        var rowCount = parameters.row_count;
        var columnCount = parameters.column_count;
        for(var i=0; i<rowCount; i++){
            var numRow = i;
            for(var j=0; j<columnCount; j++){
                var numCol = j;
                if(!hasBombInField(numRow, numCol)){
                    var number = calcNumberBombAround(numRow, numCol);
                    setFieldData(numRow, numCol, number);
                }
            }
        }
    }

    function calcNumberBombAround(numRow, numCol){
        var numberBomb = 0;
        for(var i = numRow-1; i < numRow + 2; i++){
            if(i >= 0 && i < parameters.row_count){
                for(var j = numCol-1; j < numCol + 2; j++){
                    if(j >= 0 && j < parameters.column_count){
                        if(hasBombInField(i,j)){
                            numberBomb++;
                        }
                    }
                }
            }
        }
        return numberBomb;
    }

    function hasBombInField(numRow, numCol){
        return getFieldData(numRow, numCol) === 'bomb';
    }

    function setFieldData(numRow, numCol, data){
        game_info_object[numRow][numCol].data = data;
    }

    function getFieldData(numRow, numCol){
        return game_info_object[numRow][numCol].data;
    }

    function setBombsCoords(numRow, numCol){
        bombs_array.push({row: numRow, col: numCol});
    }

    function getBombsCoords(){
        return bombs_array;
    }

    function getGameParameters(){
        return GameParameters.default_parameters;
    }

    return {
        createInfo: createInfo,
        getGameParameters: getGameParameters,
        getFieldData: getFieldData,
        setFieldData: setFieldData,
        getBombsCoords: getBombsCoords
    };

});