jQuery.extend(jQuery.jtsage.datebox.prototype.options.lang, {
    'de': {
        setDateButtonLabel: "Datum setzen",
        setTimeButtonLabel: "Zeit setzen",
        setDurationButtonLabel: "Dauer setzen",
        todayButtonLabel: "Heute",
        titleDateDialogLabel: "Datum wählen",
        titleTimeDialogLabel: "Zeit wählen",
        daysOfWeek: [
            "Sonntag", "Montag", "Dienstag", "Mittwoch",
            "Donnerstag", "Freitag", "Samstag"
        ],
        daysOfWeekShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        monthsOfYear: [
            "Jänner", "Februar", "März",
            "April", "Mai", "Juni",
            "Juli", "August", "September",
            "Oktober", "November", "Dezember"
        ],
        monthsOfYearShort: [
            "Jän", "Feb", "Mär",
            "Apr", "Mai", "Jun",
            "Jul", "Aug", "Sep",
            "Okt", "Nov", "Dez"
        ],
        durationLabel: ["Tage", "Stunden", "Minuten", "Sekunden"],
        durationDays: ["Tag", "Tage"],
        tooltip: "Date Picker öffnen",
        nextMonth: "Nächstes Monat",
        prevMonth: "Voriges Monat",
        timeFormat: 24,
        headerFormat: "%A, %-d. %B %Y",
        dateFieldOrder: ["d", "m", "y"],
        timeFieldOrder: ["h", "i", "a"],
        slideFieldOrder: ["d", "m", "y"],
        datetimeFieldOrder: ["d", "m", "y", "h", "i"],
        dateFormat: "%d.%m.%Y",
        datetimeFormat: "%d.%m.%Y %k:%M",
        useArabicIndic: false,
        isRTL: false,
        calStartDay: 1,
        clearButton: "Löschen",
        durationOrder: ["d", "h", "i", "s"],
        meridiem: ["AM", "PM"],
        timeOutput: "%k:%M", // 12hr: "%l:%M %p", 24hr: "%k:%M",
        durationFormat: "%Dd %DA, %Dl:%DM:%DS",
        calDateListLabel: "Other Dates",
        calHeaderFormat: "%B %Y",
        tomorrowButtonLabel: "Morgen"
    }
});
jQuery.extend(jQuery.jtsage.datebox.prototype.options, {
    useLang: 'de'
});