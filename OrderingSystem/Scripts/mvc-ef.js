

// *************** initialise variables ***************  //
//for pop-up window
var winWidth = 0;
var winHeight = 0;
var exportGrid = null; // for export grid and filtering
// *************** initialise variables ***************  //

//for reports
var loadReportSessionURL = 'http://12.175.31.136:8082/Home/LoadReport';
//var loadReportSessionURL = 'http://localhost:56667/Home/LoadReport';
//var loadReportSessionURL = 'http://192.168.2.60:84/Home/LoadReport';

var loadReportURL = 'http://12.175.31.136:8082/Home/Report';
//var loadReportURL = 'http://localhost:56667/Home/Report';
//var loadReportURL = 'http://192.168.2.60:84/Home/Report';

var reportParamModel = null;

$(function () {



    // *************** pop-up window ****************  //
    winWidth = $(window).width() - 10;
    winHeight = $(window).height() - 10;

    $("#btnClosePopUp").bind("click", function (e) {
        CloseDialog();
    });

    // *************** pop-up window ****************  //


    // for alert window
    var base = window.alert;
    window.alert = function (message) {
        AlertMsg(message);
    };

    //extensions methods - convert json date to PSE Date string format = /Date(1339439400000)/ to like this  09/14/2013
    /*
    var date = '/Date(1291548407008)/';
    var substringedDate = date.substring(6); //substringedDate= 1291548407008)/
    var parsedIntDate = parseInt(substringedDate); //parsedIntDate= 1291548407008
    var date = new Date(parsedIntDate);  // parsedIntDate passed to date constructor
    var newFormattedDate = $.datepicker.formatDate('mm/dd/yy', date);
    */
    //$.datepicker.formatDate('mm/dd/yy', new Date(Date(data.model.dob)));
    String.prototype.toPSEDate = function () {
        try {
            var jsonDate = this.substring(6); //substringedDate= 1291548407008)/
            jsonDate = parseInt(jsonDate); //parsedIntDate= 1291548407008
            var date = new Date(jsonDate);  // parsedIntDate passed to date constructor
            var newFormattedDate = $.datepicker.formatDate('mm/dd/yy', date);
            return newFormattedDate;
        }
        catch (e) {
            return "";
        }


    }

    // extion method for val() method, to trim and return 0 if null
    $.fn.ival = function () {
        try {
            var value = $.trim(this.val());
            return (value == "") ? 0 : value;
        }
        catch (e) {
            return 0;
        }
    }


    // extion method for val() method, to trim value
    $.fn.sval = function () {
        try {
            return $.trim(this.val());
        }
        catch (e) {
            return "";
        }
    }


    // extion method for val() method, to format the decimal value to 0.00
    $.fn.dval = function () {
        try {
            var value = $.trim(this.val());
            return (value == "") ? 0 : parseFloat(value).toFixed(2);
        }
        catch (e) {
            return 0;
        }


    }

    //close error, success alert while click on form
    $('#tankDetailsTab').bind('mousedown', function () {
        $('#alertDialogError').html('');
        $('#alertDialogSuccess').html('');
        $('#alertError').html('');
        $('#alertSuccess').html('');
    });

    //close error, success alert while click on form
    $('#dialog-add').bind('mousedown', function () {
        $('#alertDialogError').html('');
        $('#alertDialogSuccess').html('');
        $('#alertError').html('');
        $('#alertSuccess').html('');
    });

    //close error, success alert while click on form
    $('form').bind('mousedown', function () {

        $('#alertLoginError').remove(); //for login page only
        $('#alertDialogError').html('');
        $('#alertDialogSuccess').html('');
        $('#alertError').html('');
        $('#alertSuccess').html('');
    });


    //timer for validation
    var timerValidation = null;
    var resultValation = null;

    // Alert message
    $("#dialog-message").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });

    //dialog for confirmation
    $("#dialog-confirm").dialog({
        resizable: true,
        height: 170,
        width: 350,
        modal: true,
        autoOpen: false,
        buttons: {
            'Yes': function () {
                $(this).dialog('close');
                var item = $(this).dialog('option', 'value')
                CallbackConfirmation(true, item);
            },
            'No': function () {
                $(this).dialog('close');
                CallbackConfirmation(false, null);
            }
        }
    });

    //masking
    $("input.psephone").mask("(999) 999-9999");
    $("input.psezipcode").mask("99999");

    //custom masing
    $.mask.definitions['~'] = '[+-]';
    $("input.customnummask").mask("~9.99 ~9.99 999");

    // for date time
    $(".psedatepicker").each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'
        });
    });

    // for date and time
    $(".psedatetimepicker").each(function () {
        $(this).datetimepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'
        });
    });


    // for past date only - no futur date
    $('input[type="text"][class*="psedatepickerpast"]').each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0',
            maxDate: 0
        });
    });

    // for past date only - no futur date
    $(".psegriddatepickerpast").each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0',
            maxDate: 0,
            onSelect: function (selectedDate) {
            },
            dataInit: function (el) {
                $(el).change(function () {
                    var sgrid = $('#tblGrid')[0];
                    sgrid.triggerToolbar();
                });
            }
        });
    });


    // for past date and time only - no futur date
    $(".psedatetimepickerpast").each(function () {
        $(this).datetimepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0',
            maxDate: 0
        });
    });

    //with default date
    $(".psedatepickerdefault").each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'

        });
    });
    $('.psedatepickerdefault').datepicker('setDate', new Date());

    //with default date and time
    $(".psedatetimepickerdefault").each(function () {
        $(this).datetimepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'

        });
    });
    $('.psedatetimepickerdefault').datetimepicker('setDate', new Date());

    //default date -(minus) one month
    $(".psedatepickerlastmonthdefault").each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'
        });
    });
    var lstMonth = new Date();
    lstMonth.setMonth(lstMonth.getMonth() - 1);
    $('.psedatepickerlastmonthdefault').datepicker('setDate', lstMonth);

    //default date and time -(minus) one month
    $(".psedatetimepickerlastmonthdefault").each(function () {
        $(this).datetimepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            yearRange: '1900:+0'
        });
    });
    var lstMonth = new Date();
    lstMonth.setMonth(lstMonth.getMonth() - 1);
    $('.psedatetimepickerlastmonthdefault').datetimepicker('setDate', lstMonth);

    // for date time with disabled the past date, only future date 
    $(".psedatepickerfuture").each(function () {
        $(this).datepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            //yearRange: '1900:+0',
            minDate: 0
        });
    });

    // for date and time with disabled the past date, only future date and time
    $(".psedatetimepickerfuture").each(function () {
        $(this).datetimepicker({
            dateFormat: 'mm/dd/yy',
            changeMonth: true,
            changeYear: true,
            //yearRange: '1900:+0',
            minDate: 0
        });
    });


    /*
    // for date range
    var dates = $('#dtFromDate, #dtToDate').datepicker({
    dateFormat: 'mm/dd/yy',
    changeMonth: true,
    changeYear: true,
    //yearRange: '1900:+0',
    maxDate: 0,
    onSelect: function (selectedDate) {
    var option = this.id == "dtFromDate" ? "minDate" : "maxDate",
    instance = $(this).data("datepicker"),
    date = $.datepicker.parseDate(
    instance.settings.dateFormat ||
    $.datepicker._defaults.dateFormat,
    selectedDate, instance.settings);
    dates.not(this).datepicker("option", option, date);
    }
    });
    //default from date by subtracting 30 days
    var fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
    $('#dtFromDate').datepicker('setDate', fromDate);

    //current date
    $('#dtToDate').datepicker('setDate', new Date());
    */

    // for date range by class name
    var dates = $('input[type="text"][class*="DateDiffMin"], input[type="text"][class*="DateDiffMax"]').datepicker({
        dateFormat: 'mm/dd/yy',
        changeMonth: true,
        changeYear: true,
        //yearRange: '1900:+0',
        maxDate: 0,
        onSelect: function (selectedDate) {
            //var option = this.id == "dtFromDate" ? "minDate" : "maxDate",
            var option = "";

            if (this.classList.contains("DateDiffMin"))
                option = "minDate";
            else
                option = "maxDate";

            instance = $(this).data("datepicker"),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat ||
						$.datepicker._defaults.dateFormat,
						selectedDate, instance.settings);
            dates.not(this).datepicker("option", option, date);
        }
    });
    //default from date by subtracting 30 days
    var fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1);
    $('input[type="text"][class*="RptPreviousMonth"]').datepicker('setDate', fromDate);

    //current date
    $('input[type="text"][class*="RptCurrentMonth"]').datepicker('setDate', new Date());



    //for month selection
    $(".psemonthpicker").datepicker({
        dateFormat: 'MM yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:+0',
        showButtonPanel: true,

        onClose: function (dateText, inst) {
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).val($.datepicker.formatDate('MM yy', new Date(year, month, 1)));
        }
    });

    $(".psemonthpicker").focus(function () {
        $(".ui-datepicker-calendar").hide();
        $("#ui-datepicker-div").position({
            my: "center top",
            at: "center bottom",
            of: $(this)
        });
    });

    //for time picker
    $('.psetimepicker').timepicker({
    });


    //for bootstrap select - dropdown
    $('.selectpicker').selectpicker(
    {
        size: 5
    }
    );

    //Bind an event listener to the select-dropdown change event: 
    $(".selectpicker").on("change", function () {
        $('.selectpicker').selectpicker('render');
        $('.selectpicker').selectpicker('refresh');
    });


    // for progress bar
    $("#bodySectionProgress").bind("ajaxStart", function () {
        box2 = new ajaxLoader(this, { classOveride: 'blue-loader' });
        //alert('start');
        //box2 = new ajaxLoader(this, { classOveride: 'blue-loader' });
    });


    $("#bodySectionProgress").bind("ajaxStop", function () {
        if (box2) box2.remove();
        //alert('stop');
    });


    //disable the right click function
    //DisableRightClick();

});

