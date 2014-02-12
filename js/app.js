requirejs.config({
    baseUrl: 'js',
    paths:{
        'jquery': 'util/jquery-2.0.3',
        'GameParameters': 'Models/GameParametersModel'
    }
});


require(['jquery', 'Models/GameInfoModel'], function($, GameInfoModel){
    GameInfoModel.createInfo();
    console.log(GameInfoModel.model);
});
