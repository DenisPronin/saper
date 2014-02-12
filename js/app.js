requirejs.config({
    baseUrl: 'js',
    paths:{
        'jquery': 'util/jquery-2.0.3'
    }
});


require(['jquery', 'Models/GameInfoModel'], function($, GameInfoModel){
    GameInfoModel();
});