function OpenReport(rptModel) {

    //window.moveTo(0, 0);
    //window.resizeTo(screen.availWidth, screen.availHeight);
    var feature = 'status=yes,scrollbars=yes,width=' + screen.availWidth + ',height=' + (screen.availHeight - 50);
    $.ajax({
        url: loadReportSessionURL,
        jsonp: 'callback',
        dataType: 'jsonp',
        crossDomain: true,
        data: { model: JSON.stringify(rptModel) },
        success: function (data) {
            if (data.result) {
                window.open(loadReportURL + '/' + data.sessionid, '_blank', feature);
            }
            else
                alert('Error');
        },
        error: function (data) {
            alert('Error');
        }
    });
}

//clear the form fields
function ClearForm() {
    try {

        //clear hidden ctrl = 0
        $('form input[type=hidden]').each(function () {
            $(this).val('0');
        });

        //clear text ctrl = 0
        $('form input[type=text]').each(function () {
            $(this).val('');
        });
        $('form input[type=password]').each(function () {
            $(this).val('');
        });

        //drop down controls
        $('form select').each(function () {
            $(this)[0].selectedIndex = 0;
            $(this).change();
        });

    }
    catch (e) {
        ScriptDialogError(e);
    }
}

//******************* jqGrid ********************************//
//this event fires once load completion
function LoadComplete(gridName) {

    //alert('complted');
    $('#' + gridName).bind('jqGridLoadComplete', function (e, data) {

//        if (this.p.records === 0) {
//            setTimeout(function () {
//                alert("No Matches Found.");
//            }, 500);
//        }

        if ($(this).jqGrid('getGridParam', 'reccount') == 0) {
            $(".ui-jqgrid-hdiv").css("overflow-x", "auto")
        }
        else {
            $(".ui-jqgrid-hdiv").css("overflow-x", "hidden")
        }
    });
}

