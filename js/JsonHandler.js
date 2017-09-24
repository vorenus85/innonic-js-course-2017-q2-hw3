/*
 * */
(function ($) {
    JsonHandler = function (url) {
        this.url = url;

    };

    JsonHandler.prototype.getData = function(){
        var self = this;

        return JSON.parse($.ajax({
            type: 'GET',
            url: self.url,
            dataType: 'json',
            global: false,
            async: false,
            success: function (data) {
                return data;
            }
        }).responseText);
    };

    JsonHandler.prototype.saveToJson = function (data) {

        $.ajax ({
            type: 'POST',
            url: './php/savetojson.php',
            dataType: 'json',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                //return result;
            }

        });

    };

})(jQuery);