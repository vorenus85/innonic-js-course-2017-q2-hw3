/*
 * megkapjuk az adott hét kezdődátumát
 * */
(function () {
    WeekStarterDate = function () {
        this.oneWeekMilisec = 86400000;
        this.date = new Date();
        this.currDayTime = Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
    };

    /* get current day number 1-7 MON-TUE-WED-THU-FRI. */
    WeekStarterDate.prototype.getCurrDayNum = function () {
        var self = this;
        this.dayNum = self.date.getDay();

        // sunday will be the 7.
        if (this.dayNum === 0) {
            this.dayNum = 7;
        }

        return this.dayNum;
    };

    WeekStarterDate.prototype.getDate = function () {
        var self = this;
        var starterDate = self.currDayTime;
        if (self.getCurrDayNum() != 1) {
            starterDate = self.currDayTime - ( (self.getCurrDayNum() - 1) * self.oneWeekMilisec);
        }

        return starterDate;
    };

})();