// Dialog - Delete Entry
function DeleteItem(prmId) {
    Confirmation('Are you sure to delete?', prmId);
}

//generate grid param - for filtering
function GenerateExportParam(gridName) {
    exportGrid = {
        ExportType: '',
        ColumnList: []
    }
    var columns = $('#' + gridName).jqGrid('getGridParam', 'colModel')
    $.each(columns, function (index, item) {
        if (item.name != 'Action' && item.name != 'cb' && item.hidden == false) {
            exportGrid.ColumnList.push({
                "ColumnName": item.name,
                "ColumnAlias": item.label,
                "Hidden": item.hidden
            });
        }
    });
    //return ExportGrid; 
}

//export as pdf
function ExportExcel(gridName) {
    //set manual parameters
    var loadUrl = $('#' + gridName).jqGrid('getGridParam', 'url');

    //$('#' + gridName).jqGrid('setGridParam', { 'datatype' : 'json' });
    $('#' + gridName).setGridParam({ url: loadUrl + "?bExport=True" });
    $('#' + gridName).trigger("reloadGrid");
    $('#' + gridName).setGridParam({ url: loadUrl });
}

//reload/refresh the jqGrid
function ReloadGrid(gridName) {
    $('#' + gridName).jqGrid('setGridParam', { 'datatype': 'json' });
    $('#' + gridName).trigger("reloadGrid");
}

