var pdfGenerator = (function () {

    var db;

    function saveSettings() {
        db.open().catch(function (error) {
            alert('Uh oh: ' + error);
        });

        var settings = {
            id: 1,
            engineer: $('#engineer').val(),
            ccMail: $('#ccMail').val(),
            subject: $('#emailSubject').val(),
            body: $('#emailMessage').val(),
            pdfHtmlTemplate: $('#rawhtml').val(),
            receiptStartNr: $('#receiptStartNr').val(),
            receiptNrStep: $('#receiptNrStep').val()
        };
        db.settings.put(settings);      

        loadSettings();
    }    

    function loadSettings() {
        db.open().catch(function (error) {
            alert('Uh oh: ' + error);
        });

        db.settings.get(1).then((settings) => {
            var pdfHtmlTemplate = settings && settings.pdfHtmlTemplate || defaultTemplate();

            $('#engineer').val(settings.engineer);
            $('#ccMail').val(settings.ccMail);
            $('#emailSubject').val(settings.subject);
            $('#emailMessage').val(settings.body);
            $('#rawhtml').val(pdfHtmlTemplate);
            $('#receiptStartNr').val(settings.receiptStartNr);
            $('#receiptNrStep').val(settings.receiptNrStep);

            if (!$('#nextReceiptNr').val()) {
                $('#nextReceiptNr').val($('#receiptStartNr').val());
            }
        });

        db.receipts.orderBy('receiptNr').last().then((last) => {
            increaseReceiptNr(last.receiptNr);
        });
    }
    
    function resetDefault() {
        $('#rawhtml').val(defaultTemplate());
    }

    function defaultTemplate() {
        var defaultTemplate = `<!doctype html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <title>Report</title>
   </head>
   <body>
      <header>
         <img src="http://www.example.org/put/your/logo_here.png" alt="Firmenlogo" height="130" width="380" />
         <h1>Arbeitsrapport</h1>
         <p>Rapportnummer: @@RAPPORTNR@@</p>
         <p>Techniker: @@TECHNIKER@@</p>
      </header>
      <article>
         <section>
            <h4>Kunde</h4>
            <p>
                @@NAME@@<br />
                @@ADRESSE@@<br />
                @@POSTLEITZAHL@@ @@ORT@@
            </p>
         </section>
         <section>
            <h4>Startzeit</h4>
            <p>@@STARTZEIT@@</p>
            <h4>Endzeit</h4>
            <p>@@ENDZEIT@@</p>
            <h4>Dienstleistung</h4>
            <p>@@DIENSTLEISTUNG@@</p>
            <h4>Material</h4>
            <p>@@MATERIAL@@</p>
         </section>
         <section>
            <h4>Unterschrift</h4>
            <p><img src="@@UNTERSCHRIFT@@" alt="Unterschrift" style="width: 400px; height: auto;" /></p>
            <p>@@UNTERZEICHNETVON@@</p>
            <p>@@ORT@@, am @@DATUM@@</p>
         </section>
      </article>
   </body>
</html>`;

        return defaultTemplate;
    }

    function getCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        return dd + '.' + mm + '.' + yyyy;
    }

    function substitutePlacholders(data) {               
        data = data.replace(/@@RAPPORTNR@@/g, getNextReceiptNr());
        data = data.replace(/@@TECHNIKER@@/g, $('#engineer').val());
        data = data.replace(/@@DATUM@@/g, getCurrentDate());

        data = data.replace(/@@NAME@@/g, $('#name').val());
        data = data.replace(/@@ADRESSE@@/g, $('#address').val());
        data = data.replace(/@@POSTLEITZAHL@@/g, $('#zipCode').val());
        data = data.replace(/@@ORT@@/g, $('#city').val());

        data = data.replace(/@@STARTZEIT@@/g, $('#startTime').val());
        data = data.replace(/@@ENDZEIT@@/g, $('#endTime').val());

        data = data.replace(/@@DIENSTLEISTUNG@@/g, $('#serviceDescription').val().replace(/\r\n|\n|\r/g, '<br />'));
        data = data.replace(/@@MATERIAL@@/g, $('#material').val().replace(/\r\n|\n|\r/g, '<br />'));

        data = data.replace(/@@UNTERSCHRIFT@@/g, getSignature());
        data = data.replace(/@@UNTERZEICHNETVON@@/g, $('#signatureName').val() || $('#name').val());

        return data;
    }

    function getSignature() {
        return $('#signature').jSignature("getData", "default");
    }

    function success(msg) {
        if (!$.isEmptyObject(msg)) {
            $('#baseH').html('base64:' + msg.replace('\n', ''));
        }

        progressHide();
    }

    function failure(err) {
        console.error('->', err);
        console.alert('An error has ocurred: ', err);

        progressHide();
    }

    function progressShow() {
        if (!$.isEmptyObject(window.cordova)) {
            SpinnerPlugin.activityStart("Generiere PDF...", {
                dimBackground: true
            });
        }
    }

    function progressHide() {
        if (!$.isEmptyObject(window.cordova)) {
            SpinnerPlugin.activityStop();
        }
    }
    
    function sendPdfPerMail() {
        // TODO only continue here if all required data is valid!
        // otherwise an unncecessary receipt number would be generated

        pdf.htmlToPDF({
            data: substitutePlacholders($('#rawhtml').val()),
            documentSize: "A4",
            landscape: "portrait",
            type: "base64"
        }, function (pdf) {
            progressHide();

            window.plugins.socialsharing.shareViaEmail(
                substitutePlacholders($('#emailMessage').val()), // mesage
                substitutePlacholders($('#emailSubject').val()), // subject
                $('#email').val(), // to
                $('#ccMail').val(), // cc
                null, // bcc
                ["data:application/pdf;base64," + pdf]
                , onSuccess, onError);

            var onSuccess = function (result) {                
                console.log("Share completed? " + result.completed);
                console.log("Shared to app: " + result.app);
            }

            var onError = function (msg) {
                console.log("Sharing failed with message: " + msg);
            }
        }, this.failure);
    }

    function getNextReceiptNr() {
        var receiptStartNr = $('#receiptStartNr').val();
        var nextReceiptNr = $('#nextReceiptNr').val();

        if (receiptStartNr && nextReceiptNr && parseInt(receiptStartNr) > parseInt(nextReceiptNr)) {
            return receiptStartNr;
        }

        return nextReceiptNr;
    }

    function saveReceipt() {
        db.open().catch(function (error) {
            alert('Uh oh : ' + error);
        });

        var customer = {
            name: $('#name').val(),
            zipCode: $('#zipCode').val(),
            city: $('#city').val()
        };               

        var receipt = {
            receiptNr: getNextReceiptNr(),
            timestamp: new Date().toISOString(),
            customer: customer
        };
        var lastReceiptNr = db.receipts.add(receipt)
            .then((lastReceiptNr) => {
                increaseReceiptNr(lastReceiptNr);
            })
            .catch((err) => {
                alert(err);
            });
    }

    function increaseReceiptNr(lastReceiptNr) {
        var increment = $('#receiptNrStep').val();
        $('#nextReceiptNr').val(parseInt(lastReceiptNr) + parseInt(increment));
    }

    return {
        initialize() {
            db = new Dexie('rAPPort2');

            db.version(1).stores({
                settings: 'id' 
            });
            db.version(2).stores({
                settings: 'id',
                receipts: 'receiptNr'
            });

            loadSettings();
        },

        installEventHandlers: function () {
            $('#savePdfTemplate').click(function (e) {
                e.preventDefault();

                saveSettings();
                $("#settings").collapsible("collapse");
            });

            $('#confirmResetToDefaultButton').click(function (e) {
                resetDefault();
            });

            $('#generatePdf').click(function (e) {
                e.preventDefault();

                progressShow();

                var htmlTemplate = $('#rawhtml').val();
                htmlTemplate = substitutePlacholders(htmlTemplate);

                pdf.htmlToPDF({
                    data: htmlTemplate,
                    documentSize: "A4",
                    landscape: "portrait",
                    type: "share"
                }, function (pdf) {
                    progressHide();
                }, this.failure);
            });

            $('#sendPdfPerMail').click(function (e) { 
                e.preventDefault();

                progressShow();

                sendPdfPerMail();
                saveReceipt();
            });
        }
    };
})();
