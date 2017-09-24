(function ($) {
    /* set one week variable */
    var oneWeekMilisec = 86400000;

    /* init weekstarterdate */
    var weekStarterDate = new WeekStarterDate();
    /* set new weekstarterday */
    var newWeekStarterDay = weekStarterDate.getDate();

    /* init new weeklist */
    var weekList = new WeekListHandler();

    /* json sources */
    var screeningListSource = './json/screening.json';
    var movieListSource = './json/movies.json';

    /* init week list */
    weekList.initList(newWeekStarterDay);

    /* init movie storage */
    var movies = new MovieStorage(movieListSource);
    var movieList = movies.initList();

    /* init screen list */
    var screeningList = new ScreeningList();
    var returnScreeningList = screeningList.initList(newWeekStarterDay, screeningListSource);

    /* building screen list items */
    var screeningListBuilder = new ScreeningListBuilder();
    /* init screen list wrapper this is static*/
    screeningListBuilder.initScreenItemWrappers();

    /* init the screens finally :D*/
    screeningListBuilder.buildScreenItems(returnScreeningList, movieList, newWeekStarterDay);

    /* variables */
    var $weeklistNavWrapper = $('[data-class="weeklistNavWrapper"]');
    var $weekList = $('[data-class="weekList"]');
    var $weekText = $('[data-class="weekText"]');
    var $weekNumberInput = $('[data-class="weekNumberInput"]');
    var $screenItem = $('[data-class="screenItem"]');
    var $addToScreen = $('[data-class="addToScreen"]');
    var $chooseMovie = $('#choose-movie');
    /* /variables */

    /* EVENT HANDLERS */

    $weeklistNavWrapper
    /* nav one week back, foward */
        .on('click', '[data-week-nav="prev"], [data-week-nav="next"]', function onWeekClick() {
            var weekStarterDayData = parseInt($weekList.attr('data-starterday'));
            var $clickedButton = $(this);

            var newWeekStarterDayData = $clickedButton.data("week-nav") === "next"
                ? calcNextWeekStarter(weekStarterDayData)
                : calcPrevWeekStarter(weekStarterDayData);

            weekList.initList(newWeekStarterDayData);
            var returnScreeningList = screeningList.initList(newWeekStarterDayData, screeningListSource);
            screeningListBuilder.buildScreenItems(returnScreeningList, movieList, newWeekStarterDayData);
        })
        /* nav to an exact week */
        .on('click', '[data-week-nav="find-week"]', function onFindWeekClick() {
            var weekStarterDayData = parseInt($weekList.attr('data-starterday'));
            var weekNumberData = parseInt($weekText.attr('data-week-number'));
            var newWeekNumberData = parseInt($weekNumberInput.val());

            /* week number validation*/
            if (newWeekNumberData < 1 && newWeekNumberData > 52) {
                alert("Please type a valid week number between 1 and 52");
                return false;
            }
            else if (isNaN(newWeekNumberData)) {
                alert('Please type a number');
                return false;
            }

            var newWeekStarterDay = "";

            /* decrease, increase, equal new week*/
            if (weekNumberData === newWeekNumberData) { //equal
                newWeekStarterDay = weekStarterDayData;

            } else if (weekNumberData > newWeekNumberData) { //decrease
                newWeekStarterDay = weekStarterDayData - ((weekNumberData - newWeekNumberData) * 7 * oneWeekMilisec);

            } else { // increase
                newWeekStarterDay = weekStarterDayData + ((newWeekNumberData - weekNumberData) * 7 * oneWeekMilisec);
            }

            /* clear input */
            $weekNumberInput.val('');

            weekList.initList(newWeekStarterDay);
            var returnScreeningList = screeningList.initList(newWeekStarterDay, screeningListSource);
            screeningListBuilder.buildScreenItems(returnScreeningList, movieList, newWeekStarterDay);

        })
        /* nav to the current week */
        .on('click', '[data-week-nav="current"]', function onCurrentWeekClick() {

            weekList.initList(newWeekStarterDay);
            var returnScreeningList = screeningList.initList(newWeekStarterDay, screeningListSource);
            screeningListBuilder = new ScreeningListBuilder();
            screeningListBuilder.buildScreenItems(returnScreeningList, movieList, newWeekStarterDay);

        });


    $weekList
        /* delete a movie from the screening list */
        .on('click', '[data-class="deleteFilm"]', function onClickDeleteFilm() {
            var removingDataScreenItem = $(this).closest($screenItem).attr('data-screen-item-screentime');

            var fullScreenList = new JsonHandler(screeningListSource);
            var fullScreenListJson = fullScreenList.getData();

            screeningList.removeFromList(fullScreenListJson, removingDataScreenItem);

            $(this).closest('.screen-item').find('[data-class="screenItemContent"]').remove();

            $(this).siblings($('[data-class="showMoviesModal"]')).removeAttr("disabled");
            $(this).attr("disabled", 'disabled');
        })
        /* show movies modal */
        .on('click', '[data-class="showMoviesModal"]', function onClickShowMoviesModal() {
            var screenToTime = $(this).closest($screenItem).attr('data-screen-item-screentime');
            var screenToDateTime = $(this).closest($screenItem).attr('data-screen-item-screen-datetime');

            $addToScreen.attr("screen-to-time", screenToTime);
            $addToScreen.attr("screen-to-datetime", screenToDateTime);

            $chooseMovie.modal();
        });


    $chooseMovie
        /* choose movie */
        .on('click', '[data-class="movieItem"]', function onClickMovieItem() {
            var screenToMovieId = $(this).attr('data-movie-id');

            $('[data-class="movieItem"]').each(function(){
               $(this).addClass("btn-secondary");
            });
            $(this).addClass("btn-primary").removeClass("btn-secondary");

            $addToScreen.attr("screen-to-movie-id", screenToMovieId);
        })
        /* screen movie to list */
        .on('click', '[data-class="addToScreen"]', function onClickaddToScreen() {
            var screenToTime = $(this).attr('screen-to-time');
            var screenToDateTime = $(this).attr('screen-to-datetime');
            var screenToMovieId = $(this).attr('screen-to-movie-id');

            if (screenToTime !== undefined && screenToDateTime !== undefined && screenToMovieId !== undefined) {

                var newScreenTime = {
                    "Date": screenToDateTime,
                    "Time": screenToTime,
                    "Id": screenToMovieId
                };

                var fullScreenList = new JsonHandler(screeningListSource);
                var fullScreenListJson = fullScreenList.getData();

                screeningList.addToList(fullScreenListJson, newScreenTime);

                /* render in screenlist */
                var moviesObj = getObjects(movieList, "Id", screenToMovieId);
                var replaceItem = screeningListBuilder.setScreenItem(moviesObj);

                var $screenToTimeItem = $('[data-screen-item-screentime="' + screenToTime + '"]');

                $screenToTimeItem.find($('[data-class="screenItemTemplate"]')).prepend(replaceItem);
                $screenToTimeItem.find($('[data-class="deleteFilm"]')).removeAttr("disabled");
                $screenToTimeItem.find($('[data-class="showMoviesModal"]')).attr("disabled", 'disabled');

                $chooseMovie.modal('toggle');
            } else {
                alert("Please choose movie or close the window!");
            }

        })
        /* if modal close, remove attrs from success btn, reinit btn-secondary classes*/
        .on('hidden.bs.modal', function () {
            $addToScreen.removeAttr("screen-to-time");
            $addToScreen.removeAttr("screen-to-movie-id");

            $('[data-class="movieItem"]').each(function () {
                $(this).addClass("btn-secondary");
                $(this).removeClass("btn-primary");
            });
        });

    /* /EVENT HANDLERS */

    /* utility functions */
    function calcPrevWeekStarter(elem){
        return parseInt(elem) - (7 * oneWeekMilisec);
    }

    function calcNextWeekStarter(elem) {
        return parseInt(elem) + (7 * oneWeekMilisec);
    }

    /* utility /functions */

})(jQuery);