//hide and show the column - runtime
function GridColumnChooser(gridName) {
    var grid = $('#' + gridName);
    grid.jqGrid('navButtonAdd', '#pager',
                     { caption: "Hide/Show", buttonicon: "ui-icon-calculator",
                         title: "Hide/Show Columns",
                         onClickButton: function () {
                             grid.jqGrid('columnChooser');
                         }
                     });
}

//hide the grid columns
function HideGridColumn(gridName, columns) {
    var grid = $('#' + gridName);
    grid.jqGrid('hideCol', columns);

    $.each(columns, function (index, item) {
        grid.jqGrid('setColProp', item, { classes: 'Hide' });
    });

}
//******************* jqGrid ********************************//

//******************* dialog - pop-up window ********************************//
function OpenDialog() {
    $('#dialog-add').dialog('open');
}
function CloseDialog() {
    if ($("#dialog-add").closest('.ui-dialog').is(':visible'))
        $('#dialog-add').dialog('close')

    //$('#dialog-add').dialog('close');
}
function ClearDialog() {
    $('#dialog-add').html('');
}
//******************* jqGrid ********************************//


//to load the vertical menu pages
function LoadVerticalMenu(page, menuId) {
    $('#horizontalMenu').find('li[class=ActiveMenu]').removeClass();
    if (page != null)
        $(page).parent('li').addClass('ActiveMenu');

    $.post('/NavMenu/VerticalMenuById', { iMenuId: menuId }, function (data) {
        window.location.pathname = '/Home/Home'; //window.location.pathname = '/DMS/DMS/Index';
        $('#bodySection').html('');
        $('#verticalMenuSection').html(data);
    }
    );
}

//to load the vertical menu pages
function SelectVerticalMenu(page, pageId) {
    $('#verticalMenu').find('li[class=ActiveMenu]').removeClass();
    $(page).parent('li').addClass('ActiveMenu');
    //$.post('/NavMenu/SelectVerticalMenu', { iPageId: pageId }, function (data) {});
    $.ajax({
        type: 'POST',
        url: '/NavMenu/SelectVerticalMenu',
        data: { iPageId: pageId },
        async: false,
        success: function (data) {

        }
    });
}

