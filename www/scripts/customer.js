var customer = (function () {
	var db;
	var currentRecord;
    
    function showHideDataFilter(contentAvailable) {
        if (contentAvailable) {
            $('.ui-filterable').show();
        } else {
            $('.ui-filterable').hide();
        }
    }

    function bindToGrid(results2) {
        var html = '';

        results = results2.sort(compare);

        for (var i = 0; i < results.length; i++) {
            var key = results[i].key;
            var contact = results[i].contact;

            html += '<tr><td>' + contact.name + '</td>';
            html += '<td>' + contact.zipCode + ' ' + contact.city + '</td>';
            html += '<td><a class="edit" href="javascript:void(0)" data-key=' + key + '>Auswählen</a></td>';
            html += '<td><a class="confirmDelete" href="#confirmDeleteContactDialog" data-rel="popup" data-position-to="window" data-transition="none" data-key="' + key + '" data-name="' + contact.name + '">Löschen</a></td></tr>';
        }

        showHideDataFilter(html);

        html = html || '<tr><td colspan="4">Keine Stammkunden vorhanden.</td></tr>';
        $('#contacts tbody').html(html);
        $('#contacts a.edit').on('click', customer.loadContact);
        $('#contacts a.confirmDelete').on('click', customer.confirmDeleteContact);
        $('#confirmDeleteContactDialog a.delete').on('click', customer.deleteContact);
    }

    function compare(a, b) {
        if (a.contact.name < b.contact.name) {
            return -1;
        }
        if (a.contact.name > b.contact.name) {
            return 1;
        }
        return 0;
    }

    function displayCurrentRecord() {
        var contact = currentRecord.contact;

        $('#name').val(contact.name);
        $('#address').val(contact.address);
        $('#zipCode').val(contact.zipCode);
        $('#city').val(contact.city);
        $('#email').val(contact.email);
    }

    return {
        initialize: function () {
            $('#btnSave').on('click', customer.save);

            var request = indexedDB.open('rAPPort1', 1);

            request.onupgradeneeded = function (response) {
                var options = { keypath: 'id', autoIncrement: true };
                response.currentTarget.result.createObjectStore("contacts", options);
            };

            request.onsuccess = function (response) {
                db = request.result;
                customer.display();
            };
        },

        display: function () {
            $('#currentAction').html('Kunde hinzufügen');
            currentRecord = { key: null, contact: {} };
            displayCurrentRecord();

            var trans = db.transaction('contacts', 'readonly');
            var request = trans.objectStore("contacts").openCursor();
            var results = [];

            request.onsuccess = function (response) {
                var cursor = response.target.result;
                if (!cursor) {
                    bindToGrid(results);
                    return;
                }
                results.push({ key: cursor.key, contact: cursor.value });
                cursor.continue();
            };
        },

        loadContact: function (e) {
            e.preventDefault();

            var key = parseInt($(this).attr('data-key'));
            var trans = db.transaction('contacts', 'readonly');
            var store = trans.objectStore("contacts");
            var request = store.get(key);

            request.onsuccess = function (response) {
                $('#currentAction').html('Kunde bearbeiten');
                currentRecord = { key: key, contact: response.target.result };
                displayCurrentRecord();
                $("html, body").animate({ scrollTop: 0 }, 400);
            };
        },

        confirmDeleteContact: function (e) {
            var key = parseInt($(this).attr('data-key'));
            var name = $(this).attr('data-name').trim();

            $('#contactName').html(name || "dieser Datensatz");
            $('#confirmDeleteContactButton').attr('data-key', key);
        },

        deleteContact: function (e) {
            var key = parseInt($(this).attr('data-key'));
            var trans = db.transaction('contacts', 'readwrite');
            var store = trans.objectStore("contacts");
            var request = store.delete(key);

            request.onsuccess = function (response) {
                customer.display();
            };
        },

        save: function (e) {
            var contact = currentRecord.contact;
            contact.name = $('#name').val();
            contact.address = $('#address').val();
            contact.zipCode = $('#zipCode').val();
            contact.city = $('#city').val();
            contact.email = $('#email').val();

            var trans = db.transaction('contacts', 'readwrite');
            var contacts = trans.objectStore("contacts");
            var request = currentRecord.key !== null
                ? contacts.put(contact, currentRecord.key)
                : contacts.add(contact);

            request.onsuccess = function (response) {
                customer.display();
            };
        }
    };
})();
