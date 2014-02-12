/**
 * Created by pronin on 12.02.14.
 */

define(['Models/GameParametersModel'], function(parameters){

    function createInfo(){
        createBombs();
    }

    function createBombs(){

        console.log(parameters);
    }

    return createInfo;

});