function RedirectMenuURL(path) {
    window.location.pathname = path;
}

//confirmation yes/no
function Confirmation(msg, item) {
    $("#dialog-confirm .confirmmsg").text(msg);
    $("#dialog-confirm").dialog('option', 'value', item);
    $("#dialog-confirm").dialog('open');
}


// alert msg prototype
function AlertMsg(msg) {
    $("#dialog-message .confirmmsg").text(msg);
    $("#dialog-message").dialog("open");
}
// alert msg prototype - for pop-up window
function AlertDialogSuccess(msg) {

    $("#alertDialogSuccess").css('display', 'block');
    var success = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><span>" + msg + "</span></div>";
    $("#alertDialogSuccess").html(success);
}
// alert msg prototype - pop - up window
function AlertDialogError(msg) {
    $("#alertDialogError").css('display', 'block');
    var error = "<div class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button><span>" + msg + "</span></div>";
    $("#alertDialogError").html(error);
}

// alert msg prototype - for main page
function AlertSuccess(msg) {
    $("#alertSuccess").css('display', 'block');
    var success = "<div class='alert alert-success'><button type='button' class='close' data-dismiss='alert'>&times;</button><span>" + msg + "</span></div>";
    $("#alertSuccess").html(success);
}
// alert msg prototype - main page
function AlertError(msg) {
    $("#alertError").css('display', 'block');
    var error = "<div class='alert alert-error'><button type='button' class='close' data-dismiss='alert'>&times;</button><span class='errorMsg'>" + msg + "</span></div>";
    $("#alertError").html(error);
}

function ScriptError(ex) {
    if ($('#hdnLoginRoleId').val() == "2")
        AlertError(ex);
    else
        AlertError('Runtime script error occured.');
}

function ScriptDialogError(ex) {
    if ($('#hdnLoginRoleId').val() == "2")
        AlertDialogError(ex);
    else
        AlertDialogError('Runtime script error occured.');
}


// sql injection prevention - filter validation
function PreventSqlInjection(searchVal) {
    var preventItem = new Array();
    hasError = false;

    preventItem = ['delete', 'truncate', 'update', 'exec'];

    ///^[A-Za-z0-9!@@#$%^&*()_]
    var searchReg = /^[a-zA-Z0-9-@@.]+$/;

    if (searchVal == '') {
        //$("#search-text").after('<span class="error">Please enter a search term.</span>');
        //hasError = true;
    }
    else if (!searchReg.test(searchVal)) {
        //$("#search-text").after('<span class="error">Enter valid text.</span>');
        hasError = true;
    }
    else if ($.inArray(searchVal, preventItem) > -1) // = -1 => found in array
    {
        hasError = true;
    }
    else {
        $.each(preventItem, function () {
            if (searchVal.indexOf(this) >= 0) //find the search text-contains
            {
                hasError = true;
                //break;
            }
        });

    }
    return hasError;
}

//bind customer list - by ddl id
function BindCustomer(ddlCustomer) {
    //        $.ajax({
    //            type: "POST",
    //            url: "Home/BindCustomer",
    //            data: "{}",
    //            contentType: "application/json; charset=utf-8",
    //            dataType: "json",
    //            async: false,
    //            success: function (msg) {
    //                $("#" + ddlCustomer).get(0).options.length = 0;
    //                $("#" + ddlCustomer).get(0).options[0] = new Option("Select Customer", "");

    //                var parsedData = JSON.parse(msg.d);
    //                $.each(parsedData.Branch, function (index, item) {
    //                    $("#" + ddlCustomer).get(0).options[$("#" + ddlCustomer).get(0).options.length] = new Option(item.branchname, item.id);
    //                });
    //            },
    //            error: function (ex) {
    //                //ShowException('');
    //            }
    //        });

    var url = '@Html.GetUrl("BindCustomer", "Home", new { area="" })';
    alert(url);
    $.getJSON(url, function (data) {
        // Update the Knockout model (and thus the UI) with the comments received back 
        // from the Web API call.
        alert('ok');
    });
}

