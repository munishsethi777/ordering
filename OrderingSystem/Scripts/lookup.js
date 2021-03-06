var jsonColumns = null;
var xmlDoc = '';
var lookupEnabled = '';
var lookupHdr = '';
var headerEnabled = false;

//  Initialize the LookupModel object
var lookupModel = null;

var rows = null;


$(document).ready(function () {

    //initialise the lookup button
    $('input[islookup=true]').live('focusin', function () {
        if (lookupEnabled != '' && lookupEnabled != this.id) {
            CloseLookup(lookupEnabled);
        }
        if (lookupEnabled != this.id) {
            lookupEnabled = this.id;
            LoadLookupControl(this);
        }
        //clear search values
        $('.modal-header input:text').each(function () {
            this.value = '';
        });
    });

    //manually call search event while click lookup button
    $('button[islookup=true]').bind('click', function () {
        var lookupId = $(this).attr('lookupid');

        //clear previous selected value
        $("#" + lookupId).attr({ text: '', value: '', selectedrow: '' });
        $('#' + lookupId).focus();

        //clear search values
        $('.modal-header input:text').each(function () {
            this.value = '';
        });

        $('#' + lookupId).mcautocomplete('manualSearch');
    });

});

function LoadLookupControl(lookupCtrl) {

    try {
        lookupModel = {
            //ControlName    : '',
            LookupName: '',
            CustomerId: 0,
            SqlType: 0,
            Search: true,
            PageSize: 10,
            PageIndex: 1,
            IsSingle: true,
            Return: false,
            Sql: '',
            OrderField: '',
            OrderBy: 'asc',
            DataTextField: '',
            DataValueField: '',
            SearchItems: [],
            SearchNotField: '',
            SearchNotItems: '',
            SearchTerm: ''
        };

        //for multiple selection
        rows = {
            row: []
        }


        var columnList = new Array();
        var tableHeader = '';
        var tableSearch = '';
        var lookupWidth = 0;


        $.ajaxSetup({ async: false, cache: false });
        $.get('/QuerySections/Query.xml', function (xmlData) {

            // $.parseXML(xmlData);
            xmlDoc = $.xml2json(xmlData);

            //$(xmlDoc)[0].Lookup.each(data, function (i, item) {
            $.each(xmlDoc.Lookup, function (index, item) {
                if (item.LookupName == lookupCtrl.id) {
                    xmlDoc = this;
                    return;
                }
            });

            //        $.post('/Home/AssignLookupProperties', { sLookupName: 'search', sQuery: xmlDoc.Sql },
            //        function (data) {
            //            var d = data;
            //        });

            $(xmlDoc.Columns.Column).each(function (index, item) {

                columnList[index] = "{ name: '" + item.Name + "', style:'padding:0 4px;float:left;" + (item.Style ? item.Style : ";") + "width:" + (item.Width ? (parseInt(item.Width) + 15) : "0") + "px;', valueField: '" + item.Name + "' }"

                tableHeader += '<div style="padding:0 4px;float:left;' + (item.Style ? item.Style : ';') + 'width:' + (item.Width ? (parseInt(item.Width) + 15) : '0') + 'px;"><label fieldName=' + item.FieldName + ' orderBy = "asc" onclick="SortingLookup(this, \'' + xmlDoc.LookupName + '\');" style="float:left;">' + item.Alias + '</label><span class="css_right ui-icon ui-icon-carat-2-n-s"></span></div>';

                if (xmlDoc.DataTextField == item.FieldName)// && xmlDoc.IsSingle == "True")
                    tableSearch += '<input searchlookupid="' + xmlDoc.LookupName + '" onkeyup="ChangeDataTextTerm(this,\'' + xmlDoc.LookupName + '\' );" style="padding:0 4px;float:left;' + (item.Style ? item.Style : ';') + 'width:' + (item.Width ? (parseInt(item.Width) + 15) : '0') + 'px;" class="search" id="' + item.FieldName + '" type="text" /></td>';
                else
                    tableSearch += '<input searchlookupid="' + xmlDoc.LookupName + '" style="padding:0 4px;float:left;' + (item.Style ? item.Style : ';') + 'width:' + (item.Width ? (parseInt(item.Width) + 15) : '0') + 'px;" class="search" id="' + item.FieldName + '" type="text" /></td>';

                //find the width
                lookupWidth = lookupWidth + parseInt((item.Width) ? (parseInt(item.Width) + 15) : 0);

                //for multiple search - to filter item
                if (item.Name == "id")
                    lookupModel.SearchNotField = item.FieldName;
            });


            lookupWidth = lookupWidth + 85;

            tableHeader += '<label onclick="CloseLookup(\'' + xmlDoc.LookupName + '\');" style="float:right;" class="icon-remove"></label>';
            tableSearch += '<label onclick="SearchLookup(1, \'' + xmlDoc.LookupName + '\');" style="float:right;" class="icon-search"></label>';

            //lookup header
            if (xmlDoc.Search == "True")
                lookupHdr = '<div >' + tableHeader + '</div><div style="clear: both;"></div><div>' + tableSearch + '</div>';
            else
                lookupHdr = '<div >' + tableHeader + '</div><div style="clear: both;"></div><div>' + '' + '</div>';

            //lookupHdr = '<div id="lkpDynHeader" class="modal-header">' + lookupHdr + '<div style="clear: both;"></div></div>';
            //$('#lookupHeader').html(lookupHdr);

        });
        jsonColumns = '[' + columnList.join(',') + ']';

        //bind lookup model
        lookupModel.LookupName = lookupCtrl.id;
        lookupModel.Sql = xmlDoc.Sql;
        lookupModel.DataTextField = xmlDoc.DataTextField;
        lookupModel.DataValueField = xmlDoc.DataValueField;
        lookupModel.CustomerId = xmlDoc.CustomerId;
        lookupModel.PageSize = xmlDoc.PageSize;
        lookupModel.OrderField = xmlDoc.OrderField;
        lookupModel.OrderBy = xmlDoc.OrderBy;
        lookupModel.Return = xmlDoc.Return;
        lookupModel.IsSingle = xmlDoc.IsSingle;
        lookupModel.PageIndex = 1;



        // Sets up the multicolumn autocomplete widget.
        //$(lookupCtrl).mcautocomplete({
        $(lookupCtrl).mcautocomplete({
            // These next two options are what this plugin adds to the autocomplete widget.
            showHeader: true,
            isSingle: lookupModel.IsSingle,
            lookupName: lookupCtrl.id,
            lookupHeader: lookupHdr,
            columns: eval(jsonColumns),
            width: lookupWidth,

            // Event handler for when a list item is selected.
            select: function (event, ui) {
                if (lookupModel.IsSingle == "True") { // for single selection
                    this.value = (ui.item[lookupModel.DataTextField] ? ui.item[lookupModel.DataTextField] : '');
                    $(this).attr({ text: ui.item[lookupModel.DataValueField], selectedrow: JSON.stringify(ui.item) });
                }
                else { // for multiselection
                    //alert('multiple');
                    //this.value = (ui.item[lookupModel.DataTextField] ? ui.item[lookupModel.DataTextField] : '');
                    //$(this).attr({ text: ui.item[lookupModel.DataValueField], selectedrow: JSON.stringify(ui.item) });

                    var removed = false;
                    $.map(rows.row, function (el, i) {
                        if (el != undefined && el.id == ui.item.id) {
                            rows.row.splice(i, 1)//rows.row.pop(el);
                            removed = true;
                            return;
                        }
                    });

                    if (!removed) {
                        rows.row.push(
                        {
                            "id": ui.item.id,
                            "text": ui.item[lookupModel.DataValueField],
                            "value": (ui.item[lookupModel.DataTextField] ? ui.item[lookupModel.DataTextField] : ''),
                            "selectedrow": JSON.stringify(ui.item)
                        });
                    }

                }
                return false;
            },

            // The rest of the options are for configuring the ajax webservice call.
            minLength: xmlDoc.SearchLength,
            source: function (request, response) {
                lookupModel.SearchTerm = lookupCtrl.value;

                //to filter multiple search item
                var ids = $.map(rows.row, function (el, i) {
                    return el.id;
                });
                if (ids != "")
                    lookupModel.SearchNotItems = ids.join(',');

                //                // close the lookup
                //                if (lookupEnabled != '')
                //                    CloseLookup(lookupEnabled);

                //clear the ul - lookup rows
                if (lookupModel.IsSingle == "True")
                    $("ul[lookupname-ul='" + lookupModel.LookupName + "']").find('li').empty(); // for single selection
                else
                    $("ul[lookupname-ul='" + lookupModel.LookupName + "']").find('li').not('.selected-row').empty(); // for multiple selection

                $.ajax({
                    url: "/Home/LoadLookup",
                    async: false,
                    type: "POST",
                    data: JSON.stringify(lookupModel),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    error: function (jqXHR, textStatus, errorThrown) {
                        //alert(jqXHR + "-" + textStatus + "-" + errorThrown);
                    },
                    success: function (data, textStatus, jqXHR) {
                        if (data != '')
                            data = JSON.parse(data); // or use eval(data);

                        var result;
                        if (!data || data.length === 0 || !data.rows || data.rows.length === 0) {
                            result = [{ label: 'no match found.'}];
                        }
                        else {
                            $("ul[lookupname-ul='" + lookupModel.LookupName + "']").find('li[class*="norecord"]').remove();
                            result = data.rows;
                        }
                        response(result);
                        lookupModel.SearchItems = [];

                        //lookupModel.PageIndex = 1;
                        //lookupModel.OrderField = '';
                        //lookupModel.OrderBy = '';
                    }
                });
            }
        });
        //extra search
        //        $('.modal-header input:text').live("click", function () {
        //            $(this).focus();
        //        });
        $('.modal-header input:text').live("click", function () {
            $(this).focus();
            $(this).bind('keyup', function () {
                SearchLookup(1, $(this).attr("searchlookupid"));
            });
        });

        //$('#txtPge').val(lookupModel.PageIndex);
    }
    catch (e) {
        var msg = e;
    }
}

