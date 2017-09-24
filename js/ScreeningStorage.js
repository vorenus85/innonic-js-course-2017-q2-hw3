/**
*
* kiszedegeti a screening json-ból az adott hét vetítéseit
*
 * */
(function ($) {
    ScreeningList = function () {
        this.oneWeekMilisec = 86400000;
    };

    ScreeningList.prototype.initList = function (starter, jsonSource){
        var self = this;

        var screenJson = new JsonHandler(jsonSource);
        var screenList = screenJson.getData();

        var weekStarterDay = parseInt(starter);
        var nextWeekStarterDay = parseInt(starter + (7 * self.oneWeekMilisec));
        var newList = [];
        for (var i = 0; i < screenList.length; i++) {
            if(screenList[i].Time > weekStarterDay && screenList[i].Time < nextWeekStarterDay){
                newList.push(screenList[i]);
            }
        }

        return newList;
    };

    ScreeningList.prototype.addToList = function (fullObj, newObjItem) {
        fullObj.push(newObjItem);
        var newObj = fullObj;
        var jsonHandler = new JsonHandler();
        jsonHandler.saveToJson(newObj);
    };

    ScreeningList.prototype.removeFromList = function (obj, removeScreenTime) {

        /* resource: http://jsfiddle.net/aPH7m/1/ */
        function removeFunction(myObjects, prop, valu) {
            var newArray = myObjects.filter(function (val) {
                return val[prop] !== valu;
            });
            return newArray;
        }

        var newObj = removeFunction(obj, "Time", removeScreenTime);

        var jsonHandler = new JsonHandler();
        jsonHandler.saveToJson(newObj);
    };

})(jQuery);