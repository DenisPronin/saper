/**
 * Created by pronin on 13.02.14.
 */

define(['Models/GameInfoModel'], function(Model){

    function getGameParameters(){
        return Model.getGameParameters();
    }

    function chooseField(rowNum, colNum){
        return Model.getFieldData(rowNum, colNum);
    }

    function getBombs(){
        return Model.getBombsCoords();
    }

    return {
        getGameParameters: getGameParameters,
        getBombs: getBombs,
        chooseField: chooseField
    }

});

/*
    События на неоткрытых клетках
    Левый клик
        Если бомба - то:
//            Конец игры
//            Показываю все бомбы
        Если цифра - то:
//            Показываю цифру
        Если флаг, то:
//            ничего не происходит
        Если пусто, то:
//            metka1
//            ищем поля вокруг, для каждого поля:
//                если цифра - показываем.
//                если пусто - go metka1

//    Правый клик
//        Если у поля нет флага - ставим флаг
//        если есть - снимаем флаг
//          Проверка баланса
//    togetherClick, togetherHover
//        выделяем неоткрытые клетки вокруг

    ***
    События на открытых клетках
    Левый клик
//        ничего

    Правый клик
//        если цифра или пусто, то ничего.
//        если флаг
//            снимаем флаг

    togetherClick
//        Если клетка содержит флаг:
//            ничего не происходит
//        Если клетка содержит цифру
//            подсчет бомб вокруг
//            подсчет флагов вокруг
//            если флаги == бомбы
//                metka1
//                ищем поля вокруг, для каждого поля:
//                    если цифра - показываем.
//                    если пусто - go metka1
//            иначе
//                подсвечиваем свободные поля

*/