function LoadLookup(lookupName) {
    $("#" + lookupName).focus();

}

function PgPrevLookup(lookupName) {

    if (lookupModel.PageIndex > 1)
        lookupModel.PageIndex -= 1;

    //call searching
    //$("#" + lookupName).mcautocomplete('manualSearch');
    SearchLookup(lookupModel.PageIndex, lookupName);
}
function PgNextLookup(lookupName) {

    if ($('.ui-autocomplete li').length < lookupModel.PageSize)
        return;

    if ($("ul[lookupname-ul='" + lookupName + "']").find('li[class*="norecord"]').length > 0)
        return;

    lookupModel.PageIndex += 1;

    //call searching
    //$("#" + lookupName).mcautocomplete('manualSearch');
    SearchLookup(lookupModel.PageIndex, lookupName);
}

function CloseLookup(lookupName) {
    $("#" + lookupName).mcautocomplete('manualClose');
    lookupEnabled = '';

    //clear the lookup values
    ClearLookup(lookupName);

    //clear ul - autocomplete list
    $("ul[lookupname-ul='" + lookupName + "']").find('li').empty();

}

//search on data text field - replace to lookup
function ChangeDataTextTerm(searchText, lookupName) {
    if (lookupModel.IsSingle == "True") {
        $("#" + lookupName).val(searchText.value);
        $("#" + lookupName).keypress();
    }
    else {
        $("#" + lookupName).val('');
    }
}

