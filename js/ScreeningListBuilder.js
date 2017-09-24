/**
 *  az adott hét filmjeiből beteszi a viewba az adott filmjeit
 *  JSONNEL NEM FOGLALKOZIK CSAK BEÉRKEZŐ TÖMBÖT DARABOL
 *  @param weekScreeningArray
 *  @param weekStarterDay
 */

(function ($) {
    ScreeningListBuilder = function () {
        this.oneWeekMilisec = 86400000;
        this.screenTimes = ["16:00:00","19:00:00","22:00:00"];
        this.showMoviesModal = 'showMoviesModal';
        this.deleteFilm = 'deleteFilm';
        this.screenItemTemplate = 'screenItemTemplate';
        this.dayNumberAttr = 'data-daynumber';
        this.itemScreenTimeAttr = 'data-screen-time';
        this.dataScreenItemScreentime = 'data-screen-item-screentime';
        this.dataScreenItemScreenDatetime = 'data-screen-item-screen-datetime';
        this.weekItemContent = 'weekItemContent';
        this.screenItem = 'screenItem';
        this.weekItem = 'weekItem';
    };

    /* just movie full with datas */
    ScreeningListBuilder.prototype.buildScreenItems = function (screenList, movieList, weekStarterDay) {
        var self = this;
        var screenListJson = screenList;
        var movieListJson = movieList;

        $('[data-class="'+self.weekItemContent+'"]').each(function (i) {
            /* create screentime param from weekStarterDay & screenTimes*/
            var dayNumber = $(this).closest($('[data-class="'+self.weekItem+'"]')).attr(self.dayNumberAttr);
            var dayNumberDate = parseInt(weekStarterDay) + (dayNumber * self.oneWeekMilisec);
            var date = new Date(dayNumberDate);
            var currDate = date.getDate();
            var currMonth = ('00' + (date.getMonth() + 1)).slice(-2); // need zerofill
            var currYear = date.getFullYear();
            var dateString = currMonth + "/" + currDate + "/" + currYear;

            $(this).children($('[data-class="'+self.screenItem+'"]')).each(function (x) {


                var screenItemScreenTime = $(this).attr(self.itemScreenTimeAttr);
                var newDateArray = [];
                newDateArray.push(dateString);
                newDateArray.push(screenItemScreenTime);
                var screenTime = newDateArray.join(" ");
                var setScreenTimeAttr = Date.parse("" + screenTime);

                $(this).attr(self.dataScreenItemScreenDatetime, screenTime);
                $(this).attr(self.dataScreenItemScreentime, setScreenTimeAttr);

                /* checking movie screen time in json object*/

                if (screenListJson !== undefined) {

                    var screeningsObj = getObjects(screenListJson, "Time", parseInt(setScreenTimeAttr));
                    var screeningsObjId = getValues(screeningsObj, "Id");


                    if (screeningsObj.length) { // insert screen
                        var moviesObj = getObjects(movieListJson, "Id", screeningsObjId);

                        var replaceItem = self.setScreenItem(moviesObj);
                        /* clear button state*/
                        $(this).find('[data-class="'+ self.showMoviesModal +'"]').removeAttr("disabled");
                        $(this).find('[data-class="' + self.deleteFilm + '"]').removeAttr("disabled");

                        /* init button state*/
                        $(this).find('[data-class="' + self.showMoviesModal + '"]').attr("disabled", 'disabled');

                        /* clear previous screenItem*/
                        $(this).find('[data-class="' + self.screenItemTemplate + '"]').children("div").remove();

                        /* init screenItem */
                        $(this).find('[data-class="' + self.screenItemTemplate + '"]').prepend(replaceItem);

                    } else { // remove screen
                        /* clear button state*/
                        $(this).find('[data-class="' + self.showMoviesModal + '"]').removeAttr("disabled");
                        $(this).find('[data-class="' + self.deleteFilm + '"]').removeAttr("disabled");

                        /* init button state*/
                        $(this).find('[data-class="' + self.deleteFilm + '"]').attr("disabled", 'disabled');

                        /* clear previous screenItem*/
                        $(this).find('[data-class="' + self.screenItemTemplate + '"]').children("div").remove();

                    }

                }


            });


        });

    };

    ScreeningListBuilder.prototype.setScreenItem = function (Obj) {
        var template = '<div class="screen-item-content col-md-12" data-class="screenItemContent"> ' +
            '<div class="row"><div class="col-md-3">' +
            '<div class="screen-item-poster" data-class="screenItemPoster">' +
            '<img class="img-fluid" src="[[screenItemPoster]]" alt=""/>' +
            '</div>' +
            '</div>' +
            '<div class="col-md-9">' +
            '<div class="screen-item-title-wrapper">' +
            '<span class="screen-item-title" data-class="screenItemTitle">[[screenItemTitle]]</span>' +
            '<span class="screen-item-year" data-class="screenItemYear">[[screenItemYear]]</span>' +
            '</div>' +
            '<div class="screen-item-infos">' +
            '<span class="screen-item-rated" data-class="screenItemRated">[[screenItemRated]]</span>' +
            '<span class="screen-item-runtime" data-class="screenItemRuntime">[[screenItemRuntime]]</span><span class="screen-item-runtime-min"> min</span>' +
            '<span class="screen-item-genre" data-class="screenItemGenre">[[screenItemGenre]]</span>' +
            '</div>' +
            '<div class="screen-item-desc" data-class="screenItemPlot">[[screenItemPlot]]</div>' +
            '<div class="screen-item-director"><strong>Director: </strong><span data-class="screenItemDirector">[[screenItemDirector]]</span></div>' +
            '<div class="screen-item-actors"><strong>Actors: </strong><span data-class="screenItemActors">[[screenItemActors]]</span></div>' +
            '</div>' +
            '</div>' +
            '</div>';

        var replaceTitle = getValues(Obj, "Title");
        var replaceYear = getValues(Obj, "Year");
        var replaceRated = getValues(Obj, "Rated");
        var replaceRuntime = getValues(Obj, "Runtime");
        var replaceGenre = getValues(Obj, "Genre");
        var replaceDirector = getValues(Obj, "Director");
        var replaceActors = getValues(Obj, "Actors");
        var replacePlot = getValues(Obj, "Plot");
        var replacePoster = getValues(Obj, "Poster");

        return template
            .replace("[[screenItemPoster]]", replacePoster)
            .replace("[[screenItemTitle]]", replaceTitle)
            .replace("[[screenItemYear]]", replaceYear)
            .replace("[[screenItemRated]]", replaceRated)
            .replace("[[screenItemRuntime]]", replaceRuntime)
            .replace("[[screenItemGenre]]", replaceGenre)
            .replace("[[screenItemPlot]]", replacePlot)
            .replace("[[screenItemDirector]]", replaceDirector)
            .replace("[[screenItemActors]]", replaceActors);
    };

    ScreeningListBuilder.prototype.initScreenItemWrappers = function () {
        var self = this;

        /* TODO ide nem prepend kéne de replace-el nem ment */
        $('[data-class="' + self.weekItemContent + '"]').each(function (i) {
            $(this).prepend(self.buildScreenItemWrappers());
        });
    };

    ScreeningListBuilder.prototype.buildScreenItemWrappers = function () {
        var self = this;
        var buildedTemplate = "";

        var template = '<div class="screen-item row" data-screen-time="[[dataScreenTime]]" data-screen-item-screentime="[[dataScreenItemScreenTime]]" data-class="screenItem"> ' +
            '<div class="col-md-9" data-class="screenItemTemplate"></div>' +
            '<div class="screen-item-actions col-md-3" data-class="screenItemActions">' +
            '<div class="screen-item-time"><span class="start-screening">Start screening: </span><span class="screen-item-time-text" data-class="screenItemTimeText">[[screenItemTimeText]]</span></div> ' +
            '<div class="clearfix"></div> ' +
            '<button class="btn btn-success" data-class="showMoviesModal">New Film</button> ' +
            '<div class="clearfix"></div>' +
            '<button class="btn btn-danger" data-class="deleteFilm">Delete</button></div></div>';

        for (var i = 0; i < self.screenTimes.length; i++) {
            buildedTemplate += template.replace("[[dataScreenTime]]", self.screenTimes[i]).replace("[[screenItemTimeText]]", self.screenTimes[i]);
        }

        return buildedTemplate;

    };


})(jQuery);