function ChangePassword() {
    // clear dialog window
    $('#dialog-add').html('');
    // Dialogs window for add
    $("#dialog-add").dialog({
        title: 'Change Password',
        autoOpen: false,
        resizable: true,
        width: 600,
        height: 550,
        position: 'center',
        modal: true,
        draggable: true,
        open: function (event, ui) {
            $.post("/Account/ChangeUserPassword",
                            {},
                            function (data) {
                                $('#dialog-add').html(data.view);
                            }
                        );
        },
        close: function (event, ui) {
            $(this).dialog('close');
        }
    });

    //open dialog
    $('#dialog-add').dialog('open');
    return false;
}

function ForgetPassword() {
    // clear dialog window
    $('#dialog-add').html('');
    // Dialogs window for add
    $("#dialog-add").dialog({
        title: 'Forget Password',
        autoOpen: false,
        resizable: true,
        width: 550,
        height: 400,
        position: 'center',
        modal: true,
        draggable: true,
        open: function (event, ui) {
            $.post("/Account/ForgetPassword",
                            {},
                            function (data) {
                                $('#dialog-add').html(data.view);
                            }
                        );
        },
        close: function (event, ui) {
            $(this).dialog('close');
        }
    });

    //open dialog
    $('#dialog-add').dialog('open');
    return false;
}

//function DisableRightClick() {
//    var message = "Function Disabled!";

//    function clickIE4() {
//        if (event.button == 2) {
//            alert(message);
//            return false;
//        }
//    }

//    function clickNS4(e) {
//        if (document.layers || document.getElementById && !document.all) {
//            if (e.which == 2 || e.which == 3) {
//                alert(message);
//                return false;
//            }
//        }
//    }
//    if (document.layers) {
//        document.captureEvents(Event.MOUSEDOWN);
//        document.onmousedown = clickNS4;
//    }
//    else if (document.all && !document.getElementById) {
//        document.onmousedown = clickIE4;
//    }
//    document.oncontextmenu = new Function("alert(message);return false")
//    

//}

/********************* tank delivery collection - start *********************/
//delivery companion by miles
function LoadReorderByMile(tankid, tankMile) {
    sTankIDs = "";

    //get tank within miles
    $.post('/DMS/DMS/GetTankMiles',
                {
                    sAccountID: $('#ddlAccount').val(),
                    iTankId: tankid
                },
                function (returnData) {
                    FindMiles(returnData, tankMile);

                    if (sTankIDs != "") {
                        {
                            $('#hdnTankList').val(sTankIDs);
                            LoadReorderTank(tankid, tankMile);
                        }
                    }
                    else {
                        alert("No Tank Exists");
                    }

                });


}

//load tank delivery collection list
function LoadReorderTank(tankid, tankMile) {
    try {
        // clear edit and add view
        $('#tankReorderByMile').html('');
        $('#tankReorderByETR').html('');

        var sTitle = "Delivery Collection Tank - By Distance (1- " + tankMile + ") miles";

        // Dialogs window for add
        $("#tankReorderByMile").dialog({
            title: sTitle,
            autoOpen: false,
            resizable: true,
            width: winWidth - 10,
            height: winHeight - 10,
            position: 'center',
            modal: true,
            draggable: true,
            open: function (event, ui) {
                $.ajax({
                    type: 'POST',
                    url: '/DMS/DMS/ReorderByMile',
                    data: { iTankID: tankid },
                    async: false,
                    success: function (data) {
                        try {
                            if (data == "") {
                                if ($("#tankReorderByMile").closest('.ui-dialog').is(':visible'))
                                    $('#tankReorderByMile').dialog('close')

                                AlertError('Page could not load, please try again');
                                return;
                            }
                            $('#tankReorderByMile').html(data);

                        }
                        catch (e) {
                            ScriptDialogError(e);
                        }
                    }
                });
                //set manual parameters
                var loadUrl = $('#tblGridMile').jqGrid('getGridParam', 'url');
                $('#tblGridMile').setGridParam({ url: loadUrl + "?tankIds=" + sTankIDs });
                $("#tblGridMile").jqGrid('setGridParam', { datatype: 'json' });
                $('#tblGridMile').trigger("reloadGrid");
                //$('#tblGrid').setGridParam({ url: loadUrl });

            },
            close: function (event, ui) {
                //empty tanklist 
                $('#hdnTankList').val('');

                if ($("#tankReorderByMile").closest('.ui-dialog').is(':visible'))
                    $('#tankReorderByMile').dialog('close')
            }
        });

        //open dialog
        $('#tankReorderByMile').dialog('open');
        return false;
    }
    catch (e) {
        ScriptError(e);
    }
}

