requirejs.config({
    baseUrl: 'js',
    paths:{
        'jquery': 'util/jquery-2.0.3'
    }
});


require(['jquery'], function($){
    $('#gameBlock').append('123');
});
