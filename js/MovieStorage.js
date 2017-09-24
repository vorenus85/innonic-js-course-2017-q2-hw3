/**
 * kiszedegeti a movies.jsonből a filmeket
 */
(function () {
    MovieStorage = function (jsonSource) {
        this.jsonSource = jsonSource;
        var movieList = new JsonHandler(this.jsonSource);
        this.movies = movieList.getData();
    };

    MovieStorage.prototype.initList = function(){
        return this.movies;
    };

})();