/*
 * megkapjuk az adott hét kezdődátumát
 * */
(function ($) {
    WeekListHandler = function () {
        this.oneWeekMilisec = 86400000;

        this.$weekItem = $('[data-class="weekItem"]');
        this.$weekItemDate = $('[data-class="weekItemDate"]');
        this.$weekText = $('[data-class="weekText"]');
        this.$weekList = $('[data-class="weekList"]');
        this.starterDayAttr = "data-starterday";
        this.weekNumberAttr = "data-week-number";
    }

    WeekListHandler.prototype.weekNumber = function (weekStarterDay) {
        var d = new Date(weekStarterDay);
        return d.getWeek();
    };

    WeekListHandler.prototype.dayDates = function (weekStarterDay) {
        var self = this;
        var dayDates = [];

        for (var i = 0; i <= 6; i++) {
            dayDates.push(weekStarterDay + (i * self.oneWeekMilisec));
        }
        return dayDates;
    };

    WeekListHandler.prototype.initList = function (weekStarterDay) {
        var self = this;
        var datesArray = self.dayDates(weekStarterDay);

        $(self.$weekItem).each(function (i) {
            var d = new Date(datesArray[i]);
            var n = d.toLocaleDateString();
            $(this).find(self.$weekItemDate).text(n);
        });

        self.setWeekStarterDay(weekStarterDay);
        self.setWeekText(self.weekNumber(weekStarterDay));
    };

    WeekListHandler.prototype.setWeekStarterDay = function (elem) {
        var self = this;
        $(self.$weekList).attr(self.starterDayAttr, elem);
    };

    WeekListHandler.prototype.setWeekText = function (elem) {
        var self = this;
        $(self.$weekText).text(elem);
        $(self.$weekText).attr(self.weekNumberAttr, elem);
    };
})(jQuery);