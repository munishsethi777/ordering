/*
* jQuery UI Multicolumn Autocomplete Widget Plugin 2.0
* Copyright (c) 2012 Mark Harmon
*
* Depends:
*   - jQuery UI Autocomplete widget
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
$.widget('custom.mcautocomplete', $.ui.autocomplete, {

    _suggest: function (items) {
        this.menu.element.find('li').not('.selected-row').empty();
        this.menu.element.find('.modal-footer').remove();
        var ul = this.menu.element; // this.menu.element.empty();
        this._renderMenu(ul, items);
        this.isNewMenu = true;
        this.menu.refresh();

        // size and position menu
        ul.show();
        this._resizeMenu();
        ul.position($.extend({
            of: this.element
        }, this.options.position));

        if (this.options.autoFocus) {
            this.menu.next();
        }
    },

    _renderMenu: function (ul, items) {
        var self = this, thead;
        if (this.options.showHeader && ($('#lkpDynHeader' + $(ul).attr('id')).html() == undefined || $('#lkpDynHeader' + $(ul).attr('id')).html() == '')) {
            table = $('<div style="width:' + this.options.width +'px;" id="lkpDynHeader' + $(ul).attr("id") + '" class="modal-header"></div>');
            table.append(this.options.lookupHeader);
            table.append('<div style="clear: both;"></div>');
            //ul.append(table[0].outerHTML);
            $('#lookupHeader').html(table[0].outerHTML);
            ul.append($('#lookupHeader').html());



        }

        //add attribute - this.options.lookupName 
        $(ul).attr("lookupname-ul", this.options.lookupName);

        $.each(items, function (index, item) {
            self._renderItem(ul, item);
        });

        if (this.options.showHeader) { // && ($('#lkpDynFooter').html() == undefined || $('#lkpDynFooter').html() == '')) {
            //var footer = '<div id="lkpDynFooter" class="row-fluid modal-footer"><div class="span4"><div class="btn-group"><button onclick="PgPrevLookup(\'' + this.options.lookupName + '\');"  class="btn">Previous</button><button onclick="PgNextLookup(\'' + this.options.lookupName + '\');" class="btn">Next</button></div></div><div class="span4"><button class="btn btn-small btn-primary" type="button">Ok</button><button class="btn btn-small" type="button">Cancel</button></div><div class="span4"></div></div>'

            //removed ok and cancel button
            var footer = '<div id="lkpDynFooter" class="row-fluid modal-footer"><div class="span4"><div class="btn-group"><button onclick="PgPrevLookup(\'' + this.options.lookupName + '\');"  class="btn">Previous</button><button onclick="PgNextLookup(\'' + this.options.lookupName + '\');" class="btn">Next</button><button onclick="SelectLookupRow(\'' + this.options.lookupName + '\');" class="btn">Ok</button><button onclick="SearchClearLookup(\'' + this.options.lookupName + '\');" class="btn">Clear</button><button onclick="CloseLookup(\'' + this.options.lookupName + '\');" class="btn">Close</button></div></div><div class="span4"></div><div class="span4"></div></div>'

            //$('#lookupFooter').html(footer);
            //ul.append($('#lookupFooter').html());
            ul.append(footer);
        }
    },
    _renderItem: function (ul, item) {
        var t = '', result = '';

        if (item.value == undefined) {
            $.each(this.options.columns, function (index, column) {
                t += '<label style=" white-space: nowrap; overflow: hidden;padding:0 4px;float:left; ' + column.style + '">' + item[column.valueField ? column.valueField : index] + '</label>'
            });

            if (this.options.isSingle == "False") {
                t += '<label style="float:right;"><input onclick="MultiSelectLookupRowByCheckbox(this, ' + item.id + ');" type="checkbox" /></label>';
                t = '<a onclick="MultiSelectLookupRow(this, ' + item.id + ');" class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>'
            }
            else
                t = '<a onclick="SingleSelectLookupRow(this);" class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>'
        }
        else if (item.value != undefined && item.label != undefined) {
            t = '<div style="text-align:center;"><span style="width:100%; color:red;">Record Not Found</span></div>';
        }

        if (item.value != "no match found.") {
            if (this.options.isSingle == "True") //single selection
                result = $('<li></li>')
            else // multi selection
                result = $('<li></li>')

            //appent li - ul autocompletion
            result.data('ui-autocomplete-item', item)
			.append(t)
			.appendTo(ul);
        }
        else if (item.value == "no match found.") {
            result = $('<li class="norecord"></li>')
			    .data('ui-autocomplete-item', item)
			    .append('<div style="text-align:center;"><span style="width:100%; color:red;">Record Not Found</span></div>')
			    .appendTo(ul);
        }
        return result;
    },
    _close: function (event) {

    },
    manualSearch: function () {
        this.pending++;
        this.element.addClass("ui-autocomplete-loading");
        this.cancelSearch = false;

        this.source({ term: '' }, this._response());
    },
    manualClose: function (event) {
        if (this.menu.element.is(":visible")) {
            this.menu.element.hide();
            this.menu.blur();
            this.isNewMenu = true;
            this._trigger("close", event);
        }
    },
    menuselect: function (event, ui) {
        this.close(event);
    },
    menufocus: function (event, ui) {
        alert('focused');
    }
});


