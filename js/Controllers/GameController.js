/**
 * Created by pronin on 13.02.14.
 */

define(['Models/GameInfoModel', 'Views/GameFieldView'], function(Model, View){

    function getGameParameters(){
        return Model.getGameParameters();
    }

    function chooseField(rowNum, colNum){
        // TODO обработка вариантов содержимого клетки
        var fieldData = Model.getFieldData(rowNum, colNum);
        if(fieldData === 'bomb'){

        }
        else if(fieldData === 'flag'){

        }
        else if(fieldData === 0){

        }
        else if(fieldData > 0){

        }
        console.log(fieldData)
    }

    return {
        getGameParameters: getGameParameters,
        chooseField: chooseField
    }

});

/*
    События на неоткрытых клетках
    Левый клик
        Если бомба - то:
            Конец игры
            Показываю все бомбы
        Если цифра - то:
            Показываю цифру
        Если флаг, то:
            ничего не происходит
        Если пусто, то:
            metka1
            ищем поля вокруг, для каждого поля:
                если цифра - показываем.
                если пусто - go metka1

    Правый клик
        Если у поля нет флага - ставим флаг
        если есть - снимаем флаг
    togetherClick, togetherHover
        выделяем неоткрытые клетки вокруг

    События на открытых клетках
        togetherClick
            Если клетка содержит флаг:
                ничего не происходит
            Если клетка содержит цифру
                подсчет бомб вокруг
                подсчет флагов вокруг
                если флаги == бомбы
                    metka1
                    ищем поля вокруг, для каждого поля:
                        если цифра - показываем.
                        если пусто - go metka1
                иначе
                    подсвечиваем свободные поля

*/