//select lookup - row/rows
function SelectLookupRow(lookupName) {
    $("#" + lookupName).mcautocomplete('manualClose');
    lookupEnabled = '';

    if (lookupModel.IsSingle == "False") {
        var values = $.map(rows.row, function (el, i) {
            return el.value;
        });
        var texts = $.map(rows.row, function (el, i) {
            return el.text;
        });
        //convert to comma separated value
        if (values != '')
            $("#" + lookupName).val(values.join(","));

        if (texts != '')
            $("#" + lookupName).attr({ text: texts.join(",") });

    }
    //empty the lookup list
    $("ul[lookupname-ul='" + lookupName + "']").find('li').empty();

    if (lookupModel.Return == "True")
        CallbackLookup(lookupName);
}

// select all option from lookup control
function SelectAll(lookupName) {
    $("#" + lookupName).mcautocomplete('manualClose');
    lookupEnabled = '';
    $("#" + lookupName).attr('text', 'ALL');
    $("#" + lookupName).val('ALL');

    //deinitialize
    $.ajaxSetup({ async: true, cache: false });

    if (lookupModel.Return == "True")
        CallbackLookup(lookupName);
}

//for multiple selection
function MultiSelectLookupRow(selectedRow, rowId) {
    $(selectedRow).find('input')[0].checked = $(selectedRow).find('input')[0].checked ? false : true;
    if ($(selectedRow).find('input')[0].checked)
        $(selectedRow).parents('li').addClass('selected-row').find('a').addClass('ui-state-focus-stable');
    else
        $(selectedRow).parents('li').removeClass('selected-row').find('a').removeClass('ui-state-focus-stable');
}