//delivery companion by - ETR
function SelectConsumptionType(type, tankid, day1, day2) {
    //default selection
    $('#rbAvgConsumption')[0].checked = true;

    //dialog for consumption type selection
    $("#consumptionType").dialog({
        title: "Select Consumption Type",
        resizable: true,
        height: 180,
        width: 450,
        modal: true,
        autoOpen: true,
        buttons: {
            'Yes': function () {
                $(this).dialog('close');

                //load the tanks
                LoadReorderByETRandETE(type, $("input[name='rbConsumptionType']:checked").val(), tankid, day1, day2);
            },
            'No': function () {
                $(this).dialog('close');
            }
        }
    });
}

function LoadReorderByETRandETE(type, consumType, tankid, day1, day2) {
    //type  = 1 - ETR
    //      = 2 - ETE            

    try {
        // delivery collection view
        $('#tankReorderByMile').html('');
        $('#tankReorderByETR').html('');

        var sTitle = "";
        if (type == 1)
            sTitle = "Delivery Collection Tank - By ETR (" + day1 + " - " + day2 + ") days";
        else
            sTitle = "Delivery Collection Tank - By ETE (" + day1 + " - " + day2 + ") days";

        // Dialogs window for add
        $("#tankReorderByETR").dialog({
            title: sTitle,
            autoOpen: false,
            resizable: true,
            width: winWidth - 10,
            height: winHeight - 10,
            position: 'center',
            modal: true,
            draggable: true,
            open: function (event, ui) {
                $.ajax({
                    type: 'POST',
                    url: '/DMS/DMS/ReorderByETRandETE',
                    data:
                                    {
                                        iTankID: tankid
                                    },
                    async: false,
                    success: function (data) {
                        try {
                            if (data == "") {
                                if ($("#tankReorderByETR").closest('.ui-dialog').is(':visible'))
                                    $('#tankReorderByETR').dialog('close')

                                AlertError('Page could not load, please try again');
                                return;
                            }
                            $('#tankReorderByETR').html(data);

                        }
                        catch (e) {
                            ScriptDialogError(e);
                        }
                    }
                });

                //set manual parameters
                var loadUrl = $('#tblGridETR').jqGrid('getGridParam', 'url');
                $('#tblGridETR').setGridParam({ url: loadUrl + "?sType=" + type + "&sAvg=" + consumType + "&iDay1=" + day1 + "&iDay2=" + day2 });
                $("#tblGridETR").jqGrid('setGridParam', { datatype: 'json' });
                $('#tblGridETR').trigger("reloadGrid");

            },
            close: function (event, ui) {

                if ($("#tankReorderByETR").closest('.ui-dialog').is(':visible'))
                    $('#tankReorderByETR').dialog('close')
            }
        });

        //open dialog
        $('#tankReorderByETR').dialog('open');
        return false;
    }
    catch (e) {
        ScriptError(e);
    }
}


/********************* tank delivery collection - end *********************/