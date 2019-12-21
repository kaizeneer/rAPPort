var signature = (function () {

    return {
        installEventHandlers: function () {
            
        }
    };
})();

var datapair;

$(document).ready(function () {
    $('#customerMenu').click(function () {
        if ($("#signature").html()) {
            datapair = $("#signature").jSignature("getData", "base30");
        }
    });

    $('#timeAndMaterialMenu').click(function () {
        if ($("#signature").html()) {
            datapair = $("#signature").jSignature("getData", "base30");            
        }
    });

    $('#signatureMenu').click(function () {
        $("#signature").html("");
        $("#signature").jSignature();

        if (datapair) {
            $("#signature").jSignature("setData", "data:" + datapair.join(","));
        } 
    });

    $('#copyName').click(function (e) {
        var customerName = $('#name').val();
        $("#signatureName").val(customerName);
    });

    $('#clearSignature').click(function (e) {
        $("#signature").jSignature("reset");
    });
});