//for multiple selection by check box
function MultiSelectLookupRowByCheckbox(selectedRow, rowId) {
    $(selectedRow)[0].checked = $(selectedRow)[0].checked ? false : true;
}

//for single selection
function SingleSelectLookupRow(selectedRow) {
    $(selectedRow).parents('ul').find('li [class*="ui-state-focus-stable"]').removeClass('ui-state-focus-stable');
    $(selectedRow).parents('li').addClass('selected-row').find('a').addClass('ui-state-focus-stable');
}


// Define a "Person" class that tracks its own name and children, and has a method to add a new child
var row = function (id, value, text, selectedRow) {
    this.id = id;
    this.value = value;
    this.text = text;
    this.selectedRow = selectedRow;
}


// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModel = {
    rows: [
            new row("", "", "", "")
            ]
};

//ko.applyBindings(viewModel);

function ClearLookup(lookupName) {

    //deinitialize
    $.ajaxSetup({ async: true, cache: false });

    $.each(lookupName.split(','), function (index, lookup) {
        $("#" + lookup).attr({ text: '', value: '', selectedrow: '' });
    });

    //multiple selection
    if (rows != null && rows != undefined) {
        rows.row = [];
    }
    if (lookupModel != null && lookupModel != undefined) {

        lookupModel.SearchNotField = '';
        lookupModel.SearchNotItems = '';

        if (lookupModel.Return == "True")
            CallbackLookup(lookupName);
    }
}



//clear search values - lookup
function SearchClearLookup(lookupName) {

    $('.modal-header input:text').each(function () {
        this.value = '';
    });

    //once clear call search again
    SearchLookup(1, lookupName);
}

//sorting lookup values
function SortingLookup(sortField, lookupName) {
    //toggling the order by value
    if ($(sortField).attr("orderBy") == '') {
        $(sortField).attr("orderBy", "asc");
    }

    if ($(sortField).attr("orderBy").toLowerCase() == 'asc') {
        $(sortField).attr("orderBy", "desc");
    }
    else {
        $(sortField).attr("orderBy", "asc");
    }

    lookupModel.OrderField = $(sortField).attr("fieldName");
    lookupModel.OrderBy = $(sortField).attr("orderBy");
    SearchLookup(1, lookupName);
}

function SearchLookup(pageIndex, lookupName) {

    if (lookupName == '' || lookupName == undefined)
        return;

    lookupModel.PageIndex = pageIndex;

    $('.modal-header input:text').each(function () {
        if ($.trim(this.value) == '')
            return;

        var searchfield = this.id;
        var searchvalue = this.value;
        $.each(lookupModel.SearchItems, function (index, val) {

            if (val == undefined)
                return;

            if (val.FieldName == searchfield)
                lookupModel.SearchItems.splice(index, 1);
        });

        // push the search values
        lookupModel.SearchItems.push(
                {
                    "FieldName": this.id,
                    "FieldValue": this.value
                });
    });

    $("#" + lookupName).mcautocomplete('manualSearch');
}

