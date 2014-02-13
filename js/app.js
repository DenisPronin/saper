requirejs.config({
    baseUrl: 'js',
    paths:{
        'jquery': 'util/jquery-2.0.3',
        'GameParameters': 'Models/GameParametersModel'
    }
});


require(['jquery', 'Models/GameInfoModel', 'Views/GameFieldView'], function($, GameInfoModel, GameView){
    GameInfoModel.createInfo();
    GameView.createView();
});
