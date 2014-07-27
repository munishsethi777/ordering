/* 
* jqGrid  4.4.4 - jQuery Grid 
* Copyright (c) 2008, Tony Tomov, tony@trirand.com 
* Dual licensed under the MIT and GPL licenses 
* http://www.opensource.org/licenses/mit-license.php 
* http://www.gnu.org/licenses/gpl-2.0.html 
* Date:2013-01-30 
* Modules: grid.base.js; jquery.fmatter.js; grid.custom.js; grid.common.js; grid.formedit.js; grid.filter.js; grid.inlinedit.js; grid.celledit.js; jqModal.js; jqDnR.js; grid.subgrid.js; grid.grouping.js; grid.treegrid.js; grid.import.js; JsonXml.js; grid.tbltogrid.js; grid.jqueryui.js; 
*/
(function (b) {
    b.jgrid = b.jgrid || {};
    b.extend(b.jgrid, {
        version: "4.4.4",
        htmlDecode: function (b) {
            return b && ("&nbsp;" == b || "&#160;" == b || 1 === b.length && 160 === b.charCodeAt(0)) ? "" : !b ? b : ("" + b).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
        },
        htmlEncode: function (b) {
            return !b ? b : ("" + b).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        },
        format: function (f) {
            var d = b.makeArray(arguments).slice(1);
            null == f && (f = "");
            return f.replace(/\{(\d+)\}/g, function (b, e) {
                return d[e]
            })
        },
        msie: "Microsoft Internet Explorer" == navigator.appName,
        msiever: function () {
            var b = -1;
            null != /MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent) && (b = parseFloat(RegExp.$1));
            return b
        },
        getCellIndex: function (f) {
            f = b(f);
            if (f.is("tr")) return -1;
            f = (!f.is("td") && !f.is("th") ? f.closest("td,th") : f)[0];
            return b.jgrid.msie ? b.inArray(f, f.parentNode.cells) : f.cellIndex
        },
        stripHtml: function (b) {
            var b = "" + b,
                d = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
            return b ? (b = b.replace(d, "")) && "&nbsp;" !== b && "&#160;" !== b ? b.replace(/\"/g, "'") : "" : b
        },
        stripPref: function (f, d) {
            var c = b.type(f);
            if ("string" == c || "number" == c) f = "" + f, d = "" !== f ? ("" + d).replace("" + f, "") : d;
            return d
        },
        stringToDoc: function (b) {
            var d;
            if ("string" !== typeof b) return b;
            try {
                d = (new DOMParser).parseFromString(b, "text/xml")
            } catch (c) {
                d = new ActiveXObject("Microsoft.XMLDOM"), d.async = !1, d.loadXML(b)
            }
            return d && d.documentElement && "parsererror" != d.documentElement.tagName ? d : null
        },
        parse: function (f) {
            "while(1);" == f.substr(0, 9) && (f = f.substr(9));
            "/*" == f.substr(0, 2) && (f = f.substr(2, f.length - 4));
            f || (f = "{}");
            return !0 === b.jgrid.useJSON && "object" === typeof JSON && "function" === typeof JSON.parse ? JSON.parse(f) : eval("(" + f + ")")
        },
        parseDate: function (f, d) {
            var c = {
                m: 1,
                d: 1,
                y: 1970,
                h: 0,
                i: 0,
                s: 0,
                u: 0
            },
                e, a, i;
            e = /[\\\/:_;.,\t\T\s-]/;
            if (d && null != d) {
                d = b.trim(d);
                d = d.split(e);
                void 0 !== b.jgrid.formatter.date.masks[f] && (f = b.jgrid.formatter.date.masks[f]);
                var f = f.split(e),
                    h = b.jgrid.formatter.date.monthNames,
                    g = b.jgrid.formatter.date.AmPm,
                    j = function (a, b) {
                        0 === a ? 12 === b && (b = 0) : 12 !== b && (b += 12);
                        return b
                    };
                e = 0;
                for (a = f.length; e < a; e++) "M" == f[e] && (i = b.inArray(d[e], h), -1 !== i && 12 > i && (d[e] = i + 1, c.m = d[e])), "F" == f[e] && (i = b.inArray(d[e], h), -1 !== i && 11 < i && (d[e] = i + 1 - 12, c.m = d[e])), "a" == f[e] && (i = b.inArray(d[e], g), -1 !== i && 2 > i && d[e] == g[i] && (d[e] = i, c.h = j(d[e], c.h))), "A" == f[e] && (i = b.inArray(d[e], g), -1 !== i && 1 < i && d[e] == g[i] && (d[e] = i - 2, c.h = j(d[e], c.h))), "g" === f[e] && (c.h = parseInt(d[e], 10)), void 0 !== d[e] && (c[f[e].toLowerCase()] = parseInt(d[e], 10));
                c.m = parseInt(c.m, 10) - 1;
                e = c.y;
                70 <= e && 99 >= e ? c.y = 1900 + c.y : 0 <= e && 69 >= e && (c.y = 2E3 + c.y);
                void 0 !== c.j && (c.d = c.j);
                void 0 !== c.n && (c.m = parseInt(c.n, 10) - 1)
            }
            return new Date(c.y, c.m, c.d, c.h, c.i, c.s, c.u)
        },
        jqID: function (b) {
            return ("" + b).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g, "\\$&")
        },
        guid: 1,
        uidPref: "jqg",
        randId: function (f) {
            return (f || b.jgrid.uidPref) + b.jgrid.guid++
        },
        getAccessor: function (b, d) {
            var c, e, a = [],
                i;
            if ("function" === typeof d) return d(b);
            c = b[d];
            if (void 0 === c) try {
                if ("string" === typeof d && (a = d.split(".")), i = a.length) for (c = b; c && i--; ) e = a.shift(), c = c[e]
            } catch (h) { }
            return c
        },
        getXmlData: function (f, d, c) {
            var e = "string" === typeof d ? d.match(/^(.*)\[(\w+)\]$/) : null;
            if ("function" === typeof d) return d(f);
            if (e && e[2]) return e[1] ? b(e[1], f).attr(e[2]) : b(f).attr(e[2]);
            f = b(d, f);
            return c ? f : 0 < f.length ? b(f).text() : void 0
        },
        cellWidth: function () {
            var f = b("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;'></td></tr></table></div>"),
                d = f.appendTo("body").find("td").width();
            f.remove();
            return 5 !== d
        },
        cell_width: !0,
        ajaxOptions: {},
        from: function (f) {
            return new function (d, c) {
                "string" === typeof d && (d = b.data(d));
                var e = this,
                    a = d,
                    i = !0,
                    f = !1,
                    g = c,
                    j = /[\$,%]/g,
                    k = null,
                    l = null,
                    n = 0,
                    s = !1,
                    m = "",
                    v = [],
                    E = !0;
                if ("object" === typeof d && d.push) 0 < d.length && (E = "object" !== typeof d[0] ? !1 : !0);
                else throw "data provides is not an array";
                this._hasData = function () {
                    return null === a ? !1 : 0 === a.length ? !1 : !0
                };
                this._getStr = function (a) {
                    var b = [];
                    f && b.push("jQuery.trim(");
                    b.push("String(" + a + ")");
                    f && b.push(")");
                    i || b.push(".toLowerCase()");
                    return b.join("")
                };
                this._strComp = function (a) {
                    return "string" === typeof a ? ".toString()" : ""
                };
                this._group = function (a, b) {
                    return {
                        field: a.toString(),
                        unique: b,
                        items: []
                    }
                };
                this._toStr = function (a) {
                    f && (a = b.trim(a));
                    a = a.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                    return i ? a : a.toLowerCase()
                };
                this._funcLoop = function (e) {
                    var c = [];
                    b.each(a, function (a, b) {
                        c.push(e(b))
                    });
                    return c
                };
                this._append = function (a) {
                    var b;
                    g = null === g ? "" : g + ("" === m ? " && " : m);
                    for (b = 0; b < n; b++) g += "(";
                    s && (g += "!");
                    g += "(" + a + ")";
                    s = !1;
                    m = "";
                    n = 0
                };
                this._setCommand = function (a, b) {
                    k = a;
                    l = b
                };
                this._resetNegate = function () {
                    s = !1
                };
                this._repeatCommand = function (a, b) {
                    return null === k ? e : null !== a && null !== b ? k(a, b) : null === l || !E ? k(a) : k(l, a)
                };
                this._equals = function (a, b) {
                    return 0 === e._compare(a, b, 1)
                };
                this._compare = function (a, b, e) {
                    var c = Object.prototype.toString;
                    void 0 === e && (e = 1);
                    void 0 === a && (a = null);
                    void 0 === b && (b = null);
                    if (null === a && null === b) return 0;
                    if (null === a && null !== b) return 1;
                    if (null !== a && null === b) return -1;
                    if ("[object Date]" === c.call(a) && "[object Date]" === c.call(b)) return a < b ? -e : a > b ? e : 0;
                    !i && "number" !== typeof a && "number" !== typeof b && (a = "" + a, b = "" + b);
                    return a < b ? -e : a > b ? e : 0
                };
                this._performSort = function () {
                    0 !== v.length && (a = e._doSort(a, 0))
                };
                this._doSort = function (a, b) {
                    var c = v[b].by,
                        f = v[b].dir,
                        i = v[b].type,
                        d = v[b].datefmt;
                    if (b == v.length - 1) return e._getOrder(a, c, f, i, d);
                    b++;
                    for (var c = e._getGroup(a, c, f, i, d), f = [], h, i = 0; i < c.length; i++) {
                        h = e._doSort(c[i].items, b);
                        for (d = 0; d < h.length; d++) f.push(h[d])
                    }
                    return f
                };
                this._getOrder = function (a, c, f, d, h) {
                    var g = [],
                        k = [],
                        l = "a" == f ? 1 : -1,
                        n, s;
                    void 0 === d && (d = "text");
                    s = "float" == d || "number" == d || "currency" == d || "numeric" == d ?
                    function (a) {
                        a = parseFloat(("" + a).replace(j, ""));
                        return isNaN(a) ? 0 : a
                    } : "int" == d || "integer" == d ?
                    function (a) {
                        return a ? parseFloat(("" + a).replace(j, "")) : 0
                    } : "date" == d || "datetime" == d ?
                    function (a) {
                        return b.jgrid.parseDate(h, a).getTime()
                    } : b.isFunction(d) ? d : function (a) {
                        a = a ? b.trim("" + a) : "";
                        return i ? a : a.toLowerCase()
                    };
                    b.each(a, function (a, e) {
                        n = "" !== c ? b.jgrid.getAccessor(e, c) : e;
                        void 0 === n && (n = "");
                        n = s(n, e);
                        k.push({
                            vSort: n,
                            index: a
                        })
                    });
                    k.sort(function (a, b) {
                        a = a.vSort;
                        b = b.vSort;
                        return e._compare(a, b, l)
                    });
                    for (var d = 0, m = a.length; d < m; ) f = k[d].index, g.push(a[f]), d++;
                    return g
                };
                this._getGroup = function (a, c, d, f, i) {
                    var h = [],
                        g = null,
                        j = null,
                        k;
                    b.each(e._getOrder(a, c, d, f, i), function (a, d) {
                        k = b.jgrid.getAccessor(d, c);
                        null == k && (k = "");
                        e._equals(j, k) || (j = k, null !== g && h.push(g), g = e._group(c, k));
                        g.items.push(d)
                    });
                    null !== g && h.push(g);
                    return h
                };
                this.ignoreCase = function () {
                    i = !1;
                    return e
                };
                this.useCase = function () {
                    i = !0;
                    return e
                };
                this.trim = function () {
                    f = !0;
                    return e
                };
                this.noTrim = function () {
                    f = !1;
                    return e
                };
                this.execute = function () {
                    var c = g,
                        d = [];
                    if (null === c) return e;
                    b.each(a, function () {
                        eval(c) && d.push(this)
                    });
                    a = d;
                    return e
                };
                this.data = function () {
                    return a
                };
                this.select = function (c) {
                    e._performSort();
                    if (!e._hasData()) return [];
                    e.execute();
                    if (b.isFunction(c)) {
                        var d = [];
                        b.each(a, function (a, b) {
                            d.push(c(b))
                        });
                        return d
                    }
                    return a
                };
                this.hasMatch = function () {
                    if (!e._hasData()) return !1;
                    e.execute();
                    return 0 < a.length
                };
                this.andNot = function (a, b, c) {
                    s = !s;
                    return e.and(a, b, c)
                };
                this.orNot = function (a, b, c) {
                    s = !s;
                    return e.or(a, b, c)
                };
                this.not = function (a, b, c) {
                    return e.andNot(a, b, c)
                };
                this.and = function (a, b, c) {
                    m = " && ";
                    return void 0 === a ? e : e._repeatCommand(a, b, c)
                };
                this.or = function (a, b, c) {
                    m = " || ";
                    return void 0 === a ? e : e._repeatCommand(a, b, c)
                };
                this.orBegin = function () {
                    n++;
                    return e
                };
                this.orEnd = function () {
                    null !== g && (g += ")");
                    return e
                };
                this.isNot = function (a) {
                    s = !s;
                    return e.is(a)
                };
                this.is = function (a) {
                    e._append("this." + a);
                    e._resetNegate();
                    return e
                };
                this._compareValues = function (a, c, d, f, i) {
                    var h;
                    h = E ? "jQuery.jgrid.getAccessor(this,'" + c + "')" : "this";
                    void 0 === d && (d = null);
                    var g = d,
                        k = void 0 === i.stype ? "text" : i.stype;
                    if (null !== d) switch (k) {
                        case "int":
                        case "integer":
                            g = isNaN(Number(g)) || "" === g ? "0" : g;
                            h = "parseInt(" + h + ",10)";
                            g = "parseInt(" + g + ",10)";
                            break;
                        case "float":
                        case "number":
                        case "numeric":
                            g = ("" + g).replace(j, "");
                            g = isNaN(Number(g)) || "" === g ? "0" : g;
                            h = "parseFloat(" + h + ")";
                            g = "parseFloat(" + g + ")";
                            break;
                        case "date":
                        case "datetime":
                            g = "" + b.jgrid.parseDate(i.newfmt || "Y-m-d", g).getTime();
                            h = 'jQuery.jgrid.parseDate("' + i.srcfmt + '",' + h + ").getTime()";
                            break;
                        default:
                            h = e._getStr(h), g = e._getStr('"' + e._toStr(g) + '"')
                    }
                    e._append(h + " " + f + " " + g);
                    e._setCommand(a, c);
                    e._resetNegate();
                    return e
                };
                this.equals = function (a, b, c) {
                    return e._compareValues(e.equals, a, b, "==", c)
                };
                this.notEquals = function (a, b, c) {
                    return e._compareValues(e.equals, a, b, "!==", c)
                };
                this.isNull = function (a, b, c) {
                    return e._compareValues(e.equals, a, null, "===", c)
                };
                this.greater = function (a, b, c) {
                    return e._compareValues(e.greater, a, b, ">", c)
                };
                this.less = function (a, b, c) {
                    return e._compareValues(e.less, a, b, "<", c)
                };
                this.greaterOrEquals = function (a, b, c) {
                    return e._compareValues(e.greaterOrEquals, a, b, ">=", c)
                };
                this.lessOrEquals = function (a, b, c) {
                    return e._compareValues(e.lessOrEquals, a, b, "<=", c)
                };
                this.startsWith = function (a, c) {
                    var d = null == c ? a : c,
                        d = f ? b.trim(d.toString()).length : d.toString().length;
                    E ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(0," + d + ") == " + e._getStr('"' + e._toStr(c) + '"')) : (d = f ? b.trim(c.toString()).length : c.toString().length, e._append(e._getStr("this") + ".substr(0," + d + ") == " + e._getStr('"' + e._toStr(a) + '"')));
                    e._setCommand(e.startsWith, a);
                    e._resetNegate();
                    return e
                };
                this.endsWith = function (a, c) {
                    var d = null == c ? a : c,
                        d = f ? b.trim(d.toString()).length : d.toString().length;
                    E ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".substr(" + e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + ".length-" + d + "," + d + ') == "' + e._toStr(c) + '"') : e._append(e._getStr("this") + ".substr(" + e._getStr("this") + '.length-"' + e._toStr(a) + '".length,"' + e._toStr(a) + '".length) == "' + e._toStr(a) + '"');
                    e._setCommand(e.endsWith, a);
                    e._resetNegate();
                    return e
                };
                this.contains = function (a, b) {
                    E ? e._append(e._getStr("jQuery.jgrid.getAccessor(this,'" + a + "')") + '.indexOf("' + e._toStr(b) + '",0) > -1') : e._append(e._getStr("this") + '.indexOf("' + e._toStr(a) + '",0) > -1');
                    e._setCommand(e.contains, a);
                    e._resetNegate();
                    return e
                };
                this.groupBy = function (b, c, d, f) {
                    return !e._hasData() ? null : e._getGroup(a, b, c, d, f)
                };
                this.orderBy = function (a, c, d, f) {
                    c = null == c ? "a" : b.trim(c.toString().toLowerCase());
                    null == d && (d = "text");
                    null == f && (f = "Y-m-d");
                    if ("desc" == c || "descending" == c) c = "d";
                    if ("asc" == c || "ascending" == c) c = "a";
                    v.push({
                        by: a,
                        dir: c,
                        type: d,
                        datefmt: f
                    });
                    return e
                };
                return e
            } (f, null)
        },
        getMethod: function (f) {
            return this.getAccessor(b.fn.jqGrid, f)
        },
        extend: function (f) {
            b.extend(b.fn.jqGrid, f);
            this.no_legacy_api || b.fn.extend(f)
        }
    });
    b.fn.jqGrid = function (f) {
        if ("string" === typeof f) {
            var d = b.jgrid.getMethod(f);
            if (!d) throw "jqGrid - No such method: " + f;
            var c = b.makeArray(arguments).slice(1);
            return d.apply(this, c)
        }
        return this.each(function () {
            if (!this.grid) {
                var e = b.extend(!0, {
                    url: "",
                    height: 150,
                    page: 1,
                    rowNum: 20,
                    rowTotal: null,
                    records: 0,
                    pager: "",
                    pgbuttons: !0,
                    pginput: !0,
                    colModel: [],
                    rowList: [],
                    colNames: [],
                    sortorder: "asc",
                    sortname: "",
                    datatype: "xml",
                    mtype: "GET",
                    altRows: !1,
                    selarrrow: [],
                    savedRow: [],
                    shrinkToFit: !0,
                    xmlReader: {},
                    jsonReader: {},
                    subGrid: !1,
                    subGridModel: [],
                    reccount: 0,
                    lastpage: 0,
                    lastsort: 0,
                    selrow: null,
                    beforeSelectRow: null,
                    onSelectRow: null,
                    onSortCol: null,
                    ondblClickRow: null,
                    onRightClickRow: null,
                    onPaging: null,
                    onSelectAll: null,
                    onInitGrid: null,
                    loadComplete: null,
                    gridComplete: null,
                    loadError: null,
                    loadBeforeSend: null,
                    afterInsertRow: null,
                    beforeRequest: null,
                    beforeProcessing: null,
                    onHeaderClick: null,
                    viewrecords: !1,
                    loadonce: !1,
                    multiselect: !1,
                    multikey: !1,
                    editurl: null,
                    search: !1,
                    caption: "",
                    hidegrid: !0,
                    hiddengrid: !1,
                    postData: {},
                    userData: {},
                    treeGrid: !1,
                    treeGridModel: "nested",
                    treeReader: {},
                    treeANode: -1,
                    ExpandColumn: null,
                    tree_root_level: 0,
                    prmNames: {
                        page: "page",
                        rows: "rows",
                        sort: "sidx",
                        order: "sord",
                        search: "_search",
                        nd: "nd",
                        id: "id",
                        oper: "oper",
                        editoper: "edit",
                        addoper: "add",
                        deloper: "del",
                        subgridid: "id",
                        npage: null,
                        totalrows: "totalrows"
                    },
                    forceFit: !1,
                    gridstate: "visible",
                    cellEdit: !1,
                    cellsubmit: "remote",
                    nv: 0,
                    loadui: "enable",
                    toolbar: [!1, ""],
                    scroll: !1,
                    multiboxonly: !1,
                    deselectAfterSort: !0,
                    scrollrows: !1,
                    autowidth: !1,
                    scrollOffset: 18,
                    cellLayout: 5,
                    subGridWidth: 20,
                    multiselectWidth: 20,
                    gridview: !1,
                    rownumWidth: 25,
                    rownumbers: !1,
                    pagerpos: "center",
                    recordpos: "right",
                    footerrow: !1,
                    userDataOnFooter: !1,
                    hoverrows: !0,
                    altclass: "ui-priority-secondary",
                    viewsortcols: [!1, "vertical", !0],
                    resizeclass: "",
                    autoencode: !1,
                    remapColumns: [],
                    ajaxGridOptions: {},
                    direction: "ltr",
                    toppager: !1,
                    headertitles: !1,
                    scrollTimeout: 40,
                    data: [],
                    _index: {},
                    grouping: !1,
                    groupingView: {
                        groupField: [],
                        groupOrder: [],
                        groupText: [],
                        groupColumnShow: [],
                        groupSummary: [],
                        showSummaryOnHide: !1,
                        sortitems: [],
                        sortnames: [],
                        summary: [],
                        summaryval: [],
                        plusicon: "ui-icon-circlesmall-plus",
                        minusicon: "ui-icon-circlesmall-minus",
                        displayField: []
                    },
                    ignoreCase: !1,
                    cmTemplate: {},
                    idPrefix: ""
                }, b.jgrid.defaults, f || {}),
                    a = this,
                    c = {
                        headers: [],
                        cols: [],
                        footers: [],
                        dragStart: function (c, d, f) {
                            this.resizing = {
                                idx: c,
                                startX: d.clientX,
                                sOL: f[0]
                            };
                            this.hDiv.style.cursor = "col-resize";
                            this.curGbox = b("#rs_m" + b.jgrid.jqID(e.id), "#gbox_" + b.jgrid.jqID(e.id));
                            this.curGbox.css({
                                display: "block",
                                left: f[0],
                                top: f[1],
                                height: f[2]
                            });
                            b(a).triggerHandler("jqGridResizeStart", [d, c]);
                            b.isFunction(e.resizeStart) && e.resizeStart.call(this, d, c);
                            document.onselectstart = function () {
                                return !1
                            }
                        },
                        dragMove: function (a) {
                            if (this.resizing) {
                                var b = a.clientX - this.resizing.startX,
                                    a = this.headers[this.resizing.idx],
                                    c = "ltr" === e.direction ? a.width + b : a.width - b,
                                    d;
                                33 < c && (this.curGbox.css({
                                    left: this.resizing.sOL + b
                                }), !0 === e.forceFit ? (d = this.headers[this.resizing.idx + e.nv], b = "ltr" === e.direction ? d.width - b : d.width + b, 33 < b && (a.newWidth = c, d.newWidth = b)) : (this.newWidth = "ltr" === e.direction ? e.tblwidth + b : e.tblwidth - b, a.newWidth = c))
                            }
                        },
                        dragEnd: function () {
                            this.hDiv.style.cursor = "default";
                            if (this.resizing) {
                                var c = this.resizing.idx,
                                    d = this.headers[c].newWidth || this.headers[c].width,
                                    d = parseInt(d, 10);
                                this.resizing = !1;
                                b("#rs_m" + b.jgrid.jqID(e.id)).css("display", "none");
                                e.colModel[c].width = d;
                                this.headers[c].width = d;
                                this.headers[c].el.style.width = d + "px";
                                this.cols[c].style.width = d + "px";
                                0 < this.footers.length && (this.footers[c].style.width = d + "px");
                                !0 === e.forceFit ? (d = this.headers[c + e.nv].newWidth || this.headers[c + e.nv].width, this.headers[c + e.nv].width = d, this.headers[c + e.nv].el.style.width = d + "px", this.cols[c + e.nv].style.width = d + "px", 0 < this.footers.length && (this.footers[c + e.nv].style.width = d + "px"), e.colModel[c + e.nv].width = d) : (e.tblwidth = this.newWidth || e.tblwidth, b("table:first", this.bDiv).css("width", e.tblwidth + "px"), b("table:first", this.hDiv).css("width", e.tblwidth + "px"), this.hDiv.scrollLeft = this.bDiv.scrollLeft, e.footerrow && (b("table:first", this.sDiv).css("width", e.tblwidth + "px"), this.sDiv.scrollLeft = this.bDiv.scrollLeft));
                                b(a).triggerHandler("jqGridResizeStop", [d, c]);
                                b.isFunction(e.resizeStop) && e.resizeStop.call(this, d, c)
                            }
                            this.curGbox = null;
                            document.onselectstart = function () {
                                return !0
                            }
                        },
                        populateVisible: function () {
                            c.timer && clearTimeout(c.timer);
                            c.timer = null;
                            var a = b(c.bDiv).height();
                            if (a) {
                                var d = b("table:first", c.bDiv),
                                    f, L;
                                if (d[0].rows.length) try {
                                    L = (f = d[0].rows[1]) ? b(f).outerHeight() || c.prevRowHeight : c.prevRowHeight
                                } catch (h) {
                                    L = c.prevRowHeight
                                }
                                if (L) {
                                    c.prevRowHeight = L;
                                    var g = e.rowNum;
                                    f = c.scrollTop = c.bDiv.scrollTop;
                                    var j = Math.round(d.position().top) - f,
                                        k = j + d.height();
                                    L *= g;
                                    var y, F, q;
                                    if (k < a && 0 >= j && (void 0 === e.lastpage || parseInt((k + f + L - 1) / L, 10) <= e.lastpage)) F = parseInt((a - k + L - 1) / L, 10), 0 <= k || 2 > F || !0 === e.scroll ? (y = Math.round((k + f) / L) + 1, j = -1) : j = 1;
                                    0 < j && (y = parseInt(f / L, 10) + 1, F = parseInt((f + a) / L, 10) + 2 - y, q = !0);
                                    if (F && (!e.lastpage || !(y > e.lastpage || 1 == e.lastpage || y === e.page && y === e.lastpage))) c.hDiv.loading ? c.timer = setTimeout(c.populateVisible, e.scrollTimeout) : (e.page = y, q && (c.selectionPreserver(d[0]), c.emptyRows.call(d[0], !1, !1)), c.populate(F))
                                }
                            }
                        },
                        scrollGrid: function (a) {
                            if (e.scroll) {
                                var b = c.bDiv.scrollTop;
                                void 0 === c.scrollTop && (c.scrollTop = 0);
                                b != c.scrollTop && (c.scrollTop = b, c.timer && clearTimeout(c.timer), c.timer = setTimeout(c.populateVisible, e.scrollTimeout))
                            }
                            c.hDiv.scrollLeft = c.bDiv.scrollLeft;
                            e.footerrow && (c.sDiv.scrollLeft = c.bDiv.scrollLeft);
                            a && a.stopPropagation()
                        },
                        selectionPreserver: function (a) {
                            var c = a.p,
                                d = c.selrow,
                                e = c.selarrrow ? b.makeArray(c.selarrrow) : null,
                                f = a.grid.bDiv.scrollLeft,
                                h = function () {
                                    var g;
                                    c.selrow = null;
                                    c.selarrrow = [];
                                    if (c.multiselect && e && 0 < e.length) for (g = 0; g < e.length; g++) e[g] != d && b(a).jqGrid("setSelection", e[g], !1, null);
                                    d && b(a).jqGrid("setSelection", d, !1, null);
                                    a.grid.bDiv.scrollLeft = f;
                                    b(a).unbind(".selectionPreserver", h)
                                };
                            b(a).bind("jqGridGridComplete.selectionPreserver", h)
                        }
                    };
                if ("TABLE" != this.tagName.toUpperCase()) alert("Element is not a table");
                else if (void 0 !== document.documentMode && 5 >= document.documentMode) alert("Grid can not be used in this ('quirks') mode!");
                else {
                    b(this).empty().attr("tabindex", "0");
                    this.p = e;
                    this.p.useProp = !!b.fn.prop;
                    var d, g;
                    if (0 === this.p.colNames.length) for (d = 0; d < this.p.colModel.length; d++) this.p.colNames[d] = this.p.colModel[d].label || this.p.colModel[d].name;
                    if (this.p.colNames.length !== this.p.colModel.length) alert(b.jgrid.errors.model);
                    else {
                        var j = b("<div class='ui-jqgrid-view'></div>"),
                            k = b.jgrid.msie;
                        a.p.direction = b.trim(a.p.direction.toLowerCase()); -1 == b.inArray(a.p.direction, ["ltr", "rtl"]) && (a.p.direction = "ltr");
                        g = a.p.direction;
                        b(j).insertBefore(this);
                        b(this).removeClass("scroll").appendTo(j);
                        var l = b("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                        b(l).attr({
                            id: "gbox_" + this.id,
                            dir: g
                        }).insertBefore(j);
                        b(j).attr("id", "gview_" + this.id).appendTo(l);
                        b("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").insertBefore(j);
                        b("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(j);
                        b(this).attr({
                            cellspacing: "0",
                            cellpadding: "0",
                            border: "0",
                            role: "grid",
                            "aria-multiselectable": !!this.p.multiselect,
                            "aria-labelledby": "gbox_" + this.id
                        });
                        var n = function (a, b) {
                            a = parseInt(a, 10);
                            return isNaN(a) ? b || 0 : a
                        },
                            s = function (d, e, f, h, g, j) {
                                var P = a.p.colModel[d],
                                    k = P.align,
                                    y = 'style="',
                                    F = P.classes,
                                    q = P.name,
                                    o = [];
                                k && (y = y + ("text-align:" + k + ";"));
                                P.hidden === true && (y = y + "display:none;");
                                if (e === 0) y = y + ("width: " + c.headers[d].width + "px;");
                                else if (P.cellattr && b.isFunction(P.cellattr)) if ((d = P.cellattr.call(a, g, f, h, P, j)) && typeof d === "string") {
                                    d = d.replace(/style/i, "style").replace(/title/i, "title");
                                    if (d.indexOf("title") > -1) P.title = false;
                                    d.indexOf("class") > -1 && (F = void 0);
                                    o = d.split("style");
                                    if (o.length === 2) {
                                        o[1] = b.trim(o[1].replace("=", ""));
                                        if (o[1].indexOf("'") === 0 || o[1].indexOf('"') === 0) o[1] = o[1].substring(1);
                                        y = y + o[1].replace(/'/gi, '"')
                                    } else y = y + '"'
                                }
                                if (!o.length) {
                                    o[0] = "";
                                    y = y + '"'
                                }
                                y = y + ((F !== void 0 ? ' class="' + F + '"' : "") + (P.title && f ? ' title="' + b.jgrid.stripHtml(f) + '"' : ""));
                                y = y + (' aria-describedby="' + a.p.id + "_" + q + '"');
                                return y + o[0]
                            },
                            m = function (c) {
                                return c == null || c === "" ? "&#160;" : a.p.autoencode ? b.jgrid.htmlEncode(c) : "" + c
                            },
                            v = function (c, d, e, f, h) {
                                var g = a.p.colModel[e];
                                if (g.formatter !== void 0) {
                                    c = "" + a.p.idPrefix !== "" ? b.jgrid.stripPref(a.p.idPrefix, c) : c;
                                    c = {
                                        rowId: c,
                                        colModel: g,
                                        gid: a.p.id,
                                        pos: e
                                    };
                                    d = b.isFunction(g.formatter) ? g.formatter.call(a, d, c, f, h) : b.fmatter ? b.fn.fmatter.call(a, g.formatter, d, c, f, h) : m(d)
                                } else d = m(d);
                                return d
                            },
                            E = function (a, b, c, d, e, f) {
                                b = v(a, b, c, e, "add");
                                return '<td role="gridcell" ' + s(c, d, b, e, a, f) + ">" + b + "</td>"
                            },
                            T = function (b, c, d, e) {
                                e = '<input role="checkbox" type="checkbox" id="jqg_' + a.p.id + "_" + b + '" class="cbox" name="jqg_' + a.p.id + "_" + b + '"' + (e ? 'checked="checked"' : "") + "/>";
                                return '<td role="gridcell" ' + s(c, d, "", null, b, true) + ">" + e + "</td>"
                            },
                            K = function (a, b, c, d) {
                                c = (parseInt(c, 10) - 1) * parseInt(d, 10) + 1 + b;
                                return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + s(a, b, c, null, b, true) + ">" + c + "</td>"
                            },
                            aa = function (b) {
                                var c, d = [],
                                    e = 0,
                                    f;
                                for (f = 0; f < a.p.colModel.length; f++) {
                                    c = a.p.colModel[f];
                                    if (c.name !== "cb" && c.name !== "subgrid" && c.name !== "rn") {
                                        d[e] = b == "local" ? c.name : b == "xml" || b === "xmlstring" ? c.xmlmap || c.name : c.jsonmap || c.name;
                                        e++
                                    }
                                }
                                return d
                            },
                            U = function (c) {
                                var d = a.p.remapColumns;
                                if (!d || !d.length) d = b.map(a.p.colModel, function (a, b) {
                                    return b
                                });
                                c && (d = b.map(d, function (a) {
                                    return a < c ? null : a - c
                                }));
                                return d
                            },
                            W = function (a, c) {
                                var d;
                                if (this.p.deepempty) b(this.rows).slice(1).remove();
                                else {
                                    d = this.rows.length > 0 ? this.rows[0] : null;
                                    b(this.firstChild).empty().append(d)
                                }
                                if (a && this.p.scroll) {
                                    b(this.grid.bDiv.firstChild).css({
                                        height: "auto"
                                    });
                                    b(this.grid.bDiv.firstChild.firstChild).css({
                                        height: 0,
                                        display: "none"
                                    });
                                    if (this.grid.bDiv.scrollTop !== 0) this.grid.bDiv.scrollTop = 0
                                }
                                if (c === true && this.p.treeGrid) {
                                    this.p.data = [];
                                    this.p._index = {}
                                }
                            },
                            M = function () {
                                var c = a.p.data.length,
                                    d, e, f;
                                d = a.p.rownumbers === true ? 1 : 0;
                                e = a.p.multiselect === true ? 1 : 0;
                                f = a.p.subGrid === true ? 1 : 0;
                                d = a.p.keyIndex === false || a.p.loadonce === true ? a.p.localReader.id : a.p.colModel[a.p.keyIndex + e + f + d].name;
                                for (e = 0; e < c; e++) {
                                    f = b.jgrid.getAccessor(a.p.data[e], d);
                                    f === void 0 && (f = "" + (e + 1));
                                    a.p._index[f] = e
                                }
                            },
                            X = function (c, d, e, f, g, h) {
                                var i = "-1",
                                    j = "",
                                    k, d = d ? "display:none;" : "",
                                    e = "ui-widget-content jqgrow ui-row-" + a.p.direction + e + (h ? " ui-state-highlight" : ""),
                                    f = b.isFunction(a.p.rowattr) ? a.p.rowattr.call(a, f, g) : {};
                                if (!b.isEmptyObject(f)) {
                                    if (f.hasOwnProperty("id")) {
                                        c = f.id;
                                        delete f.id
                                    }
                                    if (f.hasOwnProperty("tabindex")) {
                                        i = f.tabindex;
                                        delete f.tabindex
                                    }
                                    if (f.hasOwnProperty("style")) {
                                        d = d + f.style;
                                        delete f.style
                                    }
                                    if (f.hasOwnProperty("class")) {
                                        e = e + (" " + f["class"]);
                                        delete f["class"]
                                    }
                                    try {
                                        delete f.role
                                    } catch (F) { }
                                    for (k in f) f.hasOwnProperty(k) && (j = j + (" " + k + "=" + f[k]))
                                }
                                return '<tr role="row" id="' + c + '" tabindex="' + i + '" class="' + e + '"' + (d === "" ? "" : ' style="' + d + '"') + j + ">"
                            },
                            H = function (c, d, e, f, g) {
                                var h = new Date,
                                    i = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "xmlstring",
                                    j = a.p.xmlReader,
                                    k = a.p.datatype == "local" ? "local" : "xml";
                                if (i) {
                                    a.p.data = [];
                                    a.p._index = {};
                                    a.p.localReader.id = "_id_"
                                }
                                a.p.reccount = 0;
                                if (b.isXMLDoc(c)) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        W.call(a, false, true);
                                        e = 1
                                    } else e = e > 1 ? e : 1;
                                    var F = b(a),
                                        q, o, l = 0,
                                        u, C = a.p.multiselect === true ? 1 : 0,
                                        n = 0,
                                        s, m = a.p.rownumbers === true ? 1 : 0,
                                        Q, p = [],
                                        x, B = {},
                                        t, w, G = [],
                                        v = a.p.altRows === true ? " " + a.p.altclass : "",
                                        A;
                                    if (a.p.subGrid === true) {
                                        n = 1;
                                        s = b.jgrid.getMethod("addSubGridCell")
                                    }
                                    j.repeatitems || (p = aa(k));
                                    Q = a.p.keyIndex === false ? b.isFunction(j.id) ? j.id.call(a, c) : j.id : a.p.keyIndex;
                                    if (p.length > 0 && !isNaN(Q)) {
                                        a.p.remapColumns && a.p.remapColumns.length && (Q = b.inArray(Q, a.p.remapColumns));
                                        Q = p[Q]
                                    }
                                    k = ("" + Q).indexOf("[") === -1 ? p.length ?
                                    function (a, c) {
                                        return b(Q, a).text() || c
                                    } : function (a, c) {
                                        return b(j.cell, a).eq(Q).text() || c
                                    } : function (a, b) {
                                        return a.getAttribute(Q.replace(/[\[\]]/g, "")) || b
                                    };
                                    a.p.userData = {};
                                    a.p.page = b.jgrid.getXmlData(c, j.page) || a.p.page || 0;
                                    a.p.lastpage = b.jgrid.getXmlData(c, j.total);
                                    if (a.p.lastpage === void 0) a.p.lastpage = 1;
                                    a.p.records = b.jgrid.getXmlData(c, j.records) || 0;
                                    b.isFunction(j.userdata) ? a.p.userData = j.userdata.call(a, c) || {} : b.jgrid.getXmlData(c, j.userdata, true).each(function () {
                                        a.p.userData[this.getAttribute("name")] = b(this).text()
                                    });
                                    c = b.jgrid.getXmlData(c, j.root, true);
                                    (c = b.jgrid.getXmlData(c, j.row, true)) || (c = []);
                                    var R = c.length,
                                        r = 0,
                                        z = [],
                                        D = parseInt(a.p.rowNum, 10),
                                        H = a.p.scroll ? b.jgrid.randId() : 1;
                                    if (R > 0 && a.p.page <= 0) a.p.page = 1;
                                    if (c && R) {
                                        g && (D = D * (g + 1));
                                        var g = b.isFunction(a.p.afterInsertRow),
                                            J = false,
                                            I;
                                        if (a.p.grouping) {
                                            J = a.p.groupingView.groupCollapse === true;
                                            I = b.jgrid.getMethod("groupingPrepare")
                                        }
                                        for (; r < R; ) {
                                            t = c[r];
                                            w = k(t, H + r);
                                            w = a.p.idPrefix + w;
                                            q = e === 0 ? 0 : e + 1;
                                            A = (q + r) % 2 == 1 ? v : "";
                                            var M = G.length;
                                            G.push("");
                                            m && G.push(K(0, r, a.p.page, a.p.rowNum));
                                            C && G.push(T(w, m, r, false));
                                            n && G.push(s.call(F, C + m, r + e));
                                            if (j.repeatitems) {
                                                x || (x = U(C + n + m));
                                                var N = b.jgrid.getXmlData(t, j.cell, true);
                                                b.each(x, function (b) {
                                                    var c = N[this];
                                                    if (!c) return false;
                                                    u = c.textContent || c.text;
                                                    B[a.p.colModel[b + C + n + m].name] = u;
                                                    G.push(E(w, u, b + C + n + m, r + e, t, B))
                                                })
                                            } else for (q = 0; q < p.length; q++) {
                                                u = b.jgrid.getXmlData(t, p[q]);
                                                B[a.p.colModel[q + C + n + m].name] = u;
                                                G.push(E(w, u, q + C + n + m, r + e, t, B))
                                            }
                                            G[M] = X(w, J, A, B, t, false);
                                            G.push("</tr>");
                                            if (a.p.grouping) {
                                                z = I.call(F, G, z, B, r);
                                                G = []
                                            }
                                            if (i || a.p.treeGrid === true) {
                                                B._id_ = w;
                                                a.p.data.push(B);
                                                a.p._index[w] = a.p.data.length - 1
                                            }
                                            if (a.p.gridview === false) {
                                                b("tbody:first", d).append(G.join(""));
                                                F.triggerHandler("jqGridAfterInsertRow", [w, B, t]);
                                                g && a.p.afterInsertRow.call(a, w, B, t);
                                                G = []
                                            }
                                            B = {};
                                            l++;
                                            r++;
                                            if (l == D) break
                                        }
                                    }
                                    if (a.p.gridview === true) {
                                        o = a.p.treeANode > -1 ? a.p.treeANode : 0;
                                        if (a.p.grouping) {
                                            F.jqGrid("groupingRender", z, a.p.colModel.length);
                                            z = null
                                        } else a.p.treeGrid === true && o > 0 ? b(a.rows[o]).after(G.join("")) : b("tbody:first", d).append(G.join(""))
                                    }
                                    if (a.p.subGrid === true) try {
                                        F.jqGrid("addSubGrid", C + m)
                                    } catch (S) { }
                                    a.p.totaltime = new Date - h;
                                    if (l > 0 && a.p.records === 0) a.p.records = R;
                                    G = null;
                                    if (a.p.treeGrid === true) try {
                                        F.jqGrid("setTreeNode", o + 1, l + o + 1)
                                    } catch (V) { }
                                    if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop = 0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && F.jqGrid("footerData", "set", a.p.userData, true);
                                    if (i) {
                                        a.p.records = R;
                                        a.p.lastpage = Math.ceil(R / D)
                                    }
                                    f || a.updatepager(false, true);
                                    if (i) for (; l < R; ) {
                                        t = c[l];
                                        w = k(t, l + H);
                                        w = a.p.idPrefix + w;
                                        if (j.repeatitems) {
                                            x || (x = U(C + n + m));
                                            var O = b.jgrid.getXmlData(t, j.cell, true);
                                            b.each(x, function (b) {
                                                var c = O[this];
                                                if (!c) return false;
                                                u = c.textContent || c.text;
                                                B[a.p.colModel[b + C + n + m].name] = u
                                            })
                                        } else for (q = 0; q < p.length; q++) {
                                            u = b.jgrid.getXmlData(t, p[q]);
                                            B[a.p.colModel[q + C + n + m].name] = u
                                        }
                                        B._id_ = w;
                                        a.p.data.push(B);
                                        a.p._index[w] = a.p.data.length - 1;
                                        B = {};
                                        l++
                                    }
                                }
                            },
                            V = function (c, d, e, f, g) {
                                d = new Date;
                                if (c) {
                                    if (a.p.treeANode === -1 && !a.p.scroll) {
                                        W.call(a, false, true);
                                        e = 1
                                    } else e = e > 1 ? e : 1;
                                    var h, i, j = a.p.datatype != "local" && a.p.loadonce || a.p.datatype == "jsonstring";
                                    if (j) {
                                        a.p.data = [];
                                        a.p._index = {};
                                        a.p.localReader.id = "_id_"
                                    }
                                    a.p.reccount = 0;
                                    if (a.p.datatype == "local") {
                                        h = a.p.localReader;
                                        i = "local"
                                    } else {
                                        h = a.p.jsonReader;
                                        i = "json"
                                    }
                                    var k = b(a),
                                        l = 0,
                                        q, o, n = [],
                                        u, C = a.p.multiselect ? 1 : 0,
                                        m = 0,
                                        s, p = a.p.rownumbers === true ? 1 : 0,
                                        r, v, x = {},
                                        B, t, w = [],
                                        G = a.p.altRows === true ? " " + a.p.altclass : "",
                                        A;
                                    a.p.page = b.jgrid.getAccessor(c, h.page) || a.p.page || 0;
                                    r = b.jgrid.getAccessor(c, h.total);
                                    if (a.p.subGrid === true) {
                                        m = 1;
                                        s = b.jgrid.getMethod("addSubGridCell")
                                    }
                                    a.p.lastpage = r === void 0 ? 1 : r;
                                    a.p.records = b.jgrid.getAccessor(c, h.records) || 0;
                                    a.p.userData = b.jgrid.getAccessor(c, h.userdata) || {};
                                    h.repeatitems || (u = n = aa(i));
                                    i = a.p.keyIndex === false ? b.isFunction(h.id) ? h.id.call(a, c) : h.id : a.p.keyIndex;
                                    if (n.length > 0 && !isNaN(i)) {
                                        a.p.remapColumns && a.p.remapColumns.length && (i = b.inArray(i, a.p.remapColumns));
                                        i = n[i]
                                    } (v = b.jgrid.getAccessor(c, h.root)) || (v = []);
                                    r = v.length;
                                    c = 0;
                                    if (r > 0 && a.p.page <= 0) a.p.page = 1;
                                    var z = parseInt(a.p.rowNum, 10),
                                        R = a.p.scroll ? b.jgrid.randId() : 1,
                                        D = false,
                                        H;
                                    g && (z = z * (g + 1));
                                    a.p.datatype === "local" && !a.p.deselectAfterSort && (D = true);
                                    var J = b.isFunction(a.p.afterInsertRow),
                                        I = [],
                                        M = false,
                                        N;
                                    if (a.p.grouping) {
                                        M = a.p.groupingView.groupCollapse === true;
                                        N = b.jgrid.getMethod("groupingPrepare")
                                    }
                                    for (; c < r; ) {
                                        g = v[c];
                                        t = b.jgrid.getAccessor(g, i);
                                        if (t === void 0) {
                                            t = R + c;
                                            if (n.length === 0 && h.cell) {
                                                q = b.jgrid.getAccessor(g, h.cell);
                                                t = q !== void 0 ? q[i] || t : t
                                            }
                                        }
                                        t = a.p.idPrefix + t;
                                        q = e === 1 ? 0 : e;
                                        A = (q + c) % 2 == 1 ? G : "";
                                        D && (H = a.p.multiselect ? b.inArray(t, a.p.selarrrow) !== -1 : t === a.p.selrow);
                                        var O = w.length;
                                        w.push("");
                                        p && w.push(K(0, c, a.p.page, a.p.rowNum));
                                        C && w.push(T(t, p, c, H));
                                        m && w.push(s.call(k, C + p, c + e));
                                        if (h.repeatitems) {
                                            h.cell && (g = b.jgrid.getAccessor(g, h.cell));
                                            u || (u = U(C + m + p))
                                        }
                                        for (o = 0; o < u.length; o++) {
                                            q = b.jgrid.getAccessor(g, u[o]);
                                            x[a.p.colModel[o + C + m + p].name] = q;
                                            w.push(E(t, q, o + C + m + p, c + e, g, x))
                                        }
                                        w[O] = X(t, M, A, x, g, H);
                                        w.push("</tr>");
                                        if (a.p.grouping) {
                                            I = N.call(k, w, I, x, c);
                                            w = []
                                        }
                                        if (j || a.p.treeGrid === true) {
                                            x._id_ = t;
                                            a.p.data.push(x);
                                            a.p._index[t] = a.p.data.length - 1
                                        }
                                        if (a.p.gridview === false) {
                                            b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(w.join(""));
                                            k.triggerHandler("jqGridAfterInsertRow", [t, x, g]);
                                            J && a.p.afterInsertRow.call(a, t, x, g);
                                            w = []
                                        }
                                        x = {};
                                        l++;
                                        c++;
                                        if (l == z) break
                                    }
                                    if (a.p.gridview === true) {
                                        B = a.p.treeANode > -1 ? a.p.treeANode : 0;
                                        a.p.grouping ? k.jqGrid("groupingRender", I, a.p.colModel.length) : a.p.treeGrid === true && B > 0 ? b(a.rows[B]).after(w.join("")) : b("#" + b.jgrid.jqID(a.p.id) + " tbody:first").append(w.join(""))
                                    }
                                    if (a.p.subGrid === true) try {
                                        k.jqGrid("addSubGrid", C + p)
                                    } catch (S) { }
                                    a.p.totaltime = new Date - d;
                                    if (l > 0 && a.p.records === 0) a.p.records = r;
                                    if (a.p.treeGrid === true) try {
                                        k.jqGrid("setTreeNode", B + 1, l + B + 1)
                                    } catch (V) { }
                                    if (!a.p.treeGrid && !a.p.scroll) a.grid.bDiv.scrollTop = 0;
                                    a.p.reccount = l;
                                    a.p.treeANode = -1;
                                    a.p.userDataOnFooter && k.jqGrid("footerData", "set", a.p.userData, true);
                                    if (j) {
                                        a.p.records = r;
                                        a.p.lastpage = Math.ceil(r / z)
                                    }
                                    f || a.updatepager(false, true);
                                    if (j) for (; l < r && v[l]; ) {
                                        g = v[l];
                                        t = b.jgrid.getAccessor(g, i);
                                        if (t === void 0) {
                                            t = R + l;
                                            n.length === 0 && h.cell && (t = b.jgrid.getAccessor(g, h.cell)[i] || t)
                                        }
                                        if (g) {
                                            t = a.p.idPrefix + t;
                                            if (h.repeatitems) {
                                                h.cell && (g = b.jgrid.getAccessor(g, h.cell));
                                                u || (u = U(C + m + p))
                                            }
                                            for (o = 0; o < u.length; o++) {
                                                q = b.jgrid.getAccessor(g, u[o]);
                                                x[a.p.colModel[o + C + m + p].name] = q
                                            }
                                            x._id_ = t;
                                            a.p.data.push(x);
                                            a.p._index[t] = a.p.data.length - 1;
                                            x = {}
                                        }
                                        l++
                                    }
                                }
                            },
                            ja = function () {
                                function c(a) {
                                    var b = 0,
                                        d, e, g, h, i;
                                    if (a.groups != null) {
                                        (e = a.groups.length && a.groupOp.toString().toUpperCase() === "OR") && u.orBegin();
                                        for (d = 0; d < a.groups.length; d++) {
                                            b > 0 && e && u.or();
                                            try {
                                                c(a.groups[d])
                                            } catch (j) {
                                                alert(j)
                                            }
                                            b++
                                        }
                                        e && u.orEnd()
                                    }
                                    if (a.rules != null) try {
                                        (g = a.rules.length && a.groupOp.toString().toUpperCase() === "OR") && u.orBegin();
                                        for (d = 0; d < a.rules.length; d++) {
                                            i = a.rules[d];
                                            h = a.groupOp.toString().toUpperCase();
                                            if (n[i.op] && i.field) {
                                                b > 0 && h && h === "OR" && (u = u.or());
                                                u = n[i.op](u, h)(i.field, i.data, f[i.field])
                                            }
                                            b++
                                        }
                                        g && u.orEnd()
                                    } catch (oa) {
                                        alert(oa)
                                    }
                                }
                                var d, e = false,
                                    f = {},
                                    g = [],
                                    h = [],
                                    i, j, k;
                                if (b.isArray(a.p.data)) {
                                    var l = a.p.grouping ? a.p.groupingView : false,
                                        q, o;
                                    b.each(a.p.colModel, function () {
                                        j = this.sorttype || "text";
                                        if (j == "date" || j == "datetime") {
                                            if (this.formatter && typeof this.formatter === "string" && this.formatter == "date") {
                                                i = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : b.jgrid.formatter.date.srcformat;
                                                k = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : b.jgrid.formatter.date.newformat
                                            } else i = k = this.datefmt || "Y-m-d";
                                            f[this.name] = {
                                                stype: j,
                                                srcfmt: i,
                                                newfmt: k
                                            }
                                        } else f[this.name] = {
                                            stype: j,
                                            srcfmt: "",
                                            newfmt: ""
                                        };
                                        if (a.p.grouping) {
                                            o = 0;
                                            for (q = l.groupField.length; o < q; o++) if (this.name == l.groupField[o]) {
                                                var c = this.name;
                                                if (this.index) c = this.index;
                                                g[o] = f[c];
                                                h[o] = c
                                            }
                                        }
                                        if (!e && (this.index == a.p.sortname || this.name == a.p.sortname)) {
                                            d = this.name;
                                            e = true
                                        }
                                    });
                                    if (a.p.treeGrid) b(a).jqGrid("SortTree", d, a.p.sortorder, f[d].stype, f[d].srcfmt);
                                    else {
                                        var n = {
                                            eq: function (a) {
                                                return a.equals
                                            },
                                            ne: function (a) {
                                                return a.notEquals
                                            },
                                            lt: function (a) {
                                                return a.less
                                            },
                                            le: function (a) {
                                                return a.lessOrEquals
                                            },
                                            gt: function (a) {
                                                return a.greater
                                            },
                                            ge: function (a) {
                                                return a.greaterOrEquals
                                            },
                                            cn: function (a) {
                                                return a.contains
                                            },
                                            nc: function (a, b) {
                                                return b === "OR" ? a.orNot().contains : a.andNot().contains
                                            },
                                            bw: function (a) {
                                                return a.startsWith
                                            },
                                            bn: function (a, b) {
                                                return b === "OR" ? a.orNot().startsWith : a.andNot().startsWith
                                            },
                                            en: function (a, b) {
                                                return b === "OR" ? a.orNot().endsWith : a.andNot().endsWith
                                            },
                                            ew: function (a) {
                                                return a.endsWith
                                            },
                                            ni: function (a, b) {
                                                return b === "OR" ? a.orNot().equals : a.andNot().equals
                                            },
                                            "in": function (a) {
                                                return a.equals
                                            },
                                            nu: function (a) {
                                                return a.isNull
                                            },
                                            nn: function (a, b) {
                                                return b === "OR" ? a.orNot().isNull : a.andNot().isNull
                                            }
                                        },
                                            u = b.jgrid.from(a.p.data);
                                        a.p.ignoreCase && (u = u.ignoreCase());
                                        if (a.p.search === true) {
                                            var m = a.p.postData.filters;
                                            if (m) {
                                                typeof m === "string" && (m = b.jgrid.parse(m));
                                                c(m)
                                            } else try {
                                                u = n[a.p.postData.searchOper](u)(a.p.postData.searchField, a.p.postData.searchString, f[a.p.postData.searchField])
                                            } catch (p) { }
                                        }
                                        if (a.p.grouping) for (o = 0; o < q; o++) u.orderBy(h[o], l.groupOrder[o], g[o].stype, g[o].srcfmt);
                                        d && a.p.sortorder && e && (a.p.sortorder.toUpperCase() == "DESC" ? u.orderBy(a.p.sortname, "d", f[d].stype, f[d].srcfmt) : u.orderBy(a.p.sortname, "a", f[d].stype, f[d].srcfmt));
                                        var m = u.select(),
                                            r = parseInt(a.p.rowNum, 10),
                                            s = m.length,
                                            v = parseInt(a.p.page, 10),
                                            E = Math.ceil(s / r),
                                            x = {},
                                            m = m.slice((v - 1) * r, v * r),
                                            f = u = null;
                                        x[a.p.localReader.total] = E;
                                        x[a.p.localReader.page] = v;
                                        x[a.p.localReader.records] = s;
                                        x[a.p.localReader.root] = m;
                                        x[a.p.localReader.userdata] = a.p.userData;
                                        m = null;
                                        return x
                                    }
                                }
                            },
                            ba = function () {
                                a.grid.hDiv.loading = true;
                                if (!a.p.hiddengrid) switch (a.p.loadui) {
                                    case "enable":
                                        b("#load_" + b.jgrid.jqID(a.p.id)).show();
                                        break;
                                    case "block":
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                                        b("#load_" + b.jgrid.jqID(a.p.id)).show()
                                }
                            },
                            O = function () {
                                a.grid.hDiv.loading = false;
                                switch (a.p.loadui) {
                                    case "enable":
                                        b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                                        break;
                                    case "block":
                                        b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                                        b("#load_" + b.jgrid.jqID(a.p.id)).hide()
                                }
                            },
                            I = function (c) {
                                if (!a.grid.hDiv.loading) {
                                    var d = a.p.scroll && c === false,
                                        e = {},
                                        f, g = a.p.prmNames;
                                    if (a.p.page <= 0) a.p.page = 1;
                                    if (g.search !== null) e[g.search] = a.p.search;
                                    g.nd !== null && (e[g.nd] = (new Date).getTime());
                                    if (g.rows !== null) e[g.rows] = a.p.rowNum;
                                    if (g.page !== null) e[g.page] = a.p.page;
                                    if (g.sort !== null) e[g.sort] = a.p.sortname;
                                    if (g.order !== null) e[g.order] = a.p.sortorder;
                                    if (a.p.rowTotal !== null && g.totalrows !== null) e[g.totalrows] = a.p.rowTotal;
                                    var h = b.isFunction(a.p.loadComplete),
                                        i = h ? a.p.loadComplete : null,
                                        j = 0,
                                        c = c || 1;
                                    if (c > 1) if (g.npage !== null) {
                                        e[g.npage] = c;
                                        j = c - 1;
                                        c = 1
                                    } else i = function (b) {
                                        a.p.page++;
                                        a.grid.hDiv.loading = false;
                                        h && a.p.loadComplete.call(a, b);
                                        I(c - 1)
                                    };
                                    else g.npage !== null && delete a.p.postData[g.npage];
                                    if (a.p.grouping) {
                                        b(a).jqGrid("groupingSetup");
                                        var k = a.p.groupingView,
                                            l, q = "";
                                        for (l = 0; l < k.groupField.length; l++) {
                                            var o = k.groupField[l];
                                            b.each(a.p.colModel, function (a, b) {
                                                if (b.name == o && b.index) o = b.index
                                            });
                                            q = q + (o + " " + k.groupOrder[l] + ", ")
                                        }
                                        e[g.sort] = q + e[g.sort]
                                    }
                                    b.extend(a.p.postData, e);
                                    var n = !a.p.scroll ? 1 : a.rows.length - 1,
                                        e = b(a).triggerHandler("jqGridBeforeRequest");
                                    if (!(e === false || e === "stop")) if (b.isFunction(a.p.datatype)) a.p.datatype.call(a, a.p.postData, "load_" + a.p.id);
                                    else {
                                        if (b.isFunction(a.p.beforeRequest)) {
                                            e = a.p.beforeRequest.call(a);
                                            e === void 0 && (e = true);
                                            if (e === false) return
                                        }
                                        f = a.p.datatype.toLowerCase();
                                        switch (f) {
                                            case "json":
                                            case "jsonp":
                                            case "xml":
                                            case "script":
                                                b.ajax(b.extend({
                                                    url: a.p.url,
                                                    type: a.p.mtype,
                                                    dataType: f,
                                                    data: b.isFunction(a.p.serializeGridData) ? a.p.serializeGridData.call(a, a.p.postData) : a.p.postData,
                                                    success: function (e, g, h) {
                                                        if (b.isFunction(a.p.beforeProcessing) && a.p.beforeProcessing.call(a, e, g, h) === false) O();
                                                        else {
                                                            f === "xml" ? H(e, a.grid.bDiv, n, c > 1, j) : V(e, a.grid.bDiv, n, c > 1, j);
                                                            b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                            i && i.call(a, e);
                                                            b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                            d && a.grid.populateVisible();
                                                            if (a.p.loadonce || a.p.treeGrid) a.p.datatype = "local";
                                                            c === 1 && O()
                                                        }
                                                    },
                                                    error: function (e, d, f) {
                                                        b.isFunction(a.p.loadError) && a.p.loadError.call(a, e, d, f);
                                                        c === 1 && O()
                                                    },
                                                    beforeSend: function (c, e) {
                                                        var d = true;
                                                        b.isFunction(a.p.loadBeforeSend) && (d = a.p.loadBeforeSend.call(a, c, e));
                                                        d === void 0 && (d = true);
                                                        if (d === false) return false;
                                                        ba()
                                                    }
                                                }, b.jgrid.ajaxOptions, a.p.ajaxGridOptions));
                                                break;
                                            case "xmlstring":
                                                ba();
                                                e = b.jgrid.stringToDoc(a.p.datastr);
                                                H(e, a.grid.bDiv);
                                                b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                h && a.p.loadComplete.call(a, e);
                                                b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                a.p.datatype = "local";
                                                a.p.datastr = null;
                                                O();
                                                break;
                                            case "jsonstring":
                                                ba();
                                                e = typeof a.p.datastr === "string" ? b.jgrid.parse(a.p.datastr) : a.p.datastr;
                                                V(e, a.grid.bDiv);
                                                b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                h && a.p.loadComplete.call(a, e);
                                                b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                a.p.datatype = "local";
                                                a.p.datastr = null;
                                                O();
                                                break;
                                            case "local":
                                            case "clientside":
                                                ba();
                                                a.p.datatype = "local";
                                                e = ja();
                                                V(e, a.grid.bDiv, n, c > 1, j);
                                                b(a).triggerHandler("jqGridLoadComplete", [e]);
                                                i && i.call(a, e);
                                                b(a).triggerHandler("jqGridAfterLoadComplete", [e]);
                                                d && a.grid.populateVisible();
                                                O()
                                        }
                                    }
                                }
                            },
                            ca = function (c) {
                                b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.hDiv)[a.p.useProp ? "prop" : "attr"]("checked", c);
                                if (a.p.frozenColumns && a.p.id + "_frozen") b("#cb_" + b.jgrid.jqID(a.p.id), a.grid.fhDiv)[a.p.useProp ? "prop" : "attr"]("checked", c)
                            },
                            ka = function (c, d) {
                                var e = "",
                                    f = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                                    h = "",
                                    i, j, k, l, m = function (c) {
                                        var d;
                                        b.isFunction(a.p.onPaging) && (d = a.p.onPaging.call(a, c));
                                        a.p.selrow = null;
                                        if (a.p.multiselect) {
                                            a.p.selarrrow = [];
                                            ca(false)
                                        }
                                        a.p.savedRow = [];
                                        return d == "stop" ? false : true
                                    },
                                    c = c.substr(1),
                                    d = d + ("_" + c);
                                i = "pg_" + c;
                                j = c + "_left";
                                k = c + "_center";
                                l = c + "_right";
                                b("#" + b.jgrid.jqID(c)).append("<div id='" + i + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + j + "' align='left'></td><td id='" + k + "' align='center' style='white-space:pre;'></td><td id='" + l + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                                if (a.p.rowList.length > 0) {
                                    h = "<td dir='" + g + "'>";
                                    h = h + "<select class='ui-pg-selbox' role='listbox'>";
                                    for (j = 0; j < a.p.rowList.length; j++) h = h + ('<option role="option" value="' + a.p.rowList[j] + '"' + (a.p.rowNum == a.p.rowList[j] ? ' selected="selected"' : "") + ">" + a.p.rowList[j] + "</option>");
                                    h = h + "</select></td>"
                                }
                                g == "rtl" && (f = f + h);
                                a.p.pginput === true && (e = "<td dir='" + g + "'>" + b.jgrid.format(a.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + b.jgrid.jqID(c) + "'></span>") + "</td>");
                                if (a.p.pgbuttons === true) {
                                    j = ["first" + d, "prev" + d, "next" + d, "last" + d];
                                    g == "rtl" && j.reverse();
                                    f = f + ("<td id='" + j[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>");
                                    f = f + ("<td id='" + j[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>");
                                    f = f + (e !== "" ? "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" + e + "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>" : "") + ("<td id='" + j[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>");
                                    f = f + ("<td id='" + j[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>")
                                } else e !== "" && (f = f + e);
                                g == "ltr" && (f = f + h);
                                f = f + "</tr></tbody></table>";
                                a.p.viewrecords === true && b("td#" + c + "_" + a.p.recordpos, "#" + i).append("<div dir='" + g + "' style='text-align:" + a.p.recordpos + "' class='ui-paging-info'></div>");
                                b("td#" + c + "_" + a.p.pagerpos, "#" + i).append(f);
                                h = b(".ui-jqgrid").css("font-size") || "11px";
                                b(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + h + ";visibility:hidden;' ></div>");
                                f = b(f).clone().appendTo("#testpg").width();
                                b("#testpg").remove();
                                if (f > 0) {
                                    e !== "" && (f = f + 50);
                                    b("td#" + c + "_" + a.p.pagerpos, "#" + i).width(f)
                                }
                                a.p._nvtd = [];
                                a.p._nvtd[0] = f ? Math.floor((a.p.width - f) / 2) : Math.floor(a.p.width / 3);
                                a.p._nvtd[1] = 0;
                                f = null;
                                b(".ui-pg-selbox", "#" + i).bind("change", function () {
                                    if (!m("records")) return false;
                                    a.p.page = Math.round(a.p.rowNum * (a.p.page - 1) / this.value - 0.5) + 1;
                                    a.p.rowNum = this.value;
                                    a.p.pager && b(".ui-pg-selbox", a.p.pager).val(this.value);
                                    a.p.toppager && b(".ui-pg-selbox", a.p.toppager).val(this.value);
                                    I();
                                    return false
                                });
                                if (a.p.pgbuttons === true) {
                                    b(".ui-pg-button", "#" + i).hover(function () {
                                        if (b(this).hasClass("ui-state-disabled")) this.style.cursor = "default";
                                        else {
                                            b(this).addClass("ui-state-hover");
                                            this.style.cursor = "pointer"
                                        }
                                    }, function () {
                                        if (!b(this).hasClass("ui-state-disabled")) {
                                            b(this).removeClass("ui-state-hover");
                                            this.style.cursor = "default"
                                        }
                                    });
                                    b("#first" + b.jgrid.jqID(d) + ", #prev" + b.jgrid.jqID(d) + ", #next" + b.jgrid.jqID(d) + ", #last" + b.jgrid.jqID(d)).click(function () {
                                        var b = n(a.p.page, 1),
                                            c = n(a.p.lastpage, 1),
                                            e = false,
                                            f = true,
                                            g = true,
                                            h = true,
                                            i = true;
                                        if (c === 0 || c === 1) i = h = g = f = false;
                                        else if (c > 1 && b >= 1) if (b === 1) g = f = false;
                                        else {
                                            if (b === c) i = h = false
                                        } else if (c > 1 && b === 0) {
                                            i = h = false;
                                            b = c - 1
                                        }
                                        if (!m(this.id)) return false;
                                        if (this.id === "first" + d && f) {
                                            a.p.page = 1;
                                            e = true
                                        }
                                        if (this.id === "prev" + d && g) {
                                            a.p.page = b - 1;
                                            e = true
                                        }
                                        if (this.id === "next" + d && h) {
                                            a.p.page = b + 1;
                                            e = true
                                        }
                                        if (this.id === "last" + d && i) {
                                            a.p.page = c;
                                            e = true
                                        }
                                        e && I();
                                        return false
                                    })
                                }
                                a.p.pginput === true && b("input.ui-pg-input", "#" + i).keypress(function (c) {
                                    if ((c.charCode || c.keyCode || 0) == 13) {
                                        if (!m("user")) return false;
                                        a.p.page = b(this).val() > 0 ? b(this).val() : a.p.page;
                                        I();
                                        return false
                                    }
                                    return this
                                })
                            },
                            la = function (c, d, e, f) {
                                if (a.p.colModel[d].sortable && !(a.p.savedRow.length > 0)) {
                                    if (!e) {
                                        if (a.p.lastsort == d) if (a.p.sortorder == "asc") a.p.sortorder = "desc";
                                        else {
                                            if (a.p.sortorder == "desc") a.p.sortorder = "asc"
                                        } else a.p.sortorder = a.p.colModel[d].firstsortorder || "asc";
                                        a.p.page = 1
                                    }
                                    if (f) {
                                        if (a.p.lastsort == d && a.p.sortorder == f && !e) return;
                                        a.p.sortorder = f
                                    }
                                    e = a.grid.headers[a.p.lastsort].el;
                                    f = a.grid.headers[d].el;
                                    b("span.ui-grid-ico-sort", e).addClass("ui-state-disabled");
                                    b(e).attr("aria-selected", "false");
                                    b("span.ui-icon-" + a.p.sortorder, f).removeClass("ui-state-disabled");
                                    b(f).attr("aria-selected", "true");
                                    if (!a.p.viewsortcols[0] && a.p.lastsort != d) {
                                        b("span.s-ico", e).hide();
                                        b("span.s-ico", f).show()
                                    }
                                    c = c.substring(5 + a.p.id.length + 1);
                                    a.p.sortname = a.p.colModel[d].index || c;
                                    e = a.p.sortorder;
                                    if (b(a).triggerHandler("jqGridSortCol", [c, d, e]) === "stop") a.p.lastsort = d;
                                    else if (b.isFunction(a.p.onSortCol) && a.p.onSortCol.call(a, c, d, e) == "stop") a.p.lastsort = d;
                                    else {
                                        if (a.p.datatype == "local") a.p.deselectAfterSort && b(a).jqGrid("resetSelection");
                                        else {
                                            a.p.selrow = null;
                                            a.p.multiselect && ca(false);
                                            a.p.selarrrow = [];
                                            a.p.savedRow = []
                                        }
                                        if (a.p.scroll) {
                                            e = a.grid.bDiv.scrollLeft;
                                            W.call(a, true, false);
                                            a.grid.hDiv.scrollLeft = e
                                        }
                                        a.p.subGrid && a.p.datatype == "local" && b("td.sgexpanded", "#" + b.jgrid.jqID(a.p.id)).each(function () {
                                            b(this).trigger("click")
                                        });
                                        I();
                                        a.p.lastsort = d;
                                        if (a.p.sortname != c && d) a.p.lastsort = d
                                    }
                                }
                            },
                            pa = function (c) {
                                var d, e = [0],
                                    f = b.jgrid.cell_width ? 0 : a.p.cellLayout;
                                for (d = 0; d <= c; d++) a.p.colModel[d].hidden === false && (e[0] = e[0] + (a.p.colModel[d].width + f));
                                a.p.direction == "rtl" && (e[0] = a.p.width - e[0]);
                                e[0] = e[0] - a.grid.bDiv.scrollLeft;
                                e.push(b(a.grid.hDiv).position().top);
                                e.push(b(a.grid.bDiv).offset().top - b(a.grid.hDiv).offset().top + b(a.grid.bDiv).height());
                                return e
                            },
                            ma = function (c) {
                                var d, e = a.grid.headers,
                                    f = b.jgrid.getCellIndex(c);
                                for (d = 0; d < e.length; d++) if (c === e[d].el) {
                                    f = d;
                                    break
                                }
                                return f
                            };
                        this.p.id = this.id; -1 == b.inArray(a.p.multikey, ["shiftKey", "altKey", "ctrlKey"]) && (a.p.multikey = !1);
                        a.p.keyIndex = !1;
                        for (d = 0; d < a.p.colModel.length; d++) a.p.colModel[d] = b.extend(!0, {}, a.p.cmTemplate, a.p.colModel[d].template || {}, a.p.colModel[d]), !1 === a.p.keyIndex && !0 === a.p.colModel[d].key && (a.p.keyIndex = d);
                        a.p.sortorder = a.p.sortorder.toLowerCase();
                        b.jgrid.cell_width = b.jgrid.cellWidth();
                        !0 === a.p.grouping && (a.p.scroll = !1, a.p.rownumbers = !1, a.p.treeGrid = !1, a.p.gridview = !0);
                        if (!0 === this.p.treeGrid) {
                            try {
                                b(this).jqGrid("setTreeGrid")
                            } catch (ra) { }
                            "local" != a.p.datatype && (a.p.localReader = {
                                id: "_id_"
                            })
                        }
                        if (this.p.subGrid) try {
                            b(a).jqGrid("setSubGrid")
                        } catch (sa) { }
                        this.p.multiselect && (this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>"), this.p.colModel.unshift({
                            name: "cb",
                            width: b.jgrid.cell_width ? a.p.multiselectWidth + a.p.cellLayout : a.p.multiselectWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        this.p.rownumbers && (this.p.colNames.unshift(""), this.p.colModel.unshift({
                            name: "rn",
                            width: a.p.rownumWidth,
                            sortable: !1,
                            resizable: !1,
                            hidedlg: !0,
                            search: !1,
                            align: "center",
                            fixed: !0
                        }));
                        a.p.xmlReader = b.extend(!0, {
                            root: "rows",
                            row: "row",
                            page: "rows>page",
                            total: "rows>total",
                            records: "rows>records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "[id]",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                row: "row",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.xmlReader);
                        a.p.jsonReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !0,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.jsonReader);
                        a.p.localReader = b.extend(!0, {
                            root: "rows",
                            page: "page",
                            total: "total",
                            records: "records",
                            repeatitems: !1,
                            cell: "cell",
                            id: "id",
                            userdata: "userdata",
                            subgrid: {
                                root: "rows",
                                repeatitems: !0,
                                cell: "cell"
                            }
                        }, a.p.localReader);
                        a.p.scroll && (a.p.pgbuttons = !1, a.p.pginput = !1, a.p.rowList = []);
                        a.p.data.length && M();
                        var z = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                            na, N, da, ea, fa, A, p, Y;
                        N = Y = "";
                        if (!0 === a.p.shrinkToFit && !0 === a.p.forceFit) for (d = a.p.colModel.length - 1; 0 <= d; d--) if (!a.p.colModel[d].hidden) {
                            a.p.colModel[d].resizable = !1;
                            break
                        }
                        "horizontal" == a.p.viewsortcols[1] && (Y = " ui-i-asc", N = " ui-i-desc");
                        na = k ? "class='ui-th-div-ie'" : "";
                        Y = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + Y + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + g + "'></span>" + ("<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + N + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + g + "'></span></span>");
                        for (d = 0; d < this.p.colNames.length; d++) N = a.p.headertitles ? ' title="' + b.jgrid.stripHtml(a.p.colNames[d]) + '"' : "", z += "<th id='" + a.p.id + "_" + a.p.colModel[d].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + g + "'" + N + ">", N = a.p.colModel[d].index || a.p.colModel[d].name, z += "<div id='jqgh_" + a.p.id + "_" + a.p.colModel[d].name + "' " + na + ">" + a.p.colNames[d], a.p.colModel[d].width = a.p.colModel[d].width ? parseInt(a.p.colModel[d].width, 10) : 150, "boolean" !== typeof a.p.colModel[d].title && (a.p.colModel[d].title = !0), N == a.p.sortname && (a.p.lastsort = d), z += Y + "</div></th>";
                        Y = null;
                        b(this).append(z + "</tr></thead>");
                        b("thead tr:first th", this).hover(function () {
                            b(this).addClass("ui-state-hover")
                        }, function () {
                            b(this).removeClass("ui-state-hover")
                        });
                        if (this.p.multiselect) {
                            var ga = [],
                                Z;
                            b("#cb_" + b.jgrid.jqID(a.p.id), this).bind("click", function () {
                                a.p.selarrrow = [];
                                var c = a.p.frozenColumns === true ? a.p.id + "_frozen" : "";
                                if (this.checked) {
                                    b(a.rows).each(function (d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("jqgroup") && !b(this).hasClass("ui-state-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", true);
                                            b(this).addClass("ui-state-highlight").attr("aria-selected", "true");
                                            a.p.selarrrow.push(this.id);
                                            a.p.selrow = this.id;
                                            if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked", true);
                                                b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).addClass("ui-state-highlight")
                                            }
                                        }
                                    });
                                    Z = true;
                                    ga = []
                                } else {
                                    b(a.rows).each(function (d) {
                                        if (d > 0 && !b(this).hasClass("ui-subgrid") && !b(this).hasClass("ui-state-disabled")) {
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id))[a.p.useProp ? "prop" : "attr"]("checked", false);
                                            b(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                            ga.push(this.id);
                                            if (c) {
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(this.id), a.grid.fbDiv)[a.p.useProp ? "prop" : "attr"]("checked", false);
                                                b("#" + b.jgrid.jqID(this.id), a.grid.fbDiv).removeClass("ui-state-highlight")
                                            }
                                        }
                                    });
                                    a.p.selrow = null;
                                    Z = false
                                }
                                b(a).triggerHandler("jqGridSelectAll", [Z ? a.p.selarrrow : ga, Z]);
                                b.isFunction(a.p.onSelectAll) && a.p.onSelectAll.call(a, Z ? a.p.selarrrow : ga, Z)
                            })
                        } !0 === a.p.autowidth && (z = b(l).innerWidth(), a.p.width = 0 < z ? z : "nw");
                        (function () {
                            var d = 0,
                                e = b.jgrid.cell_width ? 0 : n(a.p.cellLayout, 0),
                                f = 0,
                                g, h = n(a.p.scrollOffset, 0),
                                j, k = false,
                                l, m = 0,
                                p = 0,
                                q;
                            b.each(a.p.colModel, function () {
                                if (this.hidden === void 0) this.hidden = false;
                                if (a.p.grouping && a.p.autowidth) {
                                    var c = b.inArray(this.name, a.p.groupingView.groupField);
                                    if (c !== -1) this.hidden = !a.p.groupingView.groupColumnShow[c]
                                }
                                this.widthOrg = j = n(this.width, 0);
                                if (this.hidden === false) {
                                    d = d + (j + e);
                                    this.fixed ? m = m + (j + e) : f++;
                                    p++
                                }
                            });
                            if (isNaN(a.p.width)) a.p.width = d + (a.p.shrinkToFit === false && !isNaN(a.p.height) ? h : 0);
                            c.width = a.p.width;
                            a.p.tblwidth = d;
                            if (a.p.shrinkToFit === false && a.p.forceFit === true) a.p.forceFit = false;
                            if (a.p.shrinkToFit === true && f > 0) {
                                l = c.width - e * f - m;
                                if (!isNaN(a.p.height)) {
                                    l = l - h;
                                    k = true
                                }
                                d = 0;
                                b.each(a.p.colModel, function (b) {
                                    if (this.hidden === false && !this.fixed) {
                                        this.width = j = Math.round(l * this.width / (a.p.tblwidth - e * f - m));
                                        d = d + j;
                                        g = b
                                    }
                                });
                                q = 0;
                                k ? c.width - m - (d + e * f) !== h && (q = c.width - m - (d + e * f) - h) : !k && Math.abs(c.width - m - (d + e * f)) !== 1 && (q = c.width - m - (d + e * f));
                                a.p.colModel[g].width = a.p.colModel[g].width + q;
                                a.p.tblwidth = d + q + e * f + m;
                                if (a.p.tblwidth > a.p.width) {
                                    a.p.colModel[g].width = a.p.colModel[g].width - (a.p.tblwidth - parseInt(a.p.width, 10));
                                    a.p.tblwidth = a.p.width
                                }
                            }
                        })();
                        b(l).css("width", c.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + a.p.id + "'>&#160;</div>");
                        b(j).css("width", c.width + "px");
                        var z = b("thead:first", a).get(0),
                            S = "";
                        a.p.footerrow && (S += "<table role='grid' style='width:" + a.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + g + "'>");
                        var j = b("tr:first", z),
                            $ = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                        a.p.disableClick = !1;
                        b("th", j).each(function (d) {
                            da = a.p.colModel[d].width;
                            if (a.p.colModel[d].resizable === void 0) a.p.colModel[d].resizable = true;
                            if (a.p.colModel[d].resizable) {
                                ea = document.createElement("span");
                                b(ea).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + g).css("cursor", "col-resize");
                                b(this).addClass(a.p.resizeclass)
                            } else ea = "";
                            b(this).css("width", da + "px").prepend(ea);
                            var e = "";
                            if (a.p.colModel[d].hidden) {
                                b(this).css("display", "none");
                                e = "display:none;"
                            }
                            $ = $ + ("<td role='gridcell' style='height:0px;width:" + da + "px;" + e + "'></td>");
                            c.headers[d] = {
                                width: da,
                                el: this
                            };
                            fa = a.p.colModel[d].sortable;
                            if (typeof fa !== "boolean") fa = a.p.colModel[d].sortable = true;
                            e = a.p.colModel[d].name;
                            e == "cb" || e == "subgrid" || e == "rn" || a.p.viewsortcols[2] && b(">div", this).addClass("ui-jqgrid-sortable");
                            if (fa) if (a.p.viewsortcols[0]) {
                                b("div span.s-ico", this).show();
                                d == a.p.lastsort && b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                            } else if (d == a.p.lastsort) {
                                b("div span.s-ico", this).show();
                                b("div span.ui-icon-" + a.p.sortorder, this).removeClass("ui-state-disabled")
                            }
                            a.p.footerrow && (S = S + ("<td role='gridcell' " + s(d, 0, "", null, "", false) + ">&#160;</td>"))
                        }).mousedown(function (d) {
                            if (b(d.target).closest("th>span.ui-jqgrid-resize").length == 1) {
                                var e = ma(this);
                                if (a.p.forceFit === true) {
                                    var f = a.p,
                                        g = e,
                                        h;
                                    for (h = e + 1; h < a.p.colModel.length; h++) if (a.p.colModel[h].hidden !== true) {
                                        g = h;
                                        break
                                    }
                                    f.nv = g - e
                                }
                                c.dragStart(e, d, pa(e));
                                return false
                            }
                        }).click(function (c) {
                            if (a.p.disableClick) return a.p.disableClick = false;
                            var d = "th>div.ui-jqgrid-sortable",
                                e, f;
                            a.p.viewsortcols[2] || (d = "th>div>span>span.ui-grid-ico-sort");
                            c = b(c.target).closest(d);
                            if (c.length == 1) {
                                d = ma(this);
                                if (!a.p.viewsortcols[2]) {
                                    e = true;
                                    f = c.attr("sort")
                                }
                                la(b("div", this)[0].id, d, e, f);
                                return false
                            }
                        });
                        if (a.p.sortable && b.fn.sortable) try {
                            b(a).jqGrid("sortableColumns", j)
                        } catch (ta) { }
                        a.p.footerrow && (S += "</tr></tbody></table>");
                        $ += "</tr>";
                        this.appendChild(document.createElement("tbody"));
                        b(this).addClass("ui-jqgrid-btable").append($);
                        var $ = null,
                            j = b("<table class='ui-jqgrid-htable' style='width:" + a.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(z),
                            D = a.p.caption && !0 === a.p.hiddengrid ? !0 : !1;
                        d = b("<div class='ui-jqgrid-hbox" + ("rtl" == g ? "-rtl" : "") + "'></div>");
                        z = null;
                        c.hDiv = document.createElement("div");
                        b(c.hDiv).css({
                            width: c.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-hdiv").append(d);
                        b(d).append(j);
                        j = null;
                        D && b(c.hDiv).hide();
                        a.p.pager && ("string" === typeof a.p.pager ? "#" != a.p.pager.substr(0, 1) && (a.p.pager = "#" + a.p.pager) : a.p.pager = "#" + b(a.p.pager).attr("id"), b(a.p.pager).css({
                            width: c.width + "px"
                        }).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(l), D && b(a.p.pager).hide(), ka(a.p.pager, ""));
                        !1 === a.p.cellEdit && !0 === a.p.hoverrows && b(a).bind("mouseover", function (a) {
                            p = b(a.target).closest("tr.jqgrow");
                            b(p).attr("class") !== "ui-subgrid" && b(p).addClass("ui-state-hover")
                        }).bind("mouseout", function (a) {
                            p = b(a.target).closest("tr.jqgrow");
                            b(p).removeClass("ui-state-hover")
                        });
                        var r, J, ha;
                        b(a).before(c.hDiv).click(function (c) {
                            A = c.target;
                            p = b(A, a.rows).closest("tr.jqgrow");
                            if (b(p).length === 0 || p[0].className.indexOf("ui-state-disabled") > -1 || (b(A, a).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== a.id) return this;
                            var d = b(A).hasClass("cbox"),
                                e = b(a).triggerHandler("jqGridBeforeSelectRow", [p[0].id, c]);
                            (e = e === false || e === "stop" ? false : true) && b.isFunction(a.p.beforeSelectRow) && (e = a.p.beforeSelectRow.call(a, p[0].id, c));
                            if (!(A.tagName == "A" || (A.tagName == "INPUT" || A.tagName == "TEXTAREA" || A.tagName == "OPTION" || A.tagName == "SELECT") && !d) && e === true) {
                                r = p[0].id;
                                J = b.jgrid.getCellIndex(A);
                                ha = b(A).closest("td,th").html();
                                b(a).triggerHandler("jqGridCellSelect", [r, J, ha, c]);
                                b.isFunction(a.p.onCellSelect) && a.p.onCellSelect.call(a, r, J, ha, c);
                                if (a.p.cellEdit === true) if (a.p.multiselect && d) b(a).jqGrid("setSelection", r, true, c);
                                else {
                                    r = p[0].rowIndex;
                                    try {
                                        b(a).jqGrid("editCell", r, J, true)
                                    } catch (f) { }
                                } else if (a.p.multikey) if (c[a.p.multikey]) b(a).jqGrid("setSelection", r, true, c);
                                else {
                                    if (a.p.multiselect && d) {
                                        d = b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + r).is(":checked");
                                        b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + r)[a.p.useProp ? "prop" : "attr"]("checked", d)
                                    }
                                } else {
                                    if (a.p.multiselect && a.p.multiboxonly && !d) {
                                        var g = a.p.frozenColumns ? a.p.id + "_frozen" : "";
                                        b(a.p.selarrrow).each(function (c, d) {
                                            var e = a.rows.namedItem(d);
                                            b(e).removeClass("ui-state-highlight");
                                            b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d))[a.p.useProp ? "prop" : "attr"]("checked", false);
                                            if (g) {
                                                b("#" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g)).removeClass("ui-state-highlight");
                                                b("#jqg_" + b.jgrid.jqID(a.p.id) + "_" + b.jgrid.jqID(d), "#" + b.jgrid.jqID(g))[a.p.useProp ? "prop" : "attr"]("checked", false)
                                            }
                                        });
                                        a.p.selarrrow = []
                                    }
                                    b(a).jqGrid("setSelection", r, true, c)
                                }
                            }
                        }).bind("reloadGrid", function (c, d) {
                            if (a.p.treeGrid === true) a.p.datatype = a.p.treedatatype;
                            d && d.current && a.grid.selectionPreserver(a);
                            if (a.p.datatype == "local") {
                                b(a).jqGrid("resetSelection");
                                a.p.data.length && M()
                            } else if (!a.p.treeGrid) {
                                a.p.selrow = null;
                                if (a.p.multiselect) {
                                    a.p.selarrrow = [];
                                    ca(false)
                                }
                                a.p.savedRow = []
                            }
                            a.p.scroll && W.call(a, true, false);
                            if (d && d.page) {
                                var e = d.page;
                                if (e > a.p.lastpage) e = a.p.lastpage;
                                e < 1 && (e = 1);
                                a.p.page = e;
                                a.grid.bDiv.scrollTop = a.grid.prevRowHeight ? (e - 1) * a.grid.prevRowHeight * a.p.rowNum : 0
                            }
                            if (a.grid.prevRowHeight && a.p.scroll) {
                                delete a.p.lastpage;
                                a.grid.populateVisible()
                            } else a.grid.populate();
                            a.p._inlinenav === true && b(a).jqGrid("showAddEditButtons");
                            return false
                        }).dblclick(function (c) {
                            A = c.target;
                            p = b(A, a.rows).closest("tr.jqgrow");
                            if (b(p).length !== 0) {
                                r = p[0].rowIndex;
                                J = b.jgrid.getCellIndex(A);
                                b(a).triggerHandler("jqGridDblClickRow", [b(p).attr("id"), r, J, c]);
                                b.isFunction(this.p.ondblClickRow) && a.p.ondblClickRow.call(a, b(p).attr("id"), r, J, c)
                            }
                        }).bind("contextmenu", function (c) {
                            A = c.target;
                            p = b(A, a.rows).closest("tr.jqgrow");
                            if (b(p).length !== 0) {
                                a.p.multiselect || b(a).jqGrid("setSelection", p[0].id, true, c);
                                r = p[0].rowIndex;
                                J = b.jgrid.getCellIndex(A);
                                b(a).triggerHandler("jqGridRightClickRow", [b(p).attr("id"), r, J, c]);
                                b.isFunction(this.p.onRightClickRow) && a.p.onRightClickRow.call(a, b(p).attr("id"), r, J, c)
                            }
                        });
                        c.bDiv = document.createElement("div");
                        k && "auto" === ("" + a.p.height).toLowerCase() && (a.p.height = "100%");
                        b(c.bDiv).append(b('<div style="position:relative;' + (k && 8 > b.jgrid.msiever() ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
                            height: a.p.height + (isNaN(a.p.height) ? "" : "px"),
                            width: c.width + "px"
                        }).scroll(c.scrollGrid);
                        b("table:first", c.bDiv).css({
                            width: a.p.tblwidth + "px"
                        });
                        b.support.tbody || 2 == b("tbody", this).length && b("tbody:gt(0)", this).remove();
                        a.p.multikey && (b.jgrid.msie ? b(c.bDiv).bind("selectstart", function () {
                            return false
                        }) : b(c.bDiv).bind("mousedown", function () {
                            return false
                        }));
                        D && b(c.bDiv).hide();
                        c.cDiv = document.createElement("div");
                        var ia = !0 === a.p.hidegrid ? b("<a role='link' href='javascript:void(0)'/>").addClass("ui-jqgrid-titlebar-close HeaderButton").hover(function () {
                            ia.addClass("ui-state-hover")
                        }, function () {
                            ia.removeClass("ui-state-hover")
                        }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl" == g ? "left" : "right", "0px") : "";
                        b(c.cDiv).append(ia).append("<span class='ui-jqgrid-title" + ("rtl" == g ? "-rtl" : "") + "'>" + a.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-widget-header ui-corner-top ui-helper-clearfix");
                        b(c.cDiv).insertBefore(c.hDiv);
                        a.p.toolbar[0] && (c.uDiv = document.createElement("div"), "top" == a.p.toolbar[1] ? b(c.uDiv).insertBefore(c.hDiv) : "bottom" == a.p.toolbar[1] && b(c.uDiv).insertAfter(c.hDiv), "both" == a.p.toolbar[1] ? (c.ubDiv = document.createElement("div"), b(c.uDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id).insertBefore(c.hDiv), b(c.ubDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id).insertAfter(c.hDiv), D && b(c.ubDiv).hide()) : b(c.uDiv).width(c.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id), D && b(c.uDiv).hide());
                        a.p.toppager && (a.p.toppager = b.jgrid.jqID(a.p.id) + "_toppager", c.topDiv = b("<div id='" + a.p.toppager + "'></div>")[0], a.p.toppager = "#" + a.p.toppager, b(c.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(c.width).insertBefore(c.hDiv), ka(a.p.toppager, "_t"));
                        a.p.footerrow && (c.sDiv = b("<div class='ui-jqgrid-sdiv'></div>")[0], d = b("<div class='ui-jqgrid-hbox" + ("rtl" == g ? "-rtl" : "") + "'></div>"), b(c.sDiv).append(d).width(c.width).insertAfter(c.hDiv), b(d).append(S), c.footers = b(".ui-jqgrid-ftable", c.sDiv)[0].rows[0].cells, a.p.rownumbers && (c.footers[0].className = "ui-state-default jqgrid-rownum"), D && b(c.sDiv).hide());
                        d = null;
                        if (a.p.caption) {
                            var qa = a.p.datatype;
                            !0 === a.p.hidegrid && (b(".ui-jqgrid-titlebar-close", c.cDiv).click(function (d) {
                                var e = b.isFunction(a.p.onHeaderClick),
                                    f = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                    g, h = this;
                                if (a.p.toolbar[0] === true) {
                                    a.p.toolbar[1] == "both" && (f = f + (", #" + b(c.ubDiv).attr("id")));
                                    f = f + (", #" + b(c.uDiv).attr("id"))
                                }
                                g = b(f, "#gview_" + b.jgrid.jqID(a.p.id)).length;
                                a.p.gridstate == "visible" ? b(f, "#gbox_" + b.jgrid.jqID(a.p.id)).slideUp("fast", function () {
                                    g--;
                                    if (g === 0) {
                                        b("span", h).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                                        a.p.gridstate = "hidden";
                                        b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).hide();
                                        b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]);
                                        e && (D || a.p.onHeaderClick.call(a, a.p.gridstate, d))
                                    }
                                }) : a.p.gridstate == "hidden" && b(f, "#gbox_" + b.jgrid.jqID(a.p.id)).slideDown("fast", function () {
                                    g--;
                                    if (g === 0) {
                                        b("span", h).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                                        if (D) {
                                            a.p.datatype = qa;
                                            I();
                                            D = false
                                        }
                                        a.p.gridstate = "visible";
                                        b("#gbox_" + b.jgrid.jqID(a.p.id)).hasClass("ui-resizable") && b(".ui-resizable-handle", "#gbox_" + b.jgrid.jqID(a.p.id)).show();
                                        b(a).triggerHandler("jqGridHeaderClick", [a.p.gridstate, d]);
                                        e && (D || a.p.onHeaderClick.call(a, a.p.gridstate, d))
                                    }
                                });
                                return false
                            }), D && (a.p.datatype = "local", b(".ui-jqgrid-titlebar-close", c.cDiv).trigger("click")))
                        } else b(c.cDiv).hide();
                        b(c.hDiv).after(c.bDiv).mousemove(function (a) {
                            if (c.resizing) {
                                c.dragMove(a);
                                return false
                            }
                        });
                        b(".ui-jqgrid-labels", c.hDiv).bind("selectstart", function () {
                            return false
                        });
                        b(document).mouseup(function () {
                            if (c.resizing) {
                                c.dragEnd();
                                return false
                            }
                            return true
                        });
                        a.formatCol = s;
                        a.sortData = la;
                        a.updatepager = function (c, d) {
                            var e, f, g, h, i, j, k, l = "",
                                m = a.p.pager ? "_" + b.jgrid.jqID(a.p.pager.substr(1)) : "",
                                o = a.p.toppager ? "_" + a.p.toppager.substr(1) : "";
                            g = parseInt(a.p.page, 10) - 1;
                            g < 0 && (g = 0);
                            g = g * parseInt(a.p.rowNum, 10);
                            i = g + a.p.reccount;
                            if (a.p.scroll) {
                                e = b("tbody:first > tr:gt(0)", a.grid.bDiv);
                                g = i - e.length;
                                a.p.reccount = e.length;
                                if (f = e.outerHeight() || a.grid.prevRowHeight) {
                                    e = g * f;
                                    f = parseInt(a.p.records, 10) * f;
                                    b(">div:first", a.grid.bDiv).css({
                                        height: f
                                    }).children("div:first").css({
                                        height: e,
                                        display: e ? "" : "none"
                                    })
                                }
                                a.grid.bDiv.scrollLeft = a.grid.hDiv.scrollLeft
                            }
                            l = a.p.pager || "";
                            if (l = l + (a.p.toppager ? l ? "," + a.p.toppager : a.p.toppager : "")) {
                                k = b.jgrid.formatter.integer || {};
                                e = n(a.p.page);
                                f = n(a.p.lastpage);
                                b(".selbox", l)[this.p.useProp ? "prop" : "attr"]("disabled", false);
                                if (a.p.pginput === true) {
                                    b(".ui-pg-input", l).val(a.p.page);
                                    h = a.p.toppager ? "#sp_1" + m + ",#sp_1" + o : "#sp_1" + m;
                                    b(h).html(b.fmatter ? b.fmatter.util.NumberFormat(a.p.lastpage, k) : a.p.lastpage)
                                }
                                if (a.p.viewrecords) if (a.p.reccount === 0) b(".ui-paging-info", l).html(a.p.emptyrecords);
                                else {
                                    h = g + 1;
                                    j = a.p.records;
                                    if (b.fmatter) {
                                        h = b.fmatter.util.NumberFormat(h, k);
                                        i = b.fmatter.util.NumberFormat(i, k);
                                        j = b.fmatter.util.NumberFormat(j, k)
                                    }
                                    b(".ui-paging-info", l).html(b.jgrid.format(a.p.recordtext, h, i, j))
                                }
                                if (a.p.pgbuttons === true) {
                                    e <= 0 && (e = f = 0);
                                    if (e == 1 || e === 0) {
                                        b("#first" + m + ", #prev" + m).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                        a.p.toppager && b("#first_t" + o + ", #prev_t" + o).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                    } else {
                                        b("#first" + m + ", #prev" + m).removeClass("ui-state-disabled");
                                        a.p.toppager && b("#first_t" + o + ", #prev_t" + o).removeClass("ui-state-disabled")
                                    }
                                    if (e == f || e === 0) {
                                        b("#next" + m + ", #last" + m).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                        a.p.toppager && b("#next_t" + o + ", #last_t" + o).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                    } else {
                                        b("#next" + m + ", #last" + m).removeClass("ui-state-disabled");
                                        a.p.toppager && b("#next_t" + o + ", #last_t" + o).removeClass("ui-state-disabled")
                                    }
                                }
                            }
                            c === true && a.p.rownumbers === true && b("td.jqgrid-rownum", a.rows).each(function (a) {
                                b(this).html(g + 1 + a)
                            });
                            d && a.p.jqgdnd && b(a).jqGrid("gridDnD", "updateDnD");
                            b(a).triggerHandler("jqGridGridComplete");
                            b.isFunction(a.p.gridComplete) && a.p.gridComplete.call(a);
                            b(a).triggerHandler("jqGridAfterGridComplete")
                        };
                        a.refreshIndex = M;
                        a.setHeadCheckBox = ca;
                        a.constructTr = X;
                        a.formatter = function (a, b, c, d, e) {
                            return v(a, b, c, d, e)
                        };
                        b.extend(c, {
                            populate: I,
                            emptyRows: W
                        });
                        this.grid = c;
                        a.addXmlData = function (b) {
                            H(b, a.grid.bDiv)
                        };
                        a.addJSONData = function (b) {
                            V(b, a.grid.bDiv)
                        };
                        this.grid.cols = this.rows[0].cells;
                        b(a).triggerHandler("jqGridInitGrid");
                        b.isFunction(a.p.onInitGrid) && a.p.onInitGrid.call(a);
                        I();
                        a.p.hiddengrid = !1
                    }
                }
            }
        })
    };
    b.jgrid.extend({
        getGridParam: function (b) {
            var d = this[0];
            return !d || !d.grid ? void 0 : !b ? d.p : void 0 !== d.p[b] ? d.p[b] : null
        },
        setGridParam: function (f) {
            return this.each(function () {
                this.grid && "object" === typeof f && b.extend(!0, this.p, f)
            })
        },
        getDataIDs: function () {
            var f = [],
                d = 0,
                c, e = 0;
            this.each(function () {
                if ((c = this.rows.length) && 0 < c) for (; d < c; ) b(this.rows[d]).hasClass("jqgrow") && (f[e] = this.rows[d].id, e++), d++
            });
            return f
        },
        setSelection: function (f, d, c) {
            return this.each(function () {
                var e, a, i, h, g, j;
                if (void 0 !== f && (d = !1 === d ? !1 : !0, (a = this.rows.namedItem("" + f)) && a.className && !(-1 < a.className.indexOf("ui-state-disabled")))) (!0 === this.p.scrollrows && (i = this.rows.namedItem(f).rowIndex, 0 <= i && (e = b(this.grid.bDiv)[0].clientHeight, h = b(this.grid.bDiv)[0].scrollTop, g = b(this.rows[i]).position().top, i = this.rows[i].clientHeight, g + i >= e + h ? b(this.grid.bDiv)[0].scrollTop = g - (e + h) + i + h : g < e + h && g < h && (b(this.grid.bDiv)[0].scrollTop = g))), !0 === this.p.frozenColumns && (j = this.p.id + "_frozen"), this.p.multiselect) ? (this.setHeadCheckBox(!1), this.p.selrow = a.id, h = b.inArray(this.p.selrow, this.p.selarrrow), -1 === h ? ("ui-subgrid" !== a.className && b(a).addClass("ui-state-highlight").attr("aria-selected", "true"), e = !0, this.p.selarrrow.push(this.p.selrow)) : ("ui-subgrid" !== a.className && b(a).removeClass("ui-state-highlight").attr("aria-selected", "false"), e = !1, this.p.selarrrow.splice(h, 1), g = this.p.selarrrow[0], this.p.selrow = void 0 === g ? null : g), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(a.id))[this.p.useProp ? "prop" : "attr"]("checked", e), j && (-1 === h ? b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-state-highlight") : b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(this.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j))[this.p.useProp ? "prop" : "attr"]("checked", e)), b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]), this.p.onSelectRow && d && this.p.onSelectRow.call(this, a.id, e, c)) : "ui-subgrid" !== a.className && (this.p.selrow != a.id ? (b(this.rows.namedItem(this.p.selrow)).removeClass("ui-state-highlight").attr({
                    "aria-selected": "false",
                    tabindex: "-1"
                }), b(a).addClass("ui-state-highlight").attr({
                    "aria-selected": "true",
                    tabindex: "0"
                }), j && (b("#" + b.jgrid.jqID(this.p.selrow), "#" + b.jgrid.jqID(j)).removeClass("ui-state-highlight"), b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(j)).addClass("ui-state-highlight")), e = !0) : e = !1, this.p.selrow = a.id, b(this).triggerHandler("jqGridSelectRow", [a.id, e, c]), this.p.onSelectRow && d && this.p.onSelectRow.call(this, a.id, e, c))
            })
        },
        resetSelection: function (f) {
            return this.each(function () {
                var d = this,
                    c, e, a;
                !0 === d.p.frozenColumns && (a = d.p.id + "_frozen");
                if (void 0 !== f) {
                    e = f === d.p.selrow ? d.p.selrow : f;
                    b("#" + b.jgrid.jqID(d.p.id) + " tbody:first tr#" + b.jgrid.jqID(e)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    a && b("#" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight");
                    if (d.p.multiselect) {
                        b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(d.p.id))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                        if (a) b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(e), "#" + b.jgrid.jqID(a))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                        d.setHeadCheckBox(!1)
                    }
                    e = null
                } else d.p.multiselect ? (b(d.p.selarrrow).each(function (e, f) {
                    c = d.rows.namedItem(f);
                    b(c).removeClass("ui-state-highlight").attr("aria-selected", "false");
                    b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(f))[d.p.useProp ? "prop" : "attr"]("checked", !1);
                    a && (b("#" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), b("#jqg_" + b.jgrid.jqID(d.p.id) + "_" + b.jgrid.jqID(f), "#" + b.jgrid.jqID(a))[d.p.useProp ? "prop" : "attr"]("checked", !1))
                }), d.setHeadCheckBox(!1), d.p.selarrrow = []) : d.p.selrow && (b("#" + b.jgrid.jqID(d.p.id) + " tbody:first tr#" + b.jgrid.jqID(d.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false"), a && b("#" + b.jgrid.jqID(d.p.selrow), "#" + b.jgrid.jqID(a)).removeClass("ui-state-highlight"), d.p.selrow = null);
                !0 === d.p.cellEdit && 0 <= parseInt(d.p.iCol, 10) && 0 <= parseInt(d.p.iRow, 10) && (b("td:eq(" + d.p.iCol + ")", d.rows[d.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(d.rows[d.p.iRow]).removeClass("selected-row ui-state-hover"));
                d.p.savedRow = []
            })
        },
        getRowData: function (f) {
            var d = {},
                c, e = !1,
                a, i = 0;
            this.each(function () {
                var h = this,
                    g, j;
                if (void 0 === f) e = !0, c = [], a = h.rows.length;
                else {
                    j = h.rows.namedItem(f);
                    if (!j) return d;
                    a = 2
                }
                for (; i < a; ) e && (j = h.rows[i]), b(j).hasClass("jqgrow") && (b('td[role="gridcell"]', j).each(function (a) {
                    g = h.p.colModel[a].name;
                    if ("cb" !== g && "subgrid" !== g && "rn" !== g) if (!0 === h.p.treeGrid && g == h.p.ExpandColumn) d[g] = b.jgrid.htmlDecode(b("span:first", this).html());
                    else try {
                        d[g] = b.unformat.call(h, this, {
                            rowId: j.id,
                            colModel: h.p.colModel[a]
                        }, a)
                    } catch (c) {
                        d[g] = b.jgrid.htmlDecode(b(this).html())
                    }
                }), e && (c.push(d), d = {})), i++
            });
            return c || d
        },
        delRowData: function (f) {
            var d = !1,
                c, e;
            this.each(function () {
                c = this.rows.namedItem(f);
                if (!c) return !1;
                b(c).remove();
                this.p.records--;
                this.p.reccount--;
                this.updatepager(!0, !1);
                d = !0;
                this.p.multiselect && (e = b.inArray(f, this.p.selarrrow), -1 != e && this.p.selarrrow.splice(e, 1));
                this.p.selrow = this.p.multiselect && 0 < this.p.selarrrow.length ? this.p.selarrrow[this.p.selarrrow.length - 1] : null;
                if ("local" == this.p.datatype) {
                    var a = this.p._index[b.jgrid.stripPref(this.p.idPrefix, f)];
                    void 0 !== a && (this.p.data.splice(a, 1), this.refreshIndex())
                }
                if (!0 === this.p.altRows && d) {
                    var i = this.p.altclass;
                    b(this.rows).each(function (a) {
                        a % 2 == 1 ? b(this).addClass(i) : b(this).removeClass(i)
                    })
                }
            });
            return d
        },
        setRowData: function (f, d, c) {
            var e, a = !0,
                i;
            this.each(function () {
                if (!this.grid) return !1;
                var h = this,
                    g, j, k = typeof c,
                    l = {};
                j = h.rows.namedItem(f);
                if (!j) return !1;
                if (d) try {
                    if (b(this.p.colModel).each(function (a) {
                        e = this.name;
                        void 0 !== d[e] && (l[e] = this.formatter && "string" === typeof this.formatter && "date" == this.formatter ? b.unformat.date.call(h, d[e], this) : d[e], g = h.formatter(f, d[e], a, d, "edit"), i = this.title ? {
                            title: b.jgrid.stripHtml(g)
                        } : {}, !0 === h.p.treeGrid && e == h.p.ExpandColumn ? b("td[role='gridcell']:eq(" + a + ") > span:first", j).html(g).attr(i) : b("td[role='gridcell']:eq(" + a + ")", j).html(g).attr(i))
                    }), "local" == h.p.datatype) {
                        var n = b.jgrid.stripPref(h.p.idPrefix, f),
                            s = h.p._index[n],
                            m;
                        if (h.p.treeGrid) for (m in h.p.treeReader) h.p.treeReader.hasOwnProperty(m) && delete l[h.p.treeReader[m]];
                        void 0 !== s && (h.p.data[s] = b.extend(!0, h.p.data[s], l));
                        l = null
                    }
                } catch (v) {
                    a = !1
                }
                a && ("string" === k ? b(j).addClass(c) : "object" === k && b(j).css(c), b(h).triggerHandler("jqGridAfterGridComplete"))
            });
            return a
        },
        addRowData: function (f, d, c, e) {
            c || (c = "last");
            var a = !1,
                i, h, g, j, k, l, n, s, m = "",
                v, E, T, K, aa, U;
            d && (b.isArray(d) ? (v = !0, c = "last", E = f) : (d = [d], v = !1), this.each(function () {
                var W = d.length;
                k = this.p.rownumbers === true ? 1 : 0;
                g = this.p.multiselect === true ? 1 : 0;
                j = this.p.subGrid === true ? 1 : 0;
                if (!v) if (f !== void 0) f = "" + f;
                else {
                    f = b.jgrid.randId();
                    if (this.p.keyIndex !== false) {
                        E = this.p.colModel[this.p.keyIndex + g + j + k].name;
                        d[0][E] !== void 0 && (f = d[0][E])
                    }
                }
                T = this.p.altclass;
                for (var M = 0, X = "", H = {}, V = b.isFunction(this.p.afterInsertRow) ? true : false; M < W; ) {
                    K = d[M];
                    h = [];
                    if (v) {
                        try {
                            f = K[E];
                            f === void 0 && (f = b.jgrid.randId())
                        } catch (ja) {
                            f = b.jgrid.randId()
                        }
                        X = this.p.altRows === true ? (this.rows.length - 1) % 2 === 0 ? T : "" : ""
                    }
                    U = f;
                    f = this.p.idPrefix + f;
                    if (k) {
                        m = this.formatCol(0, 1, "", null, f, true);
                        h[h.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + m + ">0</td>"
                    }
                    if (g) {
                        s = '<input role="checkbox" type="checkbox" id="jqg_' + this.p.id + "_" + f + '" class="cbox"/>';
                        m = this.formatCol(k, 1, "", null, f, true);
                        h[h.length] = '<td role="gridcell" ' + m + ">" + s + "</td>"
                    }
                    j && (h[h.length] = b(this).jqGrid("addSubGridCell", g + k, 1));
                    for (n = g + j + k; n < this.p.colModel.length; n++) {
                        aa = this.p.colModel[n];
                        i = aa.name;
                        H[i] = K[i];
                        s = this.formatter(f, b.jgrid.getAccessor(K, i), n, K);
                        m = this.formatCol(n, 1, s, K, f, H);
                        h[h.length] = '<td role="gridcell" ' + m + ">" + s + "</td>"
                    }
                    h.unshift(this.constructTr(f, false, X, H, K, false));
                    h[h.length] = "</tr>";
                    if (this.rows.length === 0) b("table:first", this.grid.bDiv).append(h.join(""));
                    else switch (c) {
                        case "last":
                            b(this.rows[this.rows.length - 1]).after(h.join(""));
                            l = this.rows.length - 1;
                            break;
                        case "first":
                            b(this.rows[0]).after(h.join(""));
                            l = 1;
                            break;
                        case "after":
                            (l = this.rows.namedItem(e)) && (b(this.rows[l.rowIndex + 1]).hasClass("ui-subgrid") ? b(this.rows[l.rowIndex + 1]).after(h) : b(l).after(h.join("")));
                            l++;
                            break;
                        case "before":
                            if (l = this.rows.namedItem(e)) {
                                b(l).before(h.join(""));
                                l = l.rowIndex
                            }
                            l--
                    }
                    this.p.subGrid === true && b(this).jqGrid("addSubGrid", g + k, l);
                    this.p.records++;
                    this.p.reccount++;
                    b(this).triggerHandler("jqGridAfterInsertRow", [f, K, K]);
                    V && this.p.afterInsertRow.call(this, f, K, K);
                    M++;
                    if (this.p.datatype == "local") {
                        H[this.p.localReader.id] = U;
                        this.p._index[U] = this.p.data.length;
                        this.p.data.push(H);
                        H = {}
                    }
                }
                this.p.altRows === true && !v && (c == "last" ? (this.rows.length - 1) % 2 == 1 && b(this.rows[this.rows.length - 1]).addClass(T) : b(this.rows).each(function (a) {
                    a % 2 == 1 ? b(this).addClass(T) : b(this).removeClass(T)
                }));
                this.updatepager(true, true);
                a = true
            }));
            return a
        },
        footerData: function (f, d, c) {
            function e(a) {
                for (var b in a) if (a.hasOwnProperty(b)) return !1;
                return !0
            }
            var a, i = !1,
                h = {},
                g;
            void 0 === f && (f = "get");
            "boolean" !== typeof c && (c = !0);
            f = f.toLowerCase();
            this.each(function () {
                var j = this,
                    k;
                if (!j.grid || !j.p.footerrow || "set" == f && e(d)) return !1;
                i = !0;
                b(this.p.colModel).each(function (e) {
                    a = this.name;
                    "set" == f ? void 0 !== d[a] && (k = c ? j.formatter("", d[a], e, d, "edit") : d[a], g = this.title ? {
                        title: b.jgrid.stripHtml(k)
                    } : {}, b("tr.footrow td:eq(" + e + ")", j.grid.sDiv).html(k).attr(g), i = !0) : "get" == f && (h[a] = b("tr.footrow td:eq(" + e + ")", j.grid.sDiv).html())
                })
            });
            return "get" == f ? h : i
        },
        showHideCol: function (f, d) {
            return this.each(function () {
                var c = this,
                    e = !1,
                    a = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                    i;
                if (c.grid) {
                    "string" === typeof f && (f = [f]);
                    d = "none" != d ? "" : "none";
                    var h = "" === d ? !0 : !1,
                        g = c.p.groupHeader && ("object" === typeof c.p.groupHeader || b.isFunction(c.p.groupHeader));
                    g && b(c).jqGrid("destroyGroupHeader", !1);
                    b(this.p.colModel).each(function (g) {
                        if (-1 !== b.inArray(this.name, f) && this.hidden === h) {
                            if (!0 === c.p.frozenColumns && !0 === this.frozen) return !0;
                            b("tr", c.grid.hDiv).each(function () {
                                b(this.cells[g]).css("display", d)
                            });
                            b(c.rows).each(function () {
                                b(this).hasClass("jqgroup") || b(this.cells[g]).css("display", d)
                            });
                            c.p.footerrow && b("tr.footrow td:eq(" + g + ")", c.grid.sDiv).css("display", d);
                            i = parseInt(this.width, 10);
                            c.p.tblwidth = "none" === d ? c.p.tblwidth - (i + a) : c.p.tblwidth + (i + a);
                            this.hidden = !h;
                            e = !0;
                            b(c).triggerHandler("jqGridShowHideCol", [h, this.name, g])
                        }
                    });
                    !0 === e && (!0 === c.p.shrinkToFit && !isNaN(c.p.height) && (c.p.tblwidth += parseInt(c.p.scrollOffset, 10)), b(c).jqGrid("setGridWidth", !0 === c.p.shrinkToFit ? c.p.tblwidth : c.p.width));
                    g && b(c).jqGrid("setGroupHeaders", c.p.groupHeader)
                }
            })
        },
        hideCol: function (f) {
            return this.each(function () {
                b(this).jqGrid("showHideCol", f, "none")
            })
        },
        showCol: function (f) {
            return this.each(function () {
                b(this).jqGrid("showHideCol", f, "")
            })
        },
        remapColumns: function (f, d, c) {
            function e(a) {
                var c;
                c = a.length ? b.makeArray(a) : b.extend({}, a);
                b.each(f, function (b) {
                    a[b] = c[this]
                })
            }
            function a(a, c) {
                b(">tr" + (c || ""), a).each(function () {
                    var a = this,
                        c = b.makeArray(a.cells);
                    b.each(f, function () {
                        var b = c[this];
                        b && a.appendChild(b)
                    })
                })
            }
            var i = this.get(0);
            e(i.p.colModel);
            e(i.p.colNames);
            e(i.grid.headers);
            a(b("thead:first", i.grid.hDiv), c && ":not(.ui-jqgrid-labels)");
            d && a(b("#" + b.jgrid.jqID(i.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
            i.p.footerrow && a(b("tbody:first", i.grid.sDiv));
            i.p.remapColumns && (i.p.remapColumns.length ? e(i.p.remapColumns) : i.p.remapColumns = b.makeArray(f));
            i.p.lastsort = b.inArray(i.p.lastsort, f);
            i.p.treeGrid && (i.p.expColInd = b.inArray(i.p.expColInd, f));
            b(i).triggerHandler("jqGridRemapColumns", [f, d, c])
        },
        setGridWidth: function (f, d) {
            return this.each(function () {
                if (this.grid) {
                    var c = this,
                        e, a = 0,
                        i = b.jgrid.cell_width ? 0 : c.p.cellLayout,
                        h, g = 0,
                        j = !1,
                        k = c.p.scrollOffset,
                        l, n = 0,
                        s = 0,
                        m;
                    "boolean" !== typeof d && (d = c.p.shrinkToFit);
                    if (!isNaN(f)) {
                        f = parseInt(f, 10);
                        c.grid.width = c.p.width = f;
                        b("#gbox_" + b.jgrid.jqID(c.p.id)).css("width", f + "px");
                        b("#gview_" + b.jgrid.jqID(c.p.id)).css("width", f + "px");
                        b(c.grid.bDiv).css("width", f + "px");
                        b(c.grid.hDiv).css("width", f + "px");
                        c.p.pager && b(c.p.pager).css("width", f + "px");
                        c.p.toppager && b(c.p.toppager).css("width", f + "px");
                        !0 === c.p.toolbar[0] && (b(c.grid.uDiv).css("width", f + "px"), "both" == c.p.toolbar[1] && b(c.grid.ubDiv).css("width", f + "px"));
                        c.p.footerrow && b(c.grid.sDiv).css("width", f + "px");
                        !1 === d && !0 === c.p.forceFit && (c.p.forceFit = !1);
                        if (!0 === d) {
                            b.each(c.p.colModel, function () {
                                if (this.hidden === false) {
                                    e = this.widthOrg;
                                    a = a + (e + i);
                                    this.fixed ? n = n + (e + i) : g++;
                                    s++
                                }
                            });
                            if (0 === g) return;
                            c.p.tblwidth = a;
                            l = f - i * g - n;
                            if (!isNaN(c.p.height) && (b(c.grid.bDiv)[0].clientHeight < b(c.grid.bDiv)[0].scrollHeight || 1 === c.rows.length)) j = !0, l -= k;
                            var a = 0,
                                v = 0 < c.grid.cols.length;
                            b.each(c.p.colModel, function (b) {
                                if (this.hidden === false && !this.fixed) {
                                    e = this.widthOrg;
                                    e = Math.round(l * e / (c.p.tblwidth - i * g - n));
                                    if (!(e < 0)) {
                                        this.width = e;
                                        a = a + e;
                                        c.grid.headers[b].width = e;
                                        c.grid.headers[b].el.style.width = e + "px";
                                        if (c.p.footerrow) c.grid.footers[b].style.width = e + "px";
                                        if (v) c.grid.cols[b].style.width = e + "px";
                                        h = b
                                    }
                                }
                            });
                            if (!h) return;
                            m = 0;
                            j ? f - n - (a + i * g) !== k && (m = f - n - (a + i * g) - k) : 1 !== Math.abs(f - n - (a + i * g)) && (m = f - n - (a + i * g));
                            c.p.colModel[h].width += m;
                            c.p.tblwidth = a + m + i * g + n;
                            c.p.tblwidth > f ? (j = c.p.tblwidth - parseInt(f, 10), c.p.tblwidth = f, e = c.p.colModel[h].width -= j) : e = c.p.colModel[h].width;
                            c.grid.headers[h].width = e;
                            c.grid.headers[h].el.style.width = e + "px";
                            v && (c.grid.cols[h].style.width = e + "px");
                            c.p.footerrow && (c.grid.footers[h].style.width = e + "px")
                        }
                        c.p.tblwidth && (b("table:first", c.grid.bDiv).css("width", c.p.tblwidth + "px"), b("table:first", c.grid.hDiv).css("width", c.p.tblwidth + "px"), c.grid.hDiv.scrollLeft = c.grid.bDiv.scrollLeft, c.p.footerrow && b("table:first", c.grid.sDiv).css("width", c.p.tblwidth + "px"))
                    }
                }
            })
        },
        setGridHeight: function (f) {
            return this.each(function () {
                if (this.grid) {
                    var d = b(this.grid.bDiv);
                    d.css({
                        height: f + (isNaN(f) ? "" : "px")
                    });
                    !0 === this.p.frozenColumns && b("#" + b.jgrid.jqID(this.p.id) + "_frozen").parent().height(d.height() - 16);
                    this.p.height = f;
                    this.p.scroll && this.grid.populateVisible()
                }
            })
        },
        setCaption: function (f) {
            return this.each(function () {
                this.p.caption = f;
                b("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(f);
                b(this.grid.cDiv).show()
            })
        },
        setLabel: function (f, d, c, e) {
            return this.each(function () {
                var a = -1;
                if (this.grid && void 0 !== f && (b(this.p.colModel).each(function (b) {
                    if (this.name == f) return a = b, !1
                }), 0 <= a)) {
                    var i = b("tr.ui-jqgrid-labels th:eq(" + a + ")", this.grid.hDiv);
                    if (d) {
                        var h = b(".s-ico", i);
                        b("[id^=jqgh_]", i).empty().html(d).append(h);
                        this.p.colNames[a] = d
                    }
                    c && ("string" === typeof c ? b(i).addClass(c) : b(i).css(c));
                    "object" === typeof e && b(i).attr(e)
                }
            })
        },
        setCell: function (f, d, c, e, a, i) {
            return this.each(function () {
                var h = -1,
                    g, j;
                if (this.grid && (isNaN(d) ? b(this.p.colModel).each(function (a) {
                    if (this.name == d) return h = a, !1
                }) : h = parseInt(d, 10), 0 <= h && (g = this.rows.namedItem(f)))) {
                    var k = b("td:eq(" + h + ")", g);
                    if ("" !== c || !0 === i) g = this.formatter(f, c, h, g, "edit"), j = this.p.colModel[h].title ? {
                        title: b.jgrid.stripHtml(g)
                    } : {}, this.p.treeGrid && 0 < b(".tree-wrap", b(k)).length ? b("span", b(k)).html(g).attr(j) : b(k).html(g).attr(j), "local" == this.p.datatype && (g = this.p.colModel[h], c = g.formatter && "string" === typeof g.formatter && "date" == g.formatter ? b.unformat.date.call(this, c, g) : c, j = this.p._index[f], void 0 !== j && (this.p.data[j][g.name] = c));
                    "string" === typeof e ? b(k).addClass(e) : e && b(k).css(e);
                    "object" === typeof a && b(k).attr(a)
                }
            })
        },
        getCell: function (f, d) {
            var c = !1;
            this.each(function () {
                var e = -1;
                if (this.grid && (isNaN(d) ? b(this.p.colModel).each(function (a) {
                    if (this.name === d) return e = a, !1
                }) : e = parseInt(d, 10), 0 <= e)) {
                    var a = this.rows.namedItem(f);
                    if (a) try {
                        c = b.unformat.call(this, b("td:eq(" + e + ")", a), {
                            rowId: a.id,
                            colModel: this.p.colModel[e]
                        }, e)
                    } catch (i) {
                        c = b.jgrid.htmlDecode(b("td:eq(" + e + ")", a).html())
                    }
                }
            });
            return c
        },
        getCol: function (f, d, c) {
            var e = [],
                a, i = 0,
                h, g, j, d = "boolean" !== typeof d ? !1 : d;
            void 0 === c && (c = !1);
            this.each(function () {
                var k = -1;
                if (this.grid && (isNaN(f) ? b(this.p.colModel).each(function (a) {
                    if (this.name === f) return k = a, !1
                }) : k = parseInt(f, 10), 0 <= k)) {
                    var l = this.rows.length,
                        n = 0;
                    if (l && 0 < l) {
                        for (; n < l; ) {
                            if (b(this.rows[n]).hasClass("jqgrow")) {
                                try {
                                    a = b.unformat.call(this, b(this.rows[n].cells[k]), {
                                        rowId: this.rows[n].id,
                                        colModel: this.p.colModel[k]
                                    }, k)
                                } catch (s) {
                                    a = b.jgrid.htmlDecode(this.rows[n].cells[k].innerHTML)
                                }
                                c ? (j = parseFloat(a), i += j, void 0 === g && (g = h = j), h = Math.min(h, j), g = Math.max(g, j)) : d ? e.push({
                                    id: this.rows[n].id,
                                    value: a
                                }) : e.push(a)
                            }
                            n++
                        }
                        if (c) switch (c.toLowerCase()) {
                            case "sum":
                                e = i;
                                break;
                            case "avg":
                                e = i / l;
                                break;
                            case "count":
                                e = l;
                                break;
                            case "min":
                                e = h;
                                break;
                            case "max":
                                e = g
                        }
                    }
                }
            });
            return e
        },
        clearGridData: function (f) {
            return this.each(function () {
                if (this.grid) {
                    "boolean" !== typeof f && (f = !1);
                    if (this.p.deepempty) b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:gt(0)").remove();
                    else {
                        var d = b("#" + b.jgrid.jqID(this.p.id) + " tbody:first tr:first")[0];
                        b("#" + b.jgrid.jqID(this.p.id) + " tbody:first").empty().append(d)
                    }
                    this.p.footerrow && f && b(".ui-jqgrid-ftable td", this.grid.sDiv).html("&#160;");
                    this.p.selrow = null;
                    this.p.selarrrow = [];
                    this.p.savedRow = [];
                    this.p.records = 0;
                    this.p.page = 1;
                    this.p.lastpage = 0;
                    this.p.reccount = 0;
                    this.p.data = [];
                    this.p._index = {};
                    this.updatepager(!0, !1)
                }
            })
        },
        getInd: function (b, d) {
            var c = !1,
                e;
            this.each(function () {
                (e = this.rows.namedItem(b)) && (c = !0 === d ? e : e.rowIndex)
            });
            return c
        },
        bindKeys: function (f) {
            var d = b.extend({
                onEnter: null,
                onSpace: null,
                onLeftKey: null,
                onRightKey: null,
                scrollingRows: !0
            }, f || {});
            return this.each(function () {
                var c = this;
                b("body").is("[role]") || b("body").attr("role", "application");
                c.p.scrollrows = d.scrollingRows;
                b(c).keydown(function (e) {
                    var a = b(c).find("tr[tabindex=0]")[0],
                        f, h, g, j = c.p.treeReader.expanded_field;
                    if (a) if (g = c.p._index[a.id], 37 === e.keyCode || 38 === e.keyCode || 39 === e.keyCode || 40 === e.keyCode) {
                        if (38 === e.keyCode) {
                            h = a.previousSibling;
                            f = "";
                            if (h) if (b(h).is(":hidden")) for (; h; ) {
                                if (h = h.previousSibling, !b(h).is(":hidden") && b(h).hasClass("jqgrow")) {
                                    f = h.id;
                                    break
                                }
                            } else f = h.id;
                            b(c).jqGrid("setSelection", f, !0, e);
                            e.preventDefault()
                        }
                        if (40 === e.keyCode) {
                            h = a.nextSibling;
                            f = "";
                            if (h) if (b(h).is(":hidden")) for (; h; ) {
                                if (h = h.nextSibling, !b(h).is(":hidden") && b(h).hasClass("jqgrow")) {
                                    f = h.id;
                                    break
                                }
                            } else f = h.id;
                            b(c).jqGrid("setSelection", f, !0, e);
                            e.preventDefault()
                        }
                        37 === e.keyCode && (c.p.treeGrid && c.p.data[g][j] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyLeft", [c.p.selrow]), b.isFunction(d.onLeftKey) && d.onLeftKey.call(c, c.p.selrow));
                        39 === e.keyCode && (c.p.treeGrid && !c.p.data[g][j] && b(a).find("div.treeclick").trigger("click"), b(c).triggerHandler("jqGridKeyRight", [c.p.selrow]), b.isFunction(d.onRightKey) && d.onRightKey.call(c, c.p.selrow))
                    } else 13 === e.keyCode ? (b(c).triggerHandler("jqGridKeyEnter", [c.p.selrow]), b.isFunction(d.onEnter) && d.onEnter.call(c, c.p.selrow)) : 32 === e.keyCode && (b(c).triggerHandler("jqGridKeySpace", [c.p.selrow]), b.isFunction(d.onSpace) && d.onSpace.call(c, c.p.selrow))
                })
            })
        },
        unbindKeys: function () {
            return this.each(function () {
                b(this).unbind("keydown")
            })
        },
        getLocalRow: function (b) {
            var d = !1,
                c;
            this.each(function () {
                void 0 !== b && (c = this.p._index[b], 0 <= c && (d = this.p.data[c]))
            });
            return d
        }
    })
})(jQuery);
(function (a) {
    a.fmatter = {};
    a.extend(a.fmatter, {
        isBoolean: function (a) {
            return "boolean" === typeof a
        },
        isObject: function (c) {
            return c && ("object" === typeof c || a.isFunction(c)) || !1
        },
        isString: function (a) {
            return "string" === typeof a
        },
        isNumber: function (a) {
            return "number" === typeof a && isFinite(a)
        },
        isNull: function (a) {
            return null === a
        },
        isUndefined: function (a) {
            return void 0 === a
        },
        isValue: function (a) {
            return this.isObject(a) || this.isString(a) || this.isNumber(a) || this.isBoolean(a)
        },
        isEmpty: function (c) {
            if (!this.isString(c) && this.isValue(c)) return !1;
            if (!this.isValue(c)) return !0;
            c = a.trim(c).replace(/\&nbsp\;/ig, "").replace(/\&#160\;/ig, "");
            return "" === c
        }
    });
    a.fn.fmatter = function (c, b, d, e, f) {
        var h = b,
            d = a.extend({}, a.jgrid.formatter, d);
        try {
            h = a.fn.fmatter[c].call(this, b, d, e, f)
        } catch (g) { }
        return h
    };
    a.fmatter.util = {
        NumberFormat: function (c, b) {
            a.fmatter.isNumber(c) || (c *= 1);
            if (a.fmatter.isNumber(c)) {
                var d = 0 > c,
                    e = "" + c,
                    f = b.decimalSeparator || ".",
                    h;
                if (a.fmatter.isNumber(b.decimalPlaces)) {
                    var g = b.decimalPlaces,
                        e = Math.pow(10, g),
                        e = "" + Math.round(c * e) / e;
                    h = e.lastIndexOf(".");
                    if (0 < g) {
                        0 > h ? (e += f, h = e.length - 1) : "." !== f && (e = e.replace(".", f));
                        for (; e.length - 1 - h < g; ) e += "0"
                    }
                }
                if (b.thousandsSeparator) {
                    g = b.thousandsSeparator;
                    h = e.lastIndexOf(f);
                    h = -1 < h ? h : e.length;
                    var f = e.substring(h),
                        i = -1,
                        j;
                    for (j = h; 0 < j; j--) {
                        i++;
                        if (0 === i % 3 && j !== h && (!d || 1 < j)) f = g + f;
                        f = e.charAt(j - 1) + f
                    }
                    e = f
                }
                e = b.prefix ? b.prefix + e : e;
                return e = b.suffix ? e + b.suffix : e
            }
            return c
        },
        DateFormat: function (c, b, d, e) {
            var f = /^\/Date\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\)\/$/,
                h = "string" === typeof b ? b.match(f) : null,
                f = function (a, b) {
                    a = "" + a;
                    for (b = parseInt(b, 10) || 2; a.length < b; ) a = "0" + a;
                    return a
                },
                g = {
                    m: 1,
                    d: 1,
                    y: 1970,
                    h: 0,
                    i: 0,
                    s: 0,
                    u: 0
                },
                i = 0,
                j, k = ["i18n"];
            k.i18n = {
                dayNames: e.dayNames,
                monthNames: e.monthNames
            };
            e.masks.hasOwnProperty(c) && (c = e.masks[c]);
            if (!isNaN(b - 0) && "u" == ("" + c).toLowerCase()) i = new Date(1E3 * parseFloat(b));
            else if (b.constructor === Date) i = b;
            else if (null !== h) i = new Date(parseInt(h[1], 10)), h[3] && (c = 60 * Number(h[5]) + Number(h[6]), c *= "-" == h[4] ? 1 : -1, c -= i.getTimezoneOffset(), i.setTime(Number(Number(i) + 6E4 * c)));
            else {
                b = ("" + b).split(/[\\\/:_;.,\t\T\s-]/);
                c = c.split(/[\\\/:_;.,\t\T\s-]/);
                h = 0;
                for (j = c.length; h < j; h++) "M" == c[h] && (i = a.inArray(b[h], k.i18n.monthNames), -1 !== i && 12 > i && (b[h] = i + 1)), "F" == c[h] && (i = a.inArray(b[h], k.i18n.monthNames), -1 !== i && 11 < i && (b[h] = i + 1 - 12)), b[h] && (g[c[h].toLowerCase()] = parseInt(b[h], 10));
                g.f && (g.m = g.f);
                if (0 === g.m && 0 === g.y && 0 === g.d) return "&#160;";
                g.m = parseInt(g.m, 10) - 1;
                i = g.y;
                70 <= i && 99 >= i ? g.y = 1900 + g.y : 0 <= i && 69 >= i && (g.y = 2E3 + g.y);
                i = new Date(g.y, g.m, g.d, g.h, g.i, g.s, g.u)
            }
            e.masks.hasOwnProperty(d) ? d = e.masks[d] : d || (d = "Y-m-d");
            c = i.getHours();
            b = i.getMinutes();
            g = i.getDate();
            h = i.getMonth() + 1;
            j = i.getTimezoneOffset();
            var l = i.getSeconds(),
                r = i.getMilliseconds(),
                n = i.getDay(),
                m = i.getFullYear(),
                o = (n + 6) % 7 + 1,
                p = (new Date(m, h - 1, g) - new Date(m, 0, 1)) / 864E5,
                q = {
                    d: f(g),
                    D: k.i18n.dayNames[n],
                    j: g,
                    l: k.i18n.dayNames[n + 7],
                    N: o,
                    S: e.S(g),
                    w: n,
                    z: p,
                    W: 5 > o ? Math.floor((p + o - 1) / 7) + 1 : Math.floor((p + o - 1) / 7) || (4 > ((new Date(m - 1, 0, 1)).getDay() + 6) % 7 ? 53 : 52),
                    F: k.i18n.monthNames[h - 1 + 12],
                    m: f(h),
                    M: k.i18n.monthNames[h - 1],
                    n: h,
                    t: "?",
                    L: "?",
                    o: "?",
                    Y: m,
                    y: ("" + m).substring(2),
                    a: 12 > c ? e.AmPm[0] : e.AmPm[1],
                    A: 12 > c ? e.AmPm[2] : e.AmPm[3],
                    B: "?",
                    g: c % 12 || 12,
                    G: c,
                    h: f(c % 12 || 12),
                    H: f(c),
                    i: f(b),
                    s: f(l),
                    u: r,
                    e: "?",
                    I: "?",
                    O: (0 < j ? "-" : "+") + f(100 * Math.floor(Math.abs(j) / 60) + Math.abs(j) % 60, 4),
                    P: "?",
                    T: (("" + i).match(/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g) || [""]).pop().replace(/[^-+\dA-Z]/g, ""),
                    Z: "?",
                    c: "?",
                    r: "?",
                    U: Math.floor(i / 1E3)
                };
            return d.replace(/\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g, function (a) {
                return q.hasOwnProperty(a) ? q[a] : a.substring(1)
            })
        }
    };
    a.fn.fmatter.defaultFormat = function (c, b) {
        return a.fmatter.isValue(c) && "" !== c ? c : b.defaultValue || "&#160;"
    };
    a.fn.fmatter.email = function (c, b) {
        return !a.fmatter.isEmpty(c) ? '<a href="mailto:' + c + '">' + c + "</a>" : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.checkbox = function (c, b) {
        var d = a.extend({}, b.checkbox),
            e;
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        e = !0 === d.disabled ? 'disabled="disabled"' : "";
        if (a.fmatter.isEmpty(c) || a.fmatter.isUndefined(c)) c = a.fn.fmatter.defaultFormat(c, d);
        c = ("" + c).toLowerCase();
        return '<input type="checkbox" ' + (0 > c.search(/(false|0|no|n|off)/i) ? " checked='checked' " : "") + ' value="' + c + '" offval="no" ' + e + "/>"
    };
    a.fn.fmatter.link = function (c, b) {
        var d = {
            target: b.target
        },
            e = "";
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        return !a.fmatter.isEmpty(c) ? "<a " + e + ' href="' + c + '">' + c + "</a>" : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.showlink = function (c, b) {
        var d = {
            baseLinkUrl: b.baseLinkUrl,
            showAction: b.showAction,
            addParam: b.addParam || "",
            target: b.target,
            idName: b.idName
        },
            e = "";
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        d.target && (e = "target=" + d.target);
        d = d.baseLinkUrl + d.showAction + "?" + d.idName + "=" + b.rowId + d.addParam;
        return a.fmatter.isString(c) || a.fmatter.isNumber(c) ? "<a " + e + ' href="' + d + '">' + c + "</a>" : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.integer = function (c, b) {
        var d = a.extend({}, b.integer);
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.number = function (c, b) {
        var d = a.extend({}, b.number);
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.currency = function (c, b) {
        var d = a.extend({}, b.currency);
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        return a.fmatter.isEmpty(c) ? d.defaultValue : a.fmatter.util.NumberFormat(c, d)
    };
    a.fn.fmatter.date = function (c, b, d, e) {
        d = a.extend({}, b.date);
        void 0 !== b.colModel && !a.fmatter.isUndefined(b.colModel.formatoptions) && (d = a.extend({}, d, b.colModel.formatoptions));
        return !d.reformatAfterEdit && "edit" == e ? a.fn.fmatter.defaultFormat(c, b) : !a.fmatter.isEmpty(c) ? a.fmatter.util.DateFormat(d.srcformat, c, d.newformat, d) : a.fn.fmatter.defaultFormat(c, b)
    };
    a.fn.fmatter.select = function (c, b) {
        var c = "" + c,
            d = !1,
            e = [],
            f, h;
        a.fmatter.isUndefined(b.colModel.formatoptions) ? a.fmatter.isUndefined(b.colModel.editoptions) || (d = b.colModel.editoptions.value, f = void 0 === b.colModel.editoptions.separator ? ":" : b.colModel.editoptions.separator, h = void 0 === b.colModel.editoptions.delimiter ? ";" : b.colModel.editoptions.delimiter) : (d = b.colModel.formatoptions.value, f = void 0 === b.colModel.formatoptions.separator ? ":" : b.colModel.formatoptions.separator, h = void 0 === b.colModel.formatoptions.delimiter ? ";" : b.colModel.formatoptions.delimiter);
        if (d) {
            var g = !0 === b.colModel.editoptions.multiple ? !0 : !1,
                i = [];
            g && (i = c.split(","), i = a.map(i, function (b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(d)) {
                var j = d.split(h),
                    k = 0,
                    l;
                for (l = 0; l < j.length; l++) if (h = j[l].split(f), 2 < h.length && (h[1] = a.map(h, function (a, b) {
                    if (b > 0) return a
                }).join(f)), g)-1 < a.inArray(h[0], i) && (e[k] = h[1], k++);
                else if (a.trim(h[0]) == a.trim(c)) {
                    e[0] = h[1];
                    break
                }
            } else a.fmatter.isObject(d) && (g ? e = a.map(i, function (a) {
                return d[a]
            }) : e[0] = d[c] || "")
        }
        c = e.join(", ");
        return "" === c ? a.fn.fmatter.defaultFormat(c, b) : c
    };
    a.fn.fmatter.rowactions = function (c) {
        var b = a(this).closest("tr.jqgrow"),
            d = a(this).parent(),
            e = b.attr("id"),
            f = a(this).closest("table.ui-jqgrid-btable"),
            h = f[0],
            g = h.p,
            i = g.colModel[a.jgrid.getCellIndex(this)],
            j = {
                keys: !1,
                onEdit: null,
                onSuccess: null,
                afterSave: null,
                onError: null,
                afterRestore: null,
                extraparam: {},
                url: null,
                restoreAfterError: !0,
                mtype: "POST",
                delOptions: {},
                editOptions: {}
            },
            k = function (b) {
                a.isFunction(j.afterRestore) && j.afterRestore.call(h, b);
                d.find("div.ui-inline-edit,div.ui-inline-del").show();
                d.find("div.ui-inline-save,div.ui-inline-cancel").hide()
            };
        a.fmatter.isUndefined(i.formatoptions) || (j = a.extend(j, i.formatoptions));
        a.fmatter.isUndefined(g.editOptions) || (j.editOptions = g.editOptions);
        a.fmatter.isUndefined(g.delOptions) || (j.delOptions = g.delOptions);
        b.hasClass("jqgrid-new-row") && (j.extraparam[g.prmNames.oper] = g.prmNames.addoper);
        b = {
            keys: j.keys,
            oneditfunc: j.onEdit,
            successfunc: j.onSuccess,
            url: j.url,
            extraparam: j.extraparam,
            aftersavefunc: function (b, c) {
                a.isFunction(j.afterSave) && j.afterSave.call(h, b, c);
                d.find("div.ui-inline-edit,div.ui-inline-del").show();
                d.find("div.ui-inline-save,div.ui-inline-cancel").hide()
            },
            errorfunc: j.onError,
            afterrestorefunc: k,
            restoreAfterError: j.restoreAfterError,
            mtype: j.mtype
        };
        switch (c) {
            case "edit":
                f.jqGrid("editRow", e, b);
                d.find("div.ui-inline-edit,div.ui-inline-del").hide();
                d.find("div.ui-inline-save,div.ui-inline-cancel").show();
                f.triggerHandler("jqGridAfterGridComplete");
                break;
            case "save":
                f.jqGrid("saveRow", e, b) && (d.find("div.ui-inline-edit,div.ui-inline-del").show(), d.find("div.ui-inline-save,div.ui-inline-cancel").hide(), f.triggerHandler("jqGridAfterGridComplete"));
                break;
            case "cancel":
                f.jqGrid("restoreRow", e, k);
                d.find("div.ui-inline-edit,div.ui-inline-del").show();
                d.find("div.ui-inline-save,div.ui-inline-cancel").hide();
                f.triggerHandler("jqGridAfterGridComplete");
                break;
            case "del":
                f.jqGrid("delGridRow", e, j.delOptions);
                break;
            case "formedit":
                f.jqGrid("setSelection", e), f.jqGrid("editGridRow", e, j.editOptions)
        }
    };
    a.fn.fmatter.actions = function (c, b) {
        var d = {
            keys: !1,
            editbutton: !0,
            delbutton: !0,
            editformbutton: !1
        },
            e = b.rowId,
            f = "";
        a.fmatter.isUndefined(b.colModel.formatoptions) || (d = a.extend(d, b.colModel.formatoptions));
        if (void 0 === e || a.fmatter.isEmpty(e)) return "";
        d.editformbutton ? f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon ui-icon-pencil'></span></div>" : d.editbutton && (f += "<div title='" + a.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ><span class='ui-icon ui-icon-pencil'></span></div>");
        d.delbutton && (f += "<div title='" + a.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon ui-icon-trash'></span></div>");
        f += "<div title='" + a.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon ui-icon-disk'></span></div>";
        f += "<div title='" + a.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ><span class='ui-icon ui-icon-cancel'></span></div>";
        return "<div style='margin-left:8px;'>" + f + "</div>"
    };
    a.unformat = function (c, b, d, e) {
        var f, h = b.colModel.formatter,
            g = b.colModel.formatoptions || {},
            i = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
            j = b.colModel.unformat || a.fn.fmatter[h] && a.fn.fmatter[h].unformat;
        if (void 0 !== j && a.isFunction(j)) f = j.call(this, a(c).text(), b, c);
        else if (!a.fmatter.isUndefined(h) && a.fmatter.isString(h)) switch (f = a.jgrid.formatter || {}, h) {
            case "integer":
                g = a.extend({}, f.integer, g);
                b = g.thousandsSeparator.replace(i, "\\$1");
                f = a(c).text().replace(RegExp(b, "g"), "");
                break;
            case "number":
                g = a.extend({}, f.number, g);
                b = g.thousandsSeparator.replace(i, "\\$1");
                f = a(c).text().replace(RegExp(b, "g"), "").replace(g.decimalSeparator, ".");
                break;
            case "currency":
                g = a.extend({}, f.currency, g);
                b = g.thousandsSeparator.replace(i, "\\$1");
                b = RegExp(b, "g");
                f = a(c).text();
                g.prefix && g.prefix.length && (f = f.substr(g.prefix.length));
                g.suffix && g.suffix.length && (f = f.substr(0, f.length - g.suffix.length));
                f = f.replace(b, "").replace(g.decimalSeparator, ".");
                break;
            case "checkbox":
                g = b.colModel.editoptions ? b.colModel.editoptions.value.split(":") : ["Yes", "No"];
                f = a("input", c).is(":checked") ? g[0] : g[1];
                break;
            case "select":
                f = a.unformat.select(c, b, d, e);
                break;
            case "actions":
                return "";
            default:
                f = a(c).text()
        }
        return void 0 !== f ? f : !0 === e ? a(c).text() : a.jgrid.htmlDecode(a(c).html())
    };
    a.unformat.select = function (c, b, d, e) {
        d = [];
        c = a(c).text();
        if (!0 === e) return c;
        var e = a.extend({}, !a.fmatter.isUndefined(b.colModel.formatoptions) ? b.colModel.formatoptions : b.colModel.editoptions),
            b = void 0 === e.separator ? ":" : e.separator,
            f = void 0 === e.delimiter ? ";" : e.delimiter;
        if (e.value) {
            var h = e.value,
                e = !0 === e.multiple ? !0 : !1,
                g = [];
            e && (g = c.split(","), g = a.map(g, function (b) {
                return a.trim(b)
            }));
            if (a.fmatter.isString(h)) {
                var i = h.split(f),
                    j = 0,
                    k;
                for (k = 0; k < i.length; k++) if (f = i[k].split(b), 2 < f.length && (f[1] = a.map(f, function (a, b) {
                    if (b > 0) return a
                }).join(b)), e)-1 < a.inArray(f[1], g) && (d[j] = f[0], j++);
                else if (a.trim(f[1]) == a.trim(c)) {
                    d[0] = f[0];
                    break
                }
            } else if (a.fmatter.isObject(h) || a.isArray(h)) e || (g[0] = c), d = a.map(g, function (b) {
                var c;
                a.each(h, function (a, d) {
                    if (d == b) {
                        c = a;
                        return false
                    }
                });
                if (c !== void 0) return c
            });
            return d.join(", ")
        }
        return c || ""
    };
    a.unformat.date = function (c, b) {
        var d = a.jgrid.formatter.date || {};
        a.fmatter.isUndefined(b.formatoptions) || (d = a.extend({}, d, b.formatoptions));
        return !a.fmatter.isEmpty(c) ? a.fmatter.util.DateFormat(d.newformat, c, d.srcformat, d) : a.fn.fmatter.defaultFormat(c, b)
    }
})(jQuery);
(function (a) {
    a.jgrid.extend({
        getColProp: function (a) {
            var c = {},
                d = this[0];
            if (!d.grid) return !1;
            var d = d.p.colModel,
                g;
            for (g = 0; g < d.length; g++) if (d[g].name == a) {
                c = d[g];
                break
            }
            return c
        },
        setColProp: function (b, c) {
            return this.each(function () {
                if (this.grid && c) {
                    var d = this.p.colModel,
                        g;
                    for (g = 0; g < d.length; g++) if (d[g].name == b) {
                        a.extend(!0, this.p.colModel[g], c);
                        break
                    }
                }
            })
        },
        sortGrid: function (a, c, d) {
            return this.each(function () {
                var g = -1,
                    f;
                if (this.grid) {
                    a || (a = this.p.sortname);
                    for (f = 0; f < this.p.colModel.length; f++) if (this.p.colModel[f].index == a || this.p.colModel[f].name == a) {
                        g = f;
                        break
                    } -1 != g && (f = this.p.colModel[g].sortable, "boolean" !== typeof f && (f = !0), "boolean" !== typeof c && (c = !1), f && this.sortData("jqgh_" + this.p.id + "_" + a, g, c, d))
                }
            })
        },
        clearBeforeUnload: function () {
            return this.each(function () {
                var b = this.grid;
                b.emptyRows.call(this, !0, !0);
                a(b.hDiv).unbind("mousemove");
                a(this).unbind();
                b.dragEnd = null;
                b.dragMove = null;
                b.dragStart = null;
                b.emptyRows = null;
                b.populate = null;
                b.populateVisible = null;
                b.scrollGrid = null;
                b.selectionPreserver = null;
                b.bDiv = null;
                b.cDiv = null;
                b.hDiv = null;
                b.cols = null;
                var c, d = b.headers.length;
                for (c = 0; c < d; c++) b.headers[c].el = null;
                this.addJSONData = this.addXmlData = this.formatter = this.constructTr = this.setHeadCheckBox = this.refreshIndex = this.updatepager = this.sortData = this.formatCol = null
            })
        },
        GridDestroy: function () {
            return this.each(function () {
                if (this.grid) {
                    this.p.pager && a(this.p.pager).remove();
                    try {
                        a(this).jqGrid("clearBeforeUnload"), a("#gbox_" + a.jgrid.jqID(this.id)).remove()
                    } catch (b) { }
                }
            })
        },
        GridUnload: function () {
            return this.each(function () {
                if (this.grid) {
                    var b = a(this).attr("id"),
                        c = a(this).attr("class");
                    this.p.pager && a(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager corner-bottom");
                    var d = document.createElement("table");
                    a(d).attr({
                        id: b
                    });
                    d.className = c;
                    b = a.jgrid.jqID(this.id);
                    a(d).removeClass("ui-jqgrid-btable");
                    1 === a(this.p.pager).parents("#gbox_" + b).length ? (a(d).insertBefore("#gbox_" + b).show(), a(this.p.pager).insertBefore("#gbox_" + b)) : a(d).insertBefore("#gbox_" + b).show();
                    a(this).jqGrid("clearBeforeUnload");
                    a("#gbox_" + b).remove()
                }
            })
        },
        setGridState: function (b) {
            return this.each(function () {
                this.grid && ("hidden" == b ? (a(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), this.p.pager && a(this.p.pager).slideUp("fast"), this.p.toppager && a(this.p.toppager).slideUp("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideUp("fast"), a(this.grid.uDiv).slideUp("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideUp("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s"), this.p.gridstate = "hidden") : "visible" == b && (a(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), this.p.pager && a(this.p.pager).slideDown("fast"), this.p.toppager && a(this.p.toppager).slideDown("fast"), !0 === this.p.toolbar[0] && ("both" == this.p.toolbar[1] && a(this.grid.ubDiv).slideDown("fast"), a(this.grid.uDiv).slideDown("fast")), this.p.footerrow && a(".ui-jqgrid-sdiv", "#gbox_" + a.jgrid.jqID(this.p.id)).slideDown("fast"), a(".ui-jqgrid-titlebar-close span", this.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n"), this.p.gridstate = "visible"))
            })
        },
        filterToolbar: function (b) {
            b = a.extend({
                autosearch: !0,
                searchOnEnter: !0,
                beforeSearch: null,
                afterSearch: null,
                beforeClear: null,
                afterClear: null,
                searchurl: "",
                stringResult: !1,
                groupOp: "AND",
                defaultSearch: "bw"
            }, b || {});
            return this.each(function () {
                var c = this;
                if (!this.ftoolbar) {
                    var d = function () {
                        var e = {},
                                d = 0,
                                f, h, l = {},
                                k;
                        a.each(c.p.colModel, function () {
                            h = this.index || this.name;
                            k = this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "select" == this.stype ? "eq" : b.defaultSearch;
                            if (f = a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val()) e[h] = f, l[h] = k, d++;
                            else try {
                                delete c.p.postData[h]
                            } catch (i) { }
                        });
                        var g = 0 < d ? !0 : !1;
                        if (!0 === b.stringResult || "local" == c.p.datatype) {
                            var i = '{"groupOp":"' + b.groupOp + '","rules":[',
                                    n = 0;
                            a.each(e, function (a, b) {
                                0 < n && (i += ",");
                                i += '{"field":"' + a + '",';
                                i += '"op":"' + l[a] + '",';
                                i += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                n++
                            });
                            i += "]}";
                            a.extend(c.p.postData, {
                                filters: i
                            });
                            a.each(["searchField", "searchString", "searchOper"], function (a, b) {
                                c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                            })
                        } else a.extend(c.p.postData, e);
                        var o;
                        c.p.searchurl && (o = c.p.url, a(c).jqGrid("setGridParam", {
                            url: c.p.searchurl
                        }));
                        var q = "stop" === a(c).triggerHandler("jqGridToolbarBeforeSearch") ? !0 : !1;
                        !q && a.isFunction(b.beforeSearch) && (q = b.beforeSearch.call(c));
                        q || a(c).jqGrid("setGridParam", {
                            search: g
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        o && a(c).jqGrid("setGridParam", {
                            url: o
                        });
                        a(c).triggerHandler("jqGridToolbarAfterSearch");
                        a.isFunction(b.afterSearch) && b.afterSearch.call(c)
                    },
                        g = a("<tr class='ui-search-toolbar' role='rowheader'></tr>"),
                        f;
                    a.each(c.p.colModel, function () {
                        var e = this,
                            j, m, h, l;
                        m = a("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + c.p.direction + "'></th>");
                        j = a("<div style='position:relative;height:100%;padding-right:0.3em;'></div>");
                        !0 === this.hidden && a(m).css("display", "none");
                        this.search = !1 === this.search ? !1 : !0;
                        void 0 === this.stype && (this.stype = "text");
                        h = a.extend({}, this.searchoptions || {});
                        if (this.search) switch (this.stype) {
                            case "select":
                                if (l = this.surl || h.dataUrl) a.ajax(a.extend({
                                    url: l,
                                    dataType: "html",
                                    success: function (f) {
                                        if (h.buildSelect !== void 0) (f = h.buildSelect(f)) && a(j).append(f);
                                        else a(j).append(f);
                                        h.defaultValue !== void 0 && a("select", j).val(h.defaultValue);
                                        a("select", j).attr({
                                            name: e.index || e.name,
                                            id: "gs_" + e.name
                                        });
                                        h.attr && a("select", j).attr(h.attr);
                                        a("select", j).css({
                                            width: "100%"
                                        });
                                        a.jgrid.bindEv(a("select", j)[0], h, c);
                                        b.autosearch === true && a("select", j).change(function () {
                                            d();
                                            return false
                                        });
                                        f = null
                                    }
                                }, a.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                                else {
                                    var k, p, i;
                                    e.searchoptions ? (k = void 0 === e.searchoptions.value ? "" : e.searchoptions.value, p = void 0 === e.searchoptions.separator ? ":" : e.searchoptions.separator, i = void 0 === e.searchoptions.delimiter ? ";" : e.searchoptions.delimiter) : e.editoptions && (k = void 0 === e.editoptions.value ? "" : e.editoptions.value, p = void 0 === e.editoptions.separator ? ":" : e.editoptions.separator, i = void 0 === e.editoptions.delimiter ? ";" : e.editoptions.delimiter);
                                    if (k) {
                                        l = document.createElement("select");
                                        l.style.width = "100%";
                                        a(l).attr({
                                            name: e.index || e.name,
                                            id: "gs_" + e.name
                                        });
                                        var n, o;
                                        if ("string" === typeof k) {
                                            k = k.split(i);
                                            for (o = 0; o < k.length; o++) n = k[o].split(p), i = document.createElement("option"), i.value = n[0], i.innerHTML = n[1], l.appendChild(i)
                                        } else if ("object" === typeof k) for (n in k) k.hasOwnProperty(n) && (i = document.createElement("option"), i.value = n, i.innerHTML = k[n], l.appendChild(i));
                                        void 0 !== h.defaultValue && a(l).val(h.defaultValue);
                                        h.attr && a(l).attr(h.attr);
                                        a.jgrid.bindEv(l, h, c);
                                        a(j).append(l);
                                        !0 === b.autosearch && a(l).change(function () {
                                            d();
                                            return false
                                        })
                                    }
                                }
                                break;
                            case "text":
                                p = void 0 !== h.defaultValue ? h.defaultValue : "", a(j).append("<input type='text' style='width:95%;padding:0px;' name='" + (e.index || e.name) + "' id='gs_" + e.name + "' value='" + p + "' class='" + e.classes + "'/>"), h.attr && a("input", j).attr(h.attr), a.jgrid.bindEv(a("input", j)[0], h, c), !0 === b.autosearch && (b.searchOnEnter ? a("input", j).keypress(function (a) {
                                    if ((a.charCode || a.keyCode || 0) == 13) {
                                        d();
                                        return false
                                    }
                                    return this
                                }) : a("input", j).keydown(function (a) {
                                //mathan
                                var hasError = false;
//                                if (String.fromCharCode(a.keyCode) != '' && a.keyCode <= 32 && a.keyCode != 38 && a.keyCode != 39 && a.keyCode != 40 && a.keyCode != 8 && a.keyCode != 46 && a.keyCode != 9) {
//                                    hasError = PreventSqlInjection(String.fromCharCode(a.keyCode) );
//                                }
                                if (String.fromCharCode(a.keyCode) != '') {
                                    hasError = false; //PreventSqlInjection(String.fromCharCode(a.keyCode) ); 
                                }
                                if (hasError)
                                {
                                    alert('This word is not allowed for search. Please try with some other word');
                                    return false;
                                }
                                    //
                                    switch (a.which) {
                                        case 13:
                                            return false;
                                        case 9:
                                        case 16:
                                        case 37:
                                        case 38:
                                        case 39:
                                        case 40:
                                        case 27:
                                            break;
                                        default:
                                            f && clearTimeout(f);
                                            f = setTimeout(function () {
                                                d()
                                            }, 500)
                                    }
                                    //

                                }))
                        }
                        a(m).append(j);
                        a(g).append(m)
                    });
                    a("table thead", c.grid.hDiv).append(g);
                    this.ftoolbar = !0;
                    this.triggerToolbar = d;
                    this.clearToolbar = function (e) {
                        var d = {},
                            f = 0,
                            h, e = "boolean" !== typeof e ? !0 : e;
                        a.each(c.p.colModel, function () {
                            var b;
                            this.searchoptions && void 0 !== this.searchoptions.defaultValue && (b = this.searchoptions.defaultValue);
                            h = this.index || this.name;
                            switch (this.stype) {
                                case "select":
                                    a("#gs_" + a.jgrid.jqID(this.name) + " option", !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).each(function (c) {
                                        if (c === 0) this.selected = true;
                                        if (a(this).val() == b) {
                                            this.selected = true;
                                            return false
                                        }
                                    });
                                    if (void 0 !== b) d[h] = b, f++;
                                    else try {
                                        delete c.p.postData[h]
                                    } catch (e) { }
                                    break;
                                case "text":
                                    if (a("#gs_" + a.jgrid.jqID(this.name), !0 === this.frozen && !0 === c.p.frozenColumns ? c.grid.fhDiv : c.grid.hDiv).val(b), void 0 !== b) d[h] = b, f++;
                                    else try {
                                        delete c.p.postData[h]
                                    } catch (k) { }
                            }
                        });
                        var g = 0 < f ? !0 : !1;
                        if (!0 === b.stringResult || "local" == c.p.datatype) {
                            var k = '{"groupOp":"' + b.groupOp + '","rules":[',
                                p = 0;
                            a.each(d, function (a, b) {
                                0 < p && (k += ",");
                                k += '{"field":"' + a + '",';
                                k += '"op":"eq",';
                                k += '"data":"' + (b + "").replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                p++
                            });
                            k += "]}";
                            a.extend(c.p.postData, {
                                filters: k
                            });
                            a.each(["searchField", "searchString", "searchOper"], function (a, b) {
                                c.p.postData.hasOwnProperty(b) && delete c.p.postData[b]
                            })
                        } else a.extend(c.p.postData, d);
                        var i;
                        c.p.searchurl && (i = c.p.url, a(c).jqGrid("setGridParam", {
                            url: c.p.searchurl
                        }));
                        var n = "stop" === a(c).triggerHandler("jqGridToolbarBeforeClear") ? !0 : !1;
                        !n && a.isFunction(b.beforeClear) && (n = b.beforeClear.call(c));
                        n || e && a(c).jqGrid("setGridParam", {
                            search: g
                        }).trigger("reloadGrid", [{
                            page: 1
                        }]);
                        i && a(c).jqGrid("setGridParam", {
                            url: i
                        });
                        a(c).triggerHandler("jqGridToolbarAfterClear");
                        a.isFunction(b.afterClear) && b.afterClear()
                    };
                    this.toggleToolbar = function () {
                        var b = a("tr.ui-search-toolbar", c.grid.hDiv),
                            d = !0 === c.p.frozenColumns ? a("tr.ui-search-toolbar", c.grid.fhDiv) : !1;
                        "none" == b.css("display") ? (b.show(), d && d.show()) : (b.hide(), d && d.hide())

                        //modified - mathan
//                        $('#'+c.id+'_frozen').css('display','none');
//                        $('.ui-jqgrid-htable')[1].style.display = 'none';
                        $('#'+c.id+'_frozen').toggle();
                        $('.frozen-div .ui-jqgrid-htable').toggle();
                    }
                }
            })
        },
        destroyFilterToolbar: function () {
            return this.each(function () {
                this.ftoolbar && (this.toggleToolbar = this.clearToolbar = this.triggerToolbar = null, this.ftoolbar = !1, a(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove())
            })
        },
        destroyGroupHeader: function (b) {
            void 0 === b && (b = !0);
            return this.each(function () {
                var c, d, g, f, e, j;
                d = this.grid;
                var m = a("table.ui-jqgrid-htable thead", d.hDiv),
                    h = this.p.colModel;
                if (d) {
                    a(this).unbind(".setGroupHeaders");
                    c = a("<tr>", {
                        role: "rowheader"
                    }).addClass("ui-jqgrid-labels");
                    f = d.headers;
                    d = 0;
                    for (g = f.length; d < g; d++) {
                        e = h[d].hidden ? "none" : "";
                        e = a(f[d].el).width(f[d].width).css("display", e);
                        try {
                            e.removeAttr("rowSpan")
                        } catch (l) {
                            e.attr("rowSpan", 1)
                        }
                        c.append(e);
                        j = e.children("span.ui-jqgrid-resize");
                        0 < j.length && (j[0].style.height = "");
                        e.children("div")[0].style.top = ""
                    }
                    a(m).children("tr.ui-jqgrid-labels").remove();
                    a(m).prepend(c);
                    !0 === b && a(this).jqGrid("setGridParam", {
                        groupHeader: null
                    })
                }
            })
        },
        setGroupHeaders: function (b) {
            b = a.extend({
                useColSpanStyle: !1,
                groupHeaders: []
            }, b || {});
            return this.each(function () {
                this.p.groupHeader = b;
                var c, d, g = 0,
                    f, e, j, m, h, l = this.p.colModel,
                    k = l.length,
                    p = this.grid.headers,
                    i = a("table.ui-jqgrid-htable", this.grid.hDiv),
                    n = i.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header");
                f = i.children("thead");
                var o = i.find(".jqg-first-row-header");
                void 0 === o[0] ? o = a("<tr>", {
                    role: "row",
                    "aria-hidden": "true"
                }).addClass("jqg-first-row-header").css("height", "auto") : o.empty();
                var q, r = function (a, b) {
                    var c = b.length,
                            d;
                    for (d = 0; d < c; d++) if (b[d].startColumnName === a) return d;
                    return -1
                };
                a(this).prepend(f);
                f = a("<tr>", {
                    role: "rowheader"
                }).addClass("ui-jqgrid-labels jqg-third-row-header");
                for (c = 0; c < k; c++) if (j = p[c].el, m = a(j), d = l[c], e = {
                    height: "0px",
                    width: p[c].width + "px",
                    display: d.hidden ? "none" : ""
                }, a("<th>", {
                    role: "gridcell"
                }).css(e).addClass("ui-first-th-" + this.p.direction).appendTo(o), j.style.width = "", e = r(d.name, b.groupHeaders), 0 <= e) {
                    e = b.groupHeaders[e];
                    g = e.numberOfColumns;
                    h = e.titleText;
                    for (e = d = 0; e < g && c + e < k; e++) l[c + e].hidden || d++;
                    e = a("<th>").attr({
                        role: "columnheader"
                    }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                        height: "22px",
                        "border-top": "0px none"
                    }).html(h);
                    0 < d && e.attr("colspan", "" + d);
                    this.p.headertitles && e.attr("title", e.text());
                    0 === d && e.hide();
                    m.before(e);
                    f.append(j);
                    g -= 1
                } else 0 === g ? b.useColSpanStyle ? m.attr("rowspan", "2") : (a("<th>", {
                    role: "columnheader"
                }).addClass("ui-state-default ui-th-column-header ui-th-" + this.p.direction).css({
                    display: d.hidden ? "none" : "",
                    "border-top": "0px none"
                }).insertBefore(m), f.append(j)) : (f.append(j), g--);
                l = a(this).children("thead");
                l.prepend(o);
                f.insertAfter(n);
                i.append(l);
                b.useColSpanStyle && (i.find("span.ui-jqgrid-resize").each(function () {
                    var b = a(this).parent();
                    b.is(":visible") && (this.style.cssText = "height: " + b.height() + "px !important; cursor: col-resize;")
                }), i.find("div.ui-jqgrid-sortable").each(function () {
                    var b = a(this),
                        c = b.parent();
                    c.is(":visible") && c.is(":has(span.ui-jqgrid-resize)") && b.css("top", (c.height() - b.outerHeight()) / 2 + "px")
                }));
                q = l.find("tr.jqg-first-row-header");
                a(this).bind("jqGridResizeStop.setGroupHeaders", function (a, b, c) {
                    q.find("th").eq(c).width(b)
                })
            })
        },
        setFrozenColumns: function () {
            return this.each(function () {
                if (this.grid) {
                    var b = this,
                        c = b.p.colModel,
                        d = 0,
                        g = c.length,
                        f = -1,
                        e = !1;
                    if (!(!0 === b.p.subGrid || !0 === b.p.treeGrid || !0 === b.p.cellEdit || b.p.sortable || b.p.scroll || b.p.grouping)) {
                        b.p.rownumbers && d++;
                        for (b.p.multiselect && d++; d < g; ) {
                            if (!0 === c[d].frozen) e = !0, f = d;
                            else break;
                            d++
                        }
                        if (0 <= f && e) {
                            c = b.p.caption ? a(b.grid.cDiv).outerHeight() : 0;
                            d = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).height();
                            b.p.toppager && (c += a(b.grid.topDiv).outerHeight());
                            !0 === b.p.toolbar[0] && "bottom" != b.p.toolbar[1] && (c += a(b.grid.uDiv).outerHeight());
                            b.grid.fhDiv = a('<div style="position:absolute;left:0px;top:' + c + "px;height:" + d + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                            b.grid.fbDiv = a('<div style="position:absolute;left:0px;top:' + (parseInt(c, 10) + parseInt(d, 10) + 1) + 'px;overflow-y:hidden;overflow-x:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                            a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fhDiv);
                            c = a(".ui-jqgrid-htable", "#gview_" + a.jgrid.jqID(b.p.id)).clone(!0);
                            if (b.p.groupHeader) {
                                a("tr.jqg-first-row-header, tr.jqg-third-row-header", c).each(function () {
                                    a("th:gt(" + f + ")", this).remove()
                                });
                                var j = -1,
                                    m = -1;
                                a("tr.jqg-second-row-header th", c).each(function () {
                                    var b = parseInt(a(this).attr("colspan"), 10);
                                    b && (j += b, m++);
                                    if (j === f) return !1
                                });
                                j !== f && (m = f);
                                a("tr.jqg-second-row-header", c).each(function () {
                                    a("th:gt(" + m + ")", this).remove()
                                })
                            } else a("tr", c).each(function () {
                                a("th:gt(" + f + ")", this).remove()
                            });
                            a(c).width(1);
                            a(b.grid.fhDiv).append(c).mousemove(function (a) {
                                if (b.grid.resizing) return b.grid.dragMove(a), !1
                            });
                            a(b).bind("jqGridResizeStop.setFrozenColumns", function (c, d, e) {
                                c = a(".ui-jqgrid-htable", b.grid.fhDiv);
                                a("th:eq(" + e + ")", c).width(d);
                                c = a(".ui-jqgrid-btable", b.grid.fbDiv);
                                a("tr:first td:eq(" + e + ")", c).width(d)
                            });
                            a(b).bind("jqGridOnSortCol.setFrozenColumns", function (c, d) {
                                var e = a("tr.ui-jqgrid-labels:last th:eq(" + b.p.lastsort + ")", b.grid.fhDiv),
                                    f = a("tr.ui-jqgrid-labels:last th:eq(" + d + ")", b.grid.fhDiv);
                                a("span.ui-grid-ico-sort", e).addClass("ui-state-disabled");
                                a(e).attr("aria-selected", "false");
                                a("span.ui-icon-" + b.p.sortorder, f).removeClass("ui-state-disabled");
                                a(f).attr("aria-selected", "true");
                                !b.p.viewsortcols[0] && b.p.lastsort != d && (a("span.s-ico", e).hide(), a("span.s-ico", f).show())
                            });
                            a("#gview_" + a.jgrid.jqID(b.p.id)).append(b.grid.fbDiv);
                            a(b.grid.bDiv).scroll(function () {
                                a(b.grid.fbDiv).scrollTop(a(this).scrollTop())
                            });
                            !0 === b.p.hoverrows && a("#" + a.jgrid.jqID(b.p.id)).unbind("mouseover").unbind("mouseout");
                            a(b).bind("jqGridAfterGridComplete.setFrozenColumns", function () {
                                a("#" + a.jgrid.jqID(b.p.id) + "_frozen").remove();
                                a(b.grid.fbDiv).height(a(b.grid.bDiv).height() - 16);
                                var c = a("#" + a.jgrid.jqID(b.p.id)).clone(!0);
                                a("tr", c).each(function () {
                                    a("td:gt(" + f + ")", this).remove()
                                });
                                a(c).width(1).attr("id", b.p.id + "_frozen");
                                a(b.grid.fbDiv).append(c);
                                !0 === b.p.hoverrows && (a("tr.jqgrow", c).hover(function () {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).addClass("ui-state-hover")
                                }, function () {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id)).removeClass("ui-state-hover")
                                }), a("tr.jqgrow", "#" + a.jgrid.jqID(b.p.id)).hover(function () {
                                    a(this).addClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").addClass("ui-state-hover")
                                }, function () {
                                    a(this).removeClass("ui-state-hover");
                                    a("#" + a.jgrid.jqID(this.id), "#" + a.jgrid.jqID(b.p.id) + "_frozen").removeClass("ui-state-hover")
                                }));
                                c = null
                            });
                            b.p.frozenColumns = !0
                        }
                    }
                }
            })
        },
        destroyFrozenColumns: function () {
            return this.each(function () {
                if (this.grid && !0 === this.p.frozenColumns) {
                    a(this.grid.fhDiv).remove();
                    a(this.grid.fbDiv).remove();
                    this.grid.fhDiv = null;
                    this.grid.fbDiv = null;
                    a(this).unbind(".setFrozenColumns");
                    if (!0 === this.p.hoverrows) {
                        var b;
                        a("#" + a.jgrid.jqID(this.p.id)).bind("mouseover", function (c) {
                            b = a(c.target).closest("tr.jqgrow");
                            "ui-subgrid" !== a(b).attr("class") && a(b).addClass("ui-state-hover")
                        }).bind("mouseout", function (c) {
                            b = a(c.target).closest("tr.jqgrow");
                            a(b).removeClass("ui-state-hover")
                        })
                    }
                    this.p.frozenColumns = !1
                }
            })
        }
    })
})(jQuery);
(function (a) {
    a.extend(a.jgrid, {
        showModal: function (a) {
            a.w.show()
        },
        closeModal: function (a) {
            a.w.hide().attr("aria-hidden", "true");
            a.o && a.o.remove()
        },
        hideModal: function (d, b) {
            b = a.extend({
                jqm: !0,
                gb: ""
            }, b || {});
            if (b.onClose) {
                var c = b.gb && "string" === typeof b.gb && "#gbox_" === b.gb.substr(0, 6) ? b.onClose.call(a("#" + b.gb.substr(6))[0], d) : b.onClose(d);
                if ("boolean" === typeof c && !c) return
            }
            if (a.fn.jqm && !0 === b.jqm) a(d).attr("aria-hidden", "true").jqmHide();
            else {
                if ("" !== b.gb) try {
                    a(".jqgrid-overlay:first", b.gb).hide()
                } catch (e) { }
                a(d).hide().attr("aria-hidden", "true")
            }
        },
        findPos: function (a) {
            var b = 0,
                c = 0;
            if (a.offsetParent) {
                do b += a.offsetLeft, c += a.offsetTop;
                while (a = a.offsetParent)
            }
            return [b, c]
        },
        createModal: function (d, b, c, e, g, h, f) {
            var c = a.extend(!0, {}, a.jgrid.jqModal || {}, c),
                i = document.createElement("div"),
                j, n = this,
                f = a.extend({}, f || {});
            j = "rtl" == a(c.gbox).attr("dir") ? !0 : !1;
            i.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
            i.id = d.themodal;
            var k = document.createElement("div");
            k.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
            k.id = d.modalhead;
            a(k).append("<span class='ui-jqdialog-title'>" + c.caption + "</span>");
            var l = a("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function () {
                l.addClass("ui-state-hover")
            }, function () {
                l.removeClass("ui-state-hover")
            }).append("<span class='ui-icon ui-icon-closethick'></span>");
            a(k).append(l);
            j ? (i.dir = "rtl", a(".ui-jqdialog-title", k).css("float", "right"), a(".ui-jqdialog-titlebar-close", k).css("left", "0.3em")) : (i.dir = "ltr", a(".ui-jqdialog-title", k).css("float", "left"), a(".ui-jqdialog-titlebar-close", k).css("right", "0.3em"));
            var m = document.createElement("div");
            a(m).addClass("ui-jqdialog-content ui-widget-content").attr("id", d.modalcontent);
            a(m).append(b);
            i.appendChild(m);
            a(i).prepend(k);
            !0 === h ? a("body").append(i) : "string" === typeof h ? a(h).append(i) : a(i).insertBefore(e);
            a(i).css(f);
            void 0 === c.jqModal && (c.jqModal = !0);
            b = {};
            if (a.fn.jqm && !0 === c.jqModal) 0 === c.left && 0 === c.top && c.overlay && (f = [], f = a.jgrid.findPos(g), c.left = f[0] + 4, c.top = f[1] + 4), b.top = c.top + "px", b.left = c.left;
            else if (0 !== c.left || 0 !== c.top) b.left = c.left, b.top = c.top + "px";
            a("a.ui-jqdialog-titlebar-close", k).click(function () {
                var b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose,
                    e = a("#" + a.jgrid.jqID(d.themodal)).data("gbox") || c.gbox;
                n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                    gb: e,
                    jqm: c.jqModal,
                    onClose: b
                });
                return false
            });
            if (0 === c.width || !c.width) c.width = 300;
            if (0 === c.height || !c.height) c.height = 200;
            c.zIndex || (e = a(e).parents("*[role=dialog]").filter(":first").css("z-index"), c.zIndex = e ? parseInt(e, 10) + 2 : 950);
            e = 0;
            j && b.left && !h && (e = a(c.gbox).width() - (!isNaN(c.width) ? parseInt(c.width, 10) : 0) - 8, b.left = parseInt(b.left, 10) + parseInt(e, 10));
            b.left && (b.left += "px");
            a(i).css(a.extend({
                width: isNaN(c.width) ? "auto" : c.width + "px",
                height: isNaN(c.height) ? "auto" : c.height + "px",
                zIndex: c.zIndex,
                overflow: "hidden"
            }, b)).attr({
                tabIndex: "-1",
                role: "dialog",
                "aria-labelledby": d.modalhead,
                "aria-hidden": "true"
            });
            void 0 === c.drag && (c.drag = !0);
            void 0 === c.resize && (c.resize = !0);
            if (c.drag) if (a(k).css("cursor", "move"), a.fn.jqDrag) a(i).jqDrag(k);
            else try {
                a(i).draggable({
                    handle: a("#" + a.jgrid.jqID(k.id))
                })
            } catch (o) { }
            if (c.resize) if (a.fn.jqResize) a(i).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>"), a("#" + a.jgrid.jqID(d.themodal)).jqResize(".jqResize", d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1);
            else try {
                a(i).resizable({
                    handles: "se, sw",
                    alsoResize: d.scrollelm ? "#" + a.jgrid.jqID(d.scrollelm) : !1
                })
            } catch (p) { } !0 === c.closeOnEscape && a(i).keydown(function (b) {
                if (b.which == 27) {
                    b = a("#" + a.jgrid.jqID(d.themodal)).data("onClose") || c.onClose;
                    n.hideModal("#" + a.jgrid.jqID(d.themodal), {
                        gb: c.gbox,
                        jqm: c.jqModal,
                        onClose: b
                    })
                }
            })
        },
        viewModal: function (d, b) {
            b = a.extend({
                toTop: !0,
                overlay: 10,
                modal: !1,
                overlayClass: "ui-widget-overlay",
                onShow: a.jgrid.showModal,
                onHide: a.jgrid.closeModal,
                gbox: "",
                jqm: !0,
                jqM: !0
            }, b || {});
            if (a.fn.jqm && !0 === b.jqm) b.jqM ? a(d).attr("aria-hidden", "false").jqm(b).jqmShow() : a(d).attr("aria-hidden", "false").jqmShow();
            else {
                "" !== b.gbox && (a(".jqgrid-overlay:first", b.gbox).show(), a(d).data("gbox", b.gbox));
                a(d).show().attr("aria-hidden", "false");
                try {
                    a(":input:visible", d)[0].focus()
                } catch (c) { }
            }
        },
        info_dialog: function (d, b, c, e) {
            var g = {
                width: 290,
                height: "auto",
                dataheight: "auto",
                drag: !0,
                resize: !1,
                left: 250,
                top: 170,
                zIndex: 1E3,
                jqModal: !0,
                modal: !1,
                closeOnEscape: !0,
                align: "center",
                buttonalign: "center",
                buttons: []
            };
            a.extend(!0, g, a.jgrid.jqModal || {}, {
                caption: "<b>" + d + "</b>"
            }, e || {});
            var h = g.jqModal,
                f = this;
            a.fn.jqm && !h && (h = !1);
            d = "";
            if (0 < g.buttons.length) for (e = 0; e < g.buttons.length; e++) void 0 === g.buttons[e].id && (g.buttons[e].id = "info_button_" + e), d += "<a href='javascript:void(0)' id='" + g.buttons[e].id + "' class='fm-button ui-state-default ui-corner-all'>" + g.buttons[e].text + "</a>";
            e = isNaN(g.dataheight) ? g.dataheight : g.dataheight + "px";
            b = "<div id='info_id'>" + ("<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + e + ";" + ("text-align:" + g.align + ";") + "'>" + b + "</div>");
            b += c ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + c + "</a>" + d + "</div>" : "" !== d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + g.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>" : "";
            b += "</div>";
            try {
                "false" == a("#info_dialog").attr("aria-hidden") && a.jgrid.hideModal("#info_dialog", {
                    jqm: h
                }), a("#info_dialog").remove()
            } catch (i) { }
            a.jgrid.createModal({
                themodal: "info_dialog",
                modalhead: "info_head",
                modalcontent: "info_content",
                scrollelm: "infocnt"
            }, b, g, "", "", !0);
            d && a.each(g.buttons, function (d) {
                a("#" + a.jgrid.jqID(this.id), "#info_id").bind("click", function () {
                    g.buttons[d].onClick.call(a("#info_dialog"));
                    return !1
                })
            });
            a("#closedialog", "#info_id").click(function () {
                f.hideModal("#info_dialog", {
                    jqm: h
                });
                return !1
            });
            a(".fm-button", "#info_dialog").hover(function () {
                a(this).addClass("ui-state-hover")
            }, function () {
                a(this).removeClass("ui-state-hover")
            });
            a.isFunction(g.beforeOpen) && g.beforeOpen();
            a.jgrid.viewModal("#info_dialog", {
                onHide: function (a) {
                    a.w.hide().remove();
                    a.o && a.o.remove()
                },
                modal: g.modal,
                jqm: h
            });
            a.isFunction(g.afterOpen) && g.afterOpen();
            try {
                a("#info_dialog").focus()
            } catch (j) { }
        },
        bindEv: function (d, b, c) {
            a.isFunction(b.dataInit) && b.dataInit.call(c, d);
            b.dataEvents && a.each(b.dataEvents, function () {
                void 0 !== this.data ? a(d).bind(this.type, this.data, this.fn) : a(d).bind(this.type, this.fn)
            })
        },
        createEl: function (d, b, c, e, g) {
            function h(d, b, c) {
                var e = "dataInit,dataEvents,dataUrl,buildSelect,sopt,searchhidden,defaultValue,attr,custom_element,custom_value".split(",");
                void 0 !== c && a.isArray(c) && a.merge(e, c);
                a.each(b, function (b, c) {
-1 === a.inArray(b, e) && a(d).attr(b, c)
                });
                b.hasOwnProperty("id") || a(d).attr("id", a.jgrid.randId())
            }
            var f = "",
                i = this;
            switch (d) {
                case "textarea":
                    f = document.createElement("textarea");
                    e ? b.cols || a(f).css({
                        width: "98%"
                    }) : b.cols || (b.cols = 20);
                    b.rows || (b.rows = 2);
                    if ("&nbsp;" == c || "&#160;" == c || 1 == c.length && 160 == c.charCodeAt(0)) c = "";
                    f.value = c;
                    h(f, b);
                    a(f).attr({
                        role: "textbox",
                        multiline: "true"
                    });
                    break;
                case "checkbox":
                    f = document.createElement("input");
                    f.type = "checkbox";
                    b.value ? (d = b.value.split(":"), c === d[0] && (f.checked = !0, f.defaultChecked = !0), f.value = d[0], a(f).attr("offval", d[1])) : (d = c.toLowerCase(), 0 > d.search(/(false|0|no|off|undefined)/i) && "" !== d ? (f.checked = !0, f.defaultChecked = !0, f.value = c) : f.value = "on", a(f).attr("offval", "off"));
                    h(f, b, ["value"]);
                    a(f).attr("role", "checkbox");
                    break;
                case "select":
                    f = document.createElement("select");
                    f.setAttribute("role", "select");
                    e = [];
                    !0 === b.multiple ? (d = !0, f.multiple = "multiple", a(f).attr("aria-multiselectable", "true")) : d = !1;
                    if (void 0 !== b.dataUrl) d = b.name ? ("" + b.id).substring(0, ("" + b.id).length - ("" + b.name).length - 1) : "" + b.id, e = b.postData || g.postData, i.p && i.p.idPrefix ? d = a.jgrid.stripPref(i.p.idPrefix, d) : e = void 0, a.ajax(a.extend({
                        url: b.dataUrl,
                        type: "GET",
                        dataType: "html",
                        data: a.isFunction(e) ? e.call(i, d, c, "" + b.name) : e,
                        context: {
                            elem: f,
                            options: b,
                            vl: c
                        },
                        success: function (b) {
                            var d = [],
                            c = this.elem,
                            e = this.vl,
                            f = a.extend({}, this.options),
                            g = f.multiple === true;
                            a.isFunction(f.buildSelect) && (b = f.buildSelect.call(i, b));
                            if (b = a(b).html()) {
                                a(c).append(b);
                                h(c, f);
                                if (f.size === void 0) f.size = g ? 3 : 1;
                                if (g) {
                                    d = e.split(",");
                                    d = a.map(d, function (d) {
                                        return a.trim(d)
                                    })
                                } else d[0] = a.trim(e);
                                setTimeout(function () {
                                    a("option", c).each(function (b) {
                                        if (b === 0 && c.multiple) this.selected = false;
                                        a(this).attr("role", "option");
                                        if (a.inArray(a.trim(a(this).text()), d) > -1 || a.inArray(a.trim(a(this).val()), d) > -1) this.selected = "selected"
                                    })
                                }, 0)
                            }
                        }
                    }, g || {}));
                    else if (b.value) {
                        var j;
                        void 0 === b.size && (b.size = d ? 3 : 1);
                        d && (e = c.split(","), e = a.map(e, function (d) {
                            return a.trim(d)
                        }));
                        "function" === typeof b.value && (b.value = b.value());
                        var n, k, l = void 0 === b.separator ? ":" : b.separator,
                        g = void 0 === b.delimiter ? ";" : b.delimiter;
                        if ("string" === typeof b.value) {
                            n = b.value.split(g);
                            for (j = 0; j < n.length; j++) {
                                k = n[j].split(l);
                                2 < k.length && (k[1] = a.map(k, function (a, d) {
                                    if (d > 0) return a
                                }).join(l));
                                g = document.createElement("option");
                                g.setAttribute("role", "option");
                                g.value = k[0];
                                g.innerHTML = k[1];
                                f.appendChild(g);
                                if (!d && (a.trim(k[0]) == a.trim(c) || a.trim(k[1]) == a.trim(c))) g.selected = "selected";
                                if (d && (-1 < a.inArray(a.trim(k[1]), e) || -1 < a.inArray(a.trim(k[0]), e))) g.selected = "selected"
                            }
                        } else if ("object" === typeof b.value) for (j in l = b.value, l) if (l.hasOwnProperty(j)) {
                            g = document.createElement("option");
                            g.setAttribute("role", "option");
                            g.value = j;
                            g.innerHTML = l[j];
                            f.appendChild(g);
                            if (!d && (a.trim(j) == a.trim(c) || a.trim(l[j]) == a.trim(c))) g.selected = "selected";
                            if (d && (-1 < a.inArray(a.trim(l[j]), e) || -1 < a.inArray(a.trim(j), e))) g.selected = "selected"
                        }
                        h(f, b, ["value"])
                    }
                    break;
                case "text":
                case "password":
                case "button":
                    j = "button" == d ? "button" : "textbox";
                    f = document.createElement("input");
                    f.type = d;
                    f.value = c;
                    h(f, b);
                    "button" != d && (e ? b.size || a(f).css({
                        width: "98%"
                    }) : b.size || (b.size = 20));
                    a(f).attr("role", j);
                    break;
                case "image":
                case "file":
                    f = document.createElement("input");
                    f.type = d;
                    h(f, b);
                    break;
                case "custom":
                    f = document.createElement("span");
                    try {
                        if (a.isFunction(b.custom_element)) if (l = b.custom_element.call(i, c, b)) l = a(l).addClass("customelement").attr({
                            id: b.id,
                            name: b.name
                        }), a(f).empty().append(l);
                        else throw "e2";
                        else throw "e1";
                    } catch (m) {
                        "e1" == m && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" == m ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_element' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, "string" === typeof m ? m : m.message, a.jgrid.edit.bClose)
                    }
            }
            return f
        },
        checkDate: function (a, b) {
            var c = {},
                e, a = a.toLowerCase();
            e = -1 != a.indexOf("/") ? "/" : -1 != a.indexOf("-") ? "-" : -1 != a.indexOf(".") ? "." : "/";
            a = a.split(e);
            b = b.split(e);
            if (3 != b.length) return !1;
            e = -1;
            var g, h = -1,
                f = -1,
                i;
            for (i = 0; i < a.length; i++) g = isNaN(b[i]) ? 0 : parseInt(b[i], 10), c[a[i]] = g, g = a[i], -1 != g.indexOf("y") && (e = i), -1 != g.indexOf("m") && (f = i), -1 != g.indexOf("d") && (h = i);
            g = "y" == a[e] || "yyyy" == a[e] ? 4 : "yy" == a[e] ? 2 : -1;
            i = function (a) {
                var b;
                for (b = 1; b <= a; b++) {
                    this[b] = 31;
                    if (4 == b || 6 == b || 9 == b || 11 == b) this[b] = 30;
                    2 == b && (this[b] = 29)
                }
                return this
            } (12);
            var j;
            if (-1 === e) return !1;
            j = c[a[e]].toString();
            2 == g && 1 == j.length && (g = 1);
            if (j.length != g || 0 === c[a[e]] && "00" != b[e] || -1 === f) return !1;
            j = c[a[f]].toString();
            if (1 > j.length || 1 > c[a[f]] || 12 < c[a[f]] || -1 === h) return !1;
            j = c[a[h]].toString();
            return 1 > j.length || 1 > c[a[h]] || 31 < c[a[h]] || 2 == c[a[f]] && c[a[h]] > (0 === c[a[e]] % 4 && (0 !== c[a[e]] % 100 || 0 === c[a[e]] % 400) ? 29 : 28) || c[a[h]] > i[c[a[f]]] ? !1 : !0
        },
        isEmpty: function (a) {
            return a.match(/^\s+$/) || "" === a ? !0 : !1
        },
        checkTime: function (d) {
            var b = /^(\d{1,2}):(\d{2})([ap]m)?$/;
            if (!a.jgrid.isEmpty(d)) if (d = d.match(b)) {
                if (d[3]) {
                    if (1 > d[1] || 12 < d[1]) return !1
                } else if (23 < d[1]) return !1;
                if (59 < d[2]) return !1
            } else return !1;
            return !0
        },
        checkValues: function (d, b, c, e, g) {
            var h, f;
            if (void 0 === e) if ("string" === typeof b) {
                e = 0;
                for (g = c.p.colModel.length; e < g; e++) if (c.p.colModel[e].name == b) {
                    h = c.p.colModel[e].editrules;
                    b = e;
                    try {
                        f = c.p.colModel[e].formoptions.label
                    } catch (i) { }
                    break
                }
            } else 0 <= b && (h = c.p.colModel[b].editrules);
            else h = e, f = void 0 === g ? "_" : g;
            if (h) {
                f || (f = c.p.colNames[b]);
                if (!0 === h.required && a.jgrid.isEmpty(d)) return [!1, f + ": " + a.jgrid.edit.msg.required, ""];
                e = !1 === h.required ? !1 : !0;
                if (!0 === h.number && !(!1 === e && a.jgrid.isEmpty(d)) && isNaN(d)) return [!1, f + ": " + a.jgrid.edit.msg.number, ""];
                if (void 0 !== h.minValue && !isNaN(h.minValue) && parseFloat(d) < parseFloat(h.minValue)) return [!1, f + ": " + a.jgrid.edit.msg.minValue + " " + h.minValue, ""];
                if (void 0 !== h.maxValue && !isNaN(h.maxValue) && parseFloat(d) > parseFloat(h.maxValue)) return [!1, f + ": " + a.jgrid.edit.msg.maxValue + " " + h.maxValue, ""];
                if (!0 === h.email && !(!1 === e && a.jgrid.isEmpty(d)) && (g = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, !g.test(d))) return [!1, f + ": " + a.jgrid.edit.msg.email, ""];
                if (!0 === h.integer && !(!1 === e && a.jgrid.isEmpty(d)) && (isNaN(d) || 0 !== d % 1 || -1 != d.indexOf("."))) return [!1, f + ": " + a.jgrid.edit.msg.integer, ""];
                if (!0 === h.date && !(!1 === e && a.jgrid.isEmpty(d)) && (b = c.p.colModel[b].formatoptions && c.p.colModel[b].formatoptions.newformat ? c.p.colModel[b].formatoptions.newformat : c.p.colModel[b].datefmt || "Y-m-d", !a.jgrid.checkDate(b, d))) return [!1, f + ": " + a.jgrid.edit.msg.date + " - " + b, ""];
                if (!0 === h.time && !(!1 === e && a.jgrid.isEmpty(d)) && !a.jgrid.checkTime(d)) return [!1, f + ": " + a.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
                if (!0 === h.url && !(!1 === e && a.jgrid.isEmpty(d)) && (g = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i, !g.test(d))) return [!1, f + ": " + a.jgrid.edit.msg.url, ""];
                if (!0 === h.custom && !(!1 === e && a.jgrid.isEmpty(d))) return a.isFunction(h.custom_func) ? (d = h.custom_func.call(c, d, f), a.isArray(d) ? d : [!1, a.jgrid.edit.msg.customarray, ""]) : [!1, a.jgrid.edit.msg.customfcheck, ""]
            }
            return [!0, "", ""]
        }
    })
})(jQuery);
(function (a) {
    var b = {};
    a.jgrid.extend({
        searchGrid: function (b) {
            b = a.extend(!0, {
                recreateFilter: !1,
                drag: !0,
                sField: "searchField",
                sValue: "searchString",
                sOper: "searchOper",
                sFilter: "filters",
                loadDefaults: !0,
                beforeShowSearch: null,
                afterShowSearch: null,
                onInitializeSearch: null,
                afterRedraw: null,
                afterChange: null,
                closeAfterSearch: !1,
                closeAfterReset: !1,
                closeOnEscape: !1,
                searchOnEnter: !1,
                multipleSearch: !1,
                multipleGroup: !1,
                top: 0,
                left: 0,
                jqModal: !0,
                modal: !1,
                resize: !0,
                width: 450,
                height: "auto",
                dataheight: "auto",
                showQuery: !1,
                errorcheck: !0,
                sopt: null,
                stringResult: void 0,
                onClose: null,
                onSearch: null,
                onReset: null,
                toTop: !0,
                overlay: 30,
                columns: [],
                tmplNames: null,
                tmplFilters: null,
                tmplLabel: " Template: ",
                showOnLoad: !1,
                layer: null
            }, a.jgrid.search, b || {});
            return this.each(function () {
                function c(d) {
                    s = a(e).triggerHandler("jqGridFilterBeforeShow", [d]);
                    void 0 === s && (s = !0);
                    s && a.isFunction(b.beforeShowSearch) && (s = b.beforeShowSearch.call(e, d));
                    s && (a.jgrid.viewModal("#" + a.jgrid.jqID(t.themodal), {
                        gbox: "#gbox_" + a.jgrid.jqID(h),
                        jqm: b.jqModal,
                        modal: b.modal,
                        overlay: b.overlay,
                        toTop: b.toTop
                    }), a(e).triggerHandler("jqGridFilterAfterShow", [d]), a.isFunction(b.afterShowSearch) && b.afterShowSearch.call(e, d))
                }
                var e = this;
                if (e.grid) {
                    var h = "fbox_" + e.p.id,
                        s = !0,
                        t = {
                            themodal: "searchmod" + h,
                            modalhead: "searchhd" + h,
                            modalcontent: "searchcnt" + h,
                            scrollelm: h
                        },
                        r = e.p.postData[b.sFilter];
                    "string" === typeof r && (r = a.jgrid.parse(r));
                    !0 === b.recreateFilter && a("#" + a.jgrid.jqID(t.themodal)).remove();
                    if (void 0 !== a("#" + a.jgrid.jqID(t.themodal))[0]) c(a("#fbox_" + a.jgrid.jqID(+e.p.id)));
                    else {
                        var p = a("<div><div id='" + h + "' class='searchFilter' style='overflow:auto'></div></div>").insertBefore("#gview_" + a.jgrid.jqID(e.p.id)),
                            f = "left",
                            i = "";
                        "rtl" == e.p.direction && (f = "right", i = " style='text-align:left'", p.attr("dir", "rtl"));
                        var m = a.extend([], e.p.colModel),
                            w = "<a href='javascript:void(0)' id='" + h + "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" + b.Find + "</a>",
                            d = "<a href='javascript:void(0)' id='" + h + "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" + b.Reset + "</a>",
                            n = "",
                            g = "",
                            o, l = !1,
                            q = -1;
                        b.showQuery && (n = "<a href='javascript:void(0)' id='" + h + "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>");
                        b.columns.length ? m = b.columns : a.each(m, function (a, b) {
                            if (!b.label) b.label = e.p.colNames[a];
                            if (!l) {
                                var d = b.search === void 0 ? true : b.search,
                                    c = b.hidden === true;
                                if (b.searchoptions && b.searchoptions.searchhidden === true && d || d && !c) {
                                    l = true;
                                    o = b.index || b.name;
                                    q = a
                                }
                            }
                        });
                        if (!r && o || !1 === b.multipleSearch) {
                            var x = "eq";
                            0 <= q && m[q].searchoptions && m[q].searchoptions.sopt ? x = m[q].searchoptions.sopt[0] : b.sopt && b.sopt.length && (x = b.sopt[0]);
                            r = {
                                groupOp: "AND",
                                rules: [{
                                    field: o,
                                    op: x,
                                    data: ""
                                }]
                            }
                        }
                        l = !1;
                        b.tmplNames && b.tmplNames.length && (l = !0, g = b.tmplLabel, g += "<select class='ui-template'>", g += "<option value='default'>Default</option>", a.each(b.tmplNames, function (a, b) {
                            g = g + ("<option value='" + a + "'>" + b + "</option>")
                        }), g += "</select>");
                        f = "<table class='EditTable' style='border:0px none;margin-top:5px' id='" + h + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" + f + "'>" + d + g + "</td><td class='EditButton' " + i + ">" + n + w + "</td></tr></tbody></table>";
                        h = a.jgrid.jqID(h);
                        a("#" + h).jqFilter({
                            columns: m,
                            filter: b.loadDefaults ? r : null,
                            showQuery: b.showQuery,
                            errorcheck: b.errorcheck,
                            sopt: b.sopt,
                            groupButton: b.multipleGroup,
                            ruleButtons: b.multipleSearch,
                            afterRedraw: b.afterRedraw,
                            _gridsopt: a.jgrid.search.odata,
                            ajaxSelectOptions: e.p.ajaxSelectOptions,
                            groupOps: b.groupOps,
                            onChange: function () {
                                this.p.showQuery && a(".query", this).html(this.toUserFriendlyString());
                                a.isFunction(b.afterChange) && b.afterChange.call(e, a("#" + h), b)
                            },
                            direction: e.p.direction
                        });
                        p.append(f);
                        l && b.tmplFilters && b.tmplFilters.length && a(".ui-template", p).bind("change", function () {
                            var d = a(this).val();
                            d == "default" ? a("#" + h).jqFilter("addFilter", r) : a("#" + h).jqFilter("addFilter", b.tmplFilters[parseInt(d, 10)]);
                            return false
                        });
                        !0 === b.multipleGroup && (b.multipleSearch = !0);
                        a(e).triggerHandler("jqGridFilterInitialize", [a("#" + h)]);
                        a.isFunction(b.onInitializeSearch) && b.onInitializeSearch.call(e, a("#" + h));
                        b.gbox = "#gbox_" + h;
                        b.layer ? a.jgrid.createModal(t, p, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0], "#" + a.jgrid.jqID(b.layer), {
                            position: "relative"
                        }) : a.jgrid.createModal(t, p, b, "#gview_" + a.jgrid.jqID(e.p.id), a("#gbox_" + a.jgrid.jqID(e.p.id))[0]);
                        (b.searchOnEnter || b.closeOnEscape) && a("#" + a.jgrid.jqID(t.themodal)).keydown(function (d) {
                            var c = a(d.target);
                            if (b.searchOnEnter && d.which === 13 && !c.hasClass("add-group") && !c.hasClass("add-rule") && !c.hasClass("delete-group") && !c.hasClass("delete-rule") && (!c.hasClass("fm-button") || !c.is("[id$=_query]"))) {
                                a("#" + h + "_search").focus().click();
                                return false
                            }
                            if (b.closeOnEscape && d.which === 27) {
                                a("#" + a.jgrid.jqID(t.modalhead)).find(".ui-jqdialog-titlebar-close").focus().click();
                                return false
                            }
                        });
                        n && a("#" + h + "_query").bind("click", function () {
                            a(".queryresult", p).toggle();
                            return false
                        });
                        void 0 === b.stringResult && (b.stringResult = b.multipleSearch);
                        a("#" + h + "_search").bind("click", function () {
                            var d = a("#" + h),
                                c = {},
                                g, k = d.jqFilter("filterData");
                            if (b.errorcheck) {
                                d[0].hideError();
                                b.showQuery || d.jqFilter("toSQLString");
                                if (d[0].p.error) {
                                    d[0].showError();
                                    return false
                                }
                            }
                            if (b.stringResult) {
                                try {
                                    g = xmlJsonClass.toJson(k, "", "", false)
                                } catch (i) {
                                    try {
                                        g = JSON.stringify(k)
                                    } catch (f) { }
                                }
                                if (typeof g === "string") {
                                    c[b.sFilter] = g;
                                    a.each([b.sField, b.sValue, b.sOper], function () {
                                        c[this] = ""
                                    })
                                }
                            } else if (b.multipleSearch) {
                                c[b.sFilter] = k;
                                a.each([b.sField, b.sValue, b.sOper], function () {
                                    c[this] = ""
                                })
                            } else {
                                c[b.sField] = k.rules[0].field;
                                c[b.sValue] = k.rules[0].data;
                                c[b.sOper] = k.rules[0].op;
                                c[b.sFilter] = ""
                            }
                            e.p.search = true;
                            a.extend(e.p.postData, c);
                            a(e).triggerHandler("jqGridFilterSearch");
                            a.isFunction(b.onSearch) && b.onSearch.call(e);
                            a(e).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            b.closeAfterSearch && a.jgrid.hideModal("#" + a.jgrid.jqID(t.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(e.p.id),
                                jqm: b.jqModal,
                                onClose: b.onClose
                            });
                            return false
                        });
                        a("#" + h + "_reset").bind("click", function () {
                            var d = {},
                                c = a("#" + h);
                            e.p.search = false;
                            b.multipleSearch === false ? d[b.sField] = d[b.sValue] = d[b.sOper] = "" : d[b.sFilter] = "";
                            c[0].resetFilter();
                            l && a(".ui-template", p).val("default");
                            a.extend(e.p.postData, d);
                            a(e).triggerHandler("jqGridFilterReset");
                            a.isFunction(b.onReset) && b.onReset.call(e);
                            a(e).trigger("reloadGrid", [{
                                page: 1
                            }]);
                            return false
                        });
                        c(a("#" + h));
                        a(".fm-button:not(.ui-state-disabled)", p).hover(function () {
                            a(this).addClass("ui-state-hover")
                        }, function () {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        editGridRow: function (u, c) {
            c = a.extend(!0, {
                top: 0,
                left: 0,
                width: 300,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                url: null,
                mtype: "POST",
                clearAfterAdd: !0,
                closeAfterEdit: !1,
                reloadAfterSubmit: !0,
                onInitializeForm: null,
                beforeInitData: null,
                beforeShowForm: null,
                afterShowForm: null,
                beforeSubmit: null,
                afterSubmit: null,
                onclickSubmit: null,
                afterComplete: null,
                onclickPgButtons: null,
                afterclickPgButtons: null,
                editData: {},
                recreateForm: !1,
                jqModal: !0,
                closeOnEscape: !1,
                addedrow: "first",
                topinfo: "",
                bottominfo: "",
                saveicon: [],
                closeicon: [],
                savekey: [!1, 13],
                navkeys: [!1, 38, 40],
                checkOnSubmit: !1,
                checkOnUpdate: !1,
                _savedData: {},
                processing: !1,
                onClose: null,
                ajaxEditOptions: {},
                serializeEditData: null,
                viewPagerButtons: !0
            }, a.jgrid.edit, c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function () {
                function e() {
                    a(l + " > tbody > tr > td > .FormElement").each(function () {
                        var b = a(".customelement", this);
                        if (b.length) {
                            var c = a(b[0]).attr("name");
                            a.each(d.p.colModel, function () {
                                if (this.name === c && this.editoptions && a.isFunction(this.editoptions.custom_value)) {
                                    try {
                                        if (j[c] = this.editoptions.custom_value.call(d, a("#" + a.jgrid.jqID(c), l), "get"), void 0 === j[c]) throw "e1";
                                    } catch (b) {
                                        "e1" === b ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, b.message, a.jgrid.edit.bClose)
                                    }
                                    return !0
                                }
                            })
                        } else {
                            switch (a(this).get(0).type) {
                                case "checkbox":
                                    a(this).is(":checked") ? j[this.name] = a(this).val() : (b = a(this).attr("offval"), j[this.name] = b);
                                    break;
                                case "select-one":
                                    j[this.name] = a("option:selected", this).val();
                                    B[this.name] = a("option:selected", this).text();
                                    break;
                                case "select-multiple":
                                    j[this.name] = a(this).val();
                                    j[this.name] = j[this.name] ? j[this.name].join(",") : "";
                                    var e = [];
                                    a("option:selected", this).each(function (d, b) {
                                        e[d] = a(b).text()
                                    });
                                    B[this.name] = e.join(",");
                                    break;
                                case "password":
                                case "text":
                                case "textarea":
                                case "button":
                                    j[this.name] = a(this).val()
                            }
                            d.p.autoencode && (j[this.name] = a.jgrid.htmlEncode(j[this.name]))
                        }
                    });
                    return !0
                }
                function h(c, e, k, j) {
                    var i, f, l, q = 0,
                        h, p, o, m = [],
                        y = !1,
                        u = "",
                        n;
                    for (n = 1; n <= j; n++) u += "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>";
                    "_empty" != c && (y = a(e).jqGrid("getInd", c));
                    a(e.p.colModel).each(function (n) {
                        i = this.name;
                        p = (f = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        if ("cb" !== i && "subgrid" !== i && !0 === this.editable && "rn" !== i) {
                            if (!1 === y) h = "";
                            else if (i == e.p.ExpandColumn && !0 === e.p.treeGrid) h = a("td[role='gridcell']:eq(" + n + ")", e.rows[y]).text();
                            else {
                                try {
                                    h = a.unformat.call(e, a("td[role='gridcell']:eq(" + n + ")", e.rows[y]), {
                                        rowId: c,
                                        colModel: this
                                    }, n)
                                } catch (s) {
                                    h = this.edittype && "textarea" == this.edittype ? a("td[role='gridcell']:eq(" + n + ")", e.rows[y]).text() : a("td[role='gridcell']:eq(" + n + ")", e.rows[y]).html()
                                }
                                if (!h || "&nbsp;" == h || "&#160;" == h || 1 == h.length && 160 == h.charCodeAt(0)) h = ""
                            }
                            var r = a.extend({}, this.editoptions || {}, {
                                id: i,
                                name: i
                            }),
                                v = a.extend({}, {
                                    elmprefix: "",
                                    elmsuffix: "",
                                    rowabove: !1,
                                    rowcontent: ""
                                }, this.formoptions || {}),
                                t = parseInt(v.rowpos, 10) || q + 1,
                                x = parseInt(2 * (parseInt(v.colpos, 10) || 1), 10);
                            "_empty" == c && r.defaultValue && (h = a.isFunction(r.defaultValue) ? r.defaultValue.call(d) : r.defaultValue);
                            this.edittype || (this.edittype = "text");
                            d.p.autoencode && (h = a.jgrid.htmlDecode(h));
                            o = a.jgrid.createEl.call(d, this.edittype, r, h, !1, a.extend({}, a.jgrid.ajaxOptions, e.p.ajaxSelectOptions || {}));
                            "" === h && "checkbox" == this.edittype && (h = a(o).attr("offval"));
                            "" === h && "select" == this.edittype && (h = a("option:eq(0)", o).text());
                            if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData[i] = h;
                            a(o).addClass("FormElement"); -1 < a.inArray(this.edittype, ["text", "textarea", "password", "select"]) && a(o).addClass("ui-widget-content ui-corner-all");
                            l = a(k).find("tr[rowpos=" + t + "]");
                            if (v.rowabove) {
                                var z = a("<tr><td class='contentinfo' colspan='" + 2 * j + "'>" + v.rowcontent + "</td></tr>");
                                a(k).append(z);
                                z[0].rp = t
                            }
                            0 === l.length && (l = a("<tr " + p + " rowpos='" + t + "'></tr>").addClass("FormData").attr("id", "tr_" + i), a(l).append(u), a(k).append(l), l[0].rp = t);
                            a("td:eq(" + (x - 2) + ")", l[0]).html(void 0 === v.label ? e.p.colNames[n] : v.label);
                            a("td:eq(" + (x - 1) + ")", l[0]).append(v.elmprefix).append(o).append(v.elmsuffix);
                            a.isFunction(r.custom_value) && "_empty" !== c && r.custom_value.call(d, a("#" + i, "#" + g), "set", h);
                            a.jgrid.bindEv(o, r, d);
                            m[q] = n;
                            q++
                        }
                    });
                    if (0 < q && (n = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * j - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" + e.p.id + "_id' value='" + c + "'/></td></tr>"), n[0].rp = q + 999, a(k).append(n), b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate)) b[d.p.id]._savedData[e.p.id + "_id"] = c;
                    return m
                }
                function s(c, e, g) {
                    var k, i = 0,
                        j, f, h, q, p;
                    if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData = {}, b[d.p.id]._savedData[e.p.id + "_id"] = c;
                    var n = e.p.colModel;
                    if ("_empty" == c) a(n).each(function () {
                        k = this.name;
                        h = a.extend({}, this.editoptions || {});
                        if ((f = a("#" + a.jgrid.jqID(k), "#" + g)) && f.length && null !== f[0]) if (q = "", h.defaultValue ? (q = a.isFunction(h.defaultValue) ? h.defaultValue.call(d) : h.defaultValue, "checkbox" == f[0].type ? (p = q.toLowerCase(), 0 > p.search(/(false|0|no|off|undefined)/i) && "" !== p ? (f[0].checked = !0, f[0].defaultChecked = !0, f[0].value = q) : (f[0].checked = !1, f[0].defaultChecked = !1)) : f.val(q)) : "checkbox" == f[0].type ? (f[0].checked = !1, f[0].defaultChecked = !1, q = a(f).attr("offval")) : f[0].type && "select" == f[0].type.substr(0, 6) ? f[0].selectedIndex = 0 : f.val(q), !0 === b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData[k] = q
                    }), a("#id_g", "#" + g).val(c);
                    else {
                        var o = a(e).jqGrid("getInd", c, !0);
                        o && (a('td[role="gridcell"]', o).each(function (f) {
                            k = n[f].name;
                            if ("cb" !== k && "subgrid" !== k && "rn" !== k && !0 === n[f].editable) {
                                if (k == e.p.ExpandColumn && !0 === e.p.treeGrid) j = a(this).text();
                                else try {
                                    j = a.unformat.call(e, a(this), {
                                        rowId: c,
                                        colModel: n[f]
                                    }, f)
                                } catch (h) {
                                    j = "textarea" == n[f].edittype ? a(this).text() : a(this).html()
                                }
                                d.p.autoencode && (j = a.jgrid.htmlDecode(j));
                                if (!0 === b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) b[d.p.id]._savedData[k] = j;
                                k = a.jgrid.jqID(k);
                                switch (n[f].edittype) {
                                    case "password":
                                    case "text":
                                    case "button":
                                    case "image":
                                    case "textarea":
                                        if ("&nbsp;" == j || "&#160;" == j || 1 == j.length && 160 == j.charCodeAt(0)) j = "";
                                        a("#" + k, "#" + g).val(j);
                                        break;
                                    case "select":
                                        var l = j.split(","),
                                        l = a.map(l, function (c) {
                                            return a.trim(c)
                                        });
                                        a("#" + k + " option", "#" + g).each(function () {
                                            this.selected = !n[f].editoptions.multiple && (a.trim(j) == a.trim(a(this).text()) || l[0] == a.trim(a(this).text()) || l[0] == a.trim(a(this).val())) ? !0 : n[f].editoptions.multiple ? -1 < a.inArray(a.trim(a(this).text()), l) || -1 < a.inArray(a.trim(a(this).val()), l) ? !0 : !1 : !1
                                        });
                                        break;
                                    case "checkbox":
                                        j = "" + j;
                                        n[f].editoptions && n[f].editoptions.value ? n[f].editoptions.value.split(":")[0] == j ? (a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("checked", !0), a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !0)) : (a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("checked", !1), a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !1)) : (j = j.toLowerCase(), 0 > j.search(/(false|0|no|off|undefined)/i) && "" !== j ? (a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("checked", !0), a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !0)) : (a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("checked", !1), a("#" + k, "#" + g)[d.p.useProp ? "prop" : "attr"]("defaultChecked", !1)));
                                        break;
                                    case "custom":
                                        try {
                                            if (n[f].editoptions && a.isFunction(n[f].editoptions.custom_value)) n[f].editoptions.custom_value.call(d, a("#" + k, "#" + g), "set", j);
                                            else throw "e1";
                                        } catch (q) {
                                            "e1" == q ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, q.message, a.jgrid.edit.bClose)
                                        }
                                }
                                i++
                            }
                        }), 0 < i && a("#id_g", l).val(c))
                    }
                }
                function t() {
                    a.each(d.p.colModel, function (a, c) {
                        c.editoptions && !0 === c.editoptions.NullIfEmpty && j.hasOwnProperty(c.name) && "" === j[c.name] && (j[c.name] = "null")
                    })
                }
                function r() {
                    var e, k = [!0, "", ""],
                        f = {},
                        i = d.p.prmNames,
                        h, p, o, y, m, u = a(d).triggerHandler("jqGridAddEditBeforeCheckValues", [a("#" + g), z]);
                    u && "object" === typeof u && (j = u);
                    a.isFunction(b[d.p.id].beforeCheckValues) && (u = b[d.p.id].beforeCheckValues.call(d, j, a("#" + g), "_empty" == j[d.p.id + "_id"] ? i.addoper : i.editoper)) && "object" === typeof u && (j = u);
                    for (o in j) if (j.hasOwnProperty(o) && (k = a.jgrid.checkValues.call(d, j[o], o, d), !1 === k[0])) break;
                    t();
                    k[0] && (f = a(d).triggerHandler("jqGridAddEditClickSubmit", [b[d.p.id], j, z]), void 0 === f && a.isFunction(b[d.p.id].onclickSubmit) && (f = b[d.p.id].onclickSubmit.call(d, b[d.p.id], j) || {}), k = a(d).triggerHandler("jqGridAddEditBeforeSubmit", [j, a("#" + g), z]), void 0 === k && (k = [!0, "", ""]), k[0] && a.isFunction(b[d.p.id].beforeSubmit) && (k = b[d.p.id].beforeSubmit.call(d, j, a("#" + g))));
                    if (k[0] && !b[d.p.id].processing) {
                        b[d.p.id].processing = !0;
                        a("#sData", l + "_2").addClass("ui-state-active");
                        p = i.oper;
                        h = i.id;
                        j[p] = "_empty" == a.trim(j[d.p.id + "_id"]) ? i.addoper : i.editoper;
                        j[p] != i.addoper ? j[h] = j[d.p.id + "_id"] : void 0 === j[h] && (j[h] = j[d.p.id + "_id"]);
                        delete j[d.p.id + "_id"];
                        j = a.extend(j, b[d.p.id].editData, f);
                        if (!0 === d.p.treeGrid) for (m in j[p] == i.addoper && (y = a(d).jqGrid("getGridParam", "selrow"), j["adjacency" == d.p.treeGridModel ? d.p.treeReader.parent_id_field : "parent_id"] = y), d.p.treeReader) d.p.treeReader.hasOwnProperty(m) && (f = d.p.treeReader[m], j.hasOwnProperty(f) && !(j[p] == i.addoper && "parent_id_field" === m) && delete j[f]);
                        j[h] = a.jgrid.stripPref(d.p.idPrefix, j[h]);
                        m = a.extend({
                            url: b[d.p.id].url || a(d).jqGrid("getGridParam", "editurl"),
                            type: b[d.p.id].mtype,
                            data: a.isFunction(b[d.p.id].serializeEditData) ? b[d.p.id].serializeEditData.call(d, j) : j,
                            complete: function (f, o) {
                                var m;
                                j[h] = d.p.idPrefix + j[h];
                                if (o != "success") {
                                    k[0] = false;
                                    k[1] = a(d).triggerHandler("jqGridAddEditErrorTextFormat", [f, z]);
                                    k[1] = a.isFunction(b[d.p.id].errorTextFormat) ? b[d.p.id].errorTextFormat.call(d, f) : o + " Status: '" + f.statusText + "'. Error code: " + f.status
                                } else {
                                    k = a(d).triggerHandler("jqGridAddEditAfterSubmit", [f, j, z]);
                                    k === void 0 && (k = [true, "", ""]);
                                    k[0] && a.isFunction(b[d.p.id].afterSubmit) && (k = b[d.p.id].afterSubmit.call(d, f, j))
                                }
                                if (k[0] === false) {
                                    a("#FormError>td", l).html(k[1]);
                                    a("#FormError", l).show()
                                } else {
                                    a.each(d.p.colModel, function () {
                                        if (B[this.name] && this.formatter && this.formatter == "select") try {
                                            delete B[this.name]
                                        } catch (a) { }
                                    });
                                    j = a.extend(j, B);
                                    d.p.autoencode && a.each(j, function (c, d) {
                                        j[c] = a.jgrid.htmlDecode(d)
                                    });
                                    if (j[p] == i.addoper) {
                                        k[2] || (k[2] = a.jgrid.randId());
                                        j[h] = k[2];
                                        if (b[d.p.id].closeAfterAdd) {
                                            if (b[d.p.id].reloadAfterSubmit) a(d).trigger("reloadGrid");
                                            else if (d.p.treeGrid === true) a(d).jqGrid("addChildNode", k[2], y, j);
                                            else {
                                                a(d).jqGrid("addRowData", k[2], j, c.addedrow);
                                                a(d).jqGrid("setSelection", k[2])
                                            }
                                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                                gb: "#gbox_" + a.jgrid.jqID(n),
                                                jqm: c.jqModal,
                                                onClose: b[d.p.id].onClose
                                            })
                                        } else if (b[d.p.id].clearAfterAdd) {
                                            b[d.p.id].reloadAfterSubmit ? a(d).trigger("reloadGrid") : d.p.treeGrid === true ? a(d).jqGrid("addChildNode", k[2], y, j) : a(d).jqGrid("addRowData", k[2], j, c.addedrow);
                                            s("_empty", d, g)
                                        } else b[d.p.id].reloadAfterSubmit ? a(d).trigger("reloadGrid") : d.p.treeGrid === true ? a(d).jqGrid("addChildNode", k[2], y, j) : a(d).jqGrid("addRowData", k[2], j, c.addedrow)
                                    } else {
                                        if (b[d.p.id].reloadAfterSubmit) {
                                            a(d).trigger("reloadGrid");
                                            b[d.p.id].closeAfterEdit || setTimeout(function () {
                                                a(d).jqGrid("setSelection", j[h])
                                            }, 1E3)
                                        } else d.p.treeGrid === true ? a(d).jqGrid("setTreeRow", j[h], j) : a(d).jqGrid("setRowData", j[h], j);
                                        b[d.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                            gb: "#gbox_" + a.jgrid.jqID(n),
                                            jqm: c.jqModal,
                                            onClose: b[d.p.id].onClose
                                        })
                                    }
                                    if (a.isFunction(b[d.p.id].afterComplete)) {
                                        e = f;
                                        setTimeout(function () {
                                            a(d).triggerHandler("jqGridAddEditAfterComplete", [e, j, a("#" + g), z]);
                                            b[d.p.id].afterComplete.call(d, e, j, a("#" + g));
                                            e = null
                                        }, 500)
                                    }
                                    if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) {
                                        a("#" + g).data("disabled", false);
                                        if (b[d.p.id]._savedData[d.p.id + "_id"] != "_empty") for (m in b[d.p.id]._savedData) b[d.p.id]._savedData.hasOwnProperty(m) && j[m] && (b[d.p.id]._savedData[m] = j[m])
                                    }
                                }
                                b[d.p.id].processing = false;
                                a("#sData", l + "_2").removeClass("ui-state-active");
                                try {
                                    a(":input:visible", "#" + g)[0].focus()
                                } catch (u) { }
                            }
                        }, a.jgrid.ajaxOptions, b[d.p.id].ajaxEditOptions);
                        !m.url && !b[d.p.id].useDataProxy && (a.isFunction(d.p.dataProxy) ? b[d.p.id].useDataProxy = !0 : (k[0] = !1, k[1] += " " + a.jgrid.errors.nourl));
                        k[0] && (b[d.p.id].useDataProxy ? (f = d.p.dataProxy.call(d, m, "set_" + d.p.id), void 0 === f && (f = [!0, ""]), !1 === f[0] ? (k[0] = !1, k[1] = f[1] || "Error deleting the selected row!") : (m.data.oper == i.addoper && b[d.p.id].closeAfterAdd && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                            gb: "#gbox_" + a.jgrid.jqID(n),
                            jqm: c.jqModal,
                            onClose: b[d.p.id].onClose
                        }), m.data.oper == i.editoper && b[d.p.id].closeAfterEdit && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                            gb: "#gbox_" + a.jgrid.jqID(n),
                            jqm: c.jqModal,
                            onClose: b[d.p.id].onClose
                        }))) : a.ajax(m))
                    } !1 === k[0] && (a("#FormError>td", l).html(k[1]), a("#FormError", l).show())
                }
                function p(a, c) {
                    var d = !1,
                        b;
                    for (b in a) if (a.hasOwnProperty(b) && a[b] != c[b]) {
                        d = !0;
                        break
                    }
                    return d
                }
                function f() {
                    var c = !0;
                    a("#FormError", l).hide();
                    if (b[d.p.id].checkOnUpdate && (j = {}, B = {}, e(), F = a.extend({}, j, B), M = p(F, b[d.p.id]._savedData))) a("#" + g).data("disabled", !0), a(".confirm", "#" + q.themodal).show(), c = !1;
                    return c
                }
                function i() {
                    var c;
                    if ("_empty" !== u && void 0 !== d.p.savedRow && 0 < d.p.savedRow.length && a.isFunction(a.fn.jqGrid.restoreRow)) for (c = 0; c < d.p.savedRow.length; c++) if (d.p.savedRow[c].id == u) {
                        a(d).jqGrid("restoreRow", u);
                        break
                    }
                }
                function m(c, d) {
                    var b = d[1].length - 1;
                    0 === c ? a("#pData", l + "_2").addClass("ui-state-disabled") : void 0 !== d[1][c - 1] && a("#" + a.jgrid.jqID(d[1][c - 1])).hasClass("ui-state-disabled") ? a("#pData", l + "_2").addClass("ui-state-disabled") : a("#pData", l + "_2").removeClass("ui-state-disabled");
                    c == b ? a("#nData", l + "_2").addClass("ui-state-disabled") : void 0 !== d[1][c + 1] && a("#" + a.jgrid.jqID(d[1][c + 1])).hasClass("ui-state-disabled") ? a("#nData", l + "_2").addClass("ui-state-disabled") : a("#nData", l + "_2").removeClass("ui-state-disabled")
                }
                function w() {
                    var c = a(d).jqGrid("getDataIDs"),
                        b = a("#id_g", l).val();
                    return [a.inArray(b, c), c]
                }
                var d = this;
                if (d.grid && u) {
                    var n = d.p.id,
                        g = "FrmGrid_" + n,
                        o = "TblGrid_" + n,
                        l = "#" + a.jgrid.jqID(o),
                        q = {
                            themodal: "editmod" + n,
                            modalhead: "edithd" + n,
                            modalcontent: "editcnt" + n,
                            scrollelm: g
                        },
                        x = a.isFunction(b[d.p.id].beforeShowForm) ? b[d.p.id].beforeShowForm : !1,
                        A = a.isFunction(b[d.p.id].afterShowForm) ? b[d.p.id].afterShowForm : !1,
                        v = a.isFunction(b[d.p.id].beforeInitData) ? b[d.p.id].beforeInitData : !1,
                        C = a.isFunction(b[d.p.id].onInitializeForm) ? b[d.p.id].onInitializeForm : !1,
                        k = !0,
                        y = 1,
                        H = 0,
                        j, B, F, M, z, g = a.jgrid.jqID(g);
                    "new" === u ? (u = "_empty", z = "add", c.caption = b[d.p.id].addCaption) : (c.caption = b[d.p.id].editCaption, z = "edit");
                    !0 === c.recreateForm && void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0] && a("#" + a.jgrid.jqID(q.themodal)).remove();
                    var I = !0;
                    c.checkOnUpdate && c.jqModal && !c.modal && (I = !1);
                    if (void 0 !== a("#" + a.jgrid.jqID(q.themodal))[0]) {
                        k = a(d).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + a.jgrid.jqID(g)), z]);
                        void 0 === k && (k = !0);
                        k && v && (k = v.call(d, a("#" + g)));
                        if (!1 === k) return;
                        i();
                        a(".ui-jqdialog-title", "#" + a.jgrid.jqID(q.modalhead)).html(c.caption);
                        a("#FormError", l).hide();
                        b[d.p.id].topinfo ? (a(".topinfo", l).html(b[d.p.id].topinfo), a(".tinfo", l).show()) : a(".tinfo", l).hide();
                        b[d.p.id].bottominfo ? (a(".bottominfo", l + "_2").html(b[d.p.id].bottominfo), a(".binfo", l + "_2").show()) : a(".binfo", l + "_2").hide();
                        s(u, d, g);
                        "_empty" == u || !b[d.p.id].viewPagerButtons ? a("#pData, #nData", l + "_2").hide() : a("#pData, #nData", l + "_2").show();
                        !0 === b[d.p.id].processing && (b[d.p.id].processing = !1, a("#sData", l + "_2").removeClass("ui-state-active"));
                        !0 === a("#" + g).data("disabled") && (a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide(), a("#" + g).data("disabled", !1));
                        a(d).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + g), z]);
                        x && x.call(d, a("#" + g));
                        a("#" + a.jgrid.jqID(q.themodal)).data("onClose", b[d.p.id].onClose);
                        a.jgrid.viewModal("#" + a.jgrid.jqID(q.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(n),
                            jqm: c.jqModal,
                            jqM: !1,
                            overlay: c.overlay,
                            modal: c.modal
                        });
                        I || a(".jqmOverlay").click(function () {
                            if (!f()) return false;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(n),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return false
                        });
                        a(d).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + g), z]);
                        A && A.call(d, a("#" + g))
                    } else {
                        var G = isNaN(c.dataheight) ? c.dataheight : c.dataheight + "px",
                            k = isNaN(c.datawidth) ? c.datawidth : c.datawidth + "px",
                            G = a("<form name='FormPost' id='" + g + "' class='FormGrid' onSubmit='return false;' style='width:" + k + ";overflow:auto;position:relative;height:" + G + ";'></form>").data("disabled", !1),
                            D = a("<table id='" + o + "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                            k = a(d).triggerHandler("jqGridAddEditBeforeInitData", [a("#" + g), z]);
                        void 0 === k && (k = !0);
                        k && v && (k = v.call(d, a("#" + g)));
                        if (!1 === k) return;
                        i();
                        a(d.p.colModel).each(function () {
                            var a = this.formoptions;
                            y = Math.max(y, a ? a.colpos || 0 : 0);
                            H = Math.max(H, a ? a.rowpos || 0 : 0)
                        });
                        a(G).append(D);
                        v = a("<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" + 2 * y + "'></td></tr>");
                        v[0].rp = 0;
                        a(D).append(v);
                        v = a("<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" + 2 * y + "'>" + b[d.p.id].topinfo + "</td></tr>");
                        v[0].rp = 0;
                        a(D).append(v);
                        var k = (v = "rtl" == d.p.direction ? !0 : !1) ? "nData" : "pData",
                            E = v ? "pData" : "nData";
                        h(u, d, D, y);
                        var k = "<a href='javascript:void(0)' id='" + k + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
                            E = "<a href='javascript:void(0)' id='" + E + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                            J = "<a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'>" + c.bSubmit + "</a>",
                            K = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + c.bCancel + "</a>",
                            o = "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" + o + "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" + (v ? E + k : k + E) + "</td><td class='EditButton'>" + J + K + "</td></tr>" + ("<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" + b[d.p.id].bottominfo + "</td></tr>"),
                            o = o + "</tbody></table>";
                        if (0 < H) {
                            var L = [];
                            a.each(a(D)[0].rows, function (a, c) {
                                L[a] = c
                            });
                            L.sort(function (a, c) {
                                return a.rp > c.rp ? 1 : a.rp < c.rp ? -1 : 0
                            });
                            a.each(L, function (c, d) {
                                a("tbody", D).append(d)
                            })
                        }
                        c.gbox = "#gbox_" + a.jgrid.jqID(n);
                        var N = !1;
                        !0 === c.closeOnEscape && (c.closeOnEscape = !1, N = !0);
                        o = a("<div></div>").append(G).append(o);
                        a.jgrid.createModal(q, o, c, "#gview_" + a.jgrid.jqID(d.p.id), a("#gbox_" + a.jgrid.jqID(d.p.id))[0]);
                        v && (a("#pData, #nData", l + "_2").css("float", "right"), a(".EditButton", l + "_2").css("text-align", "left"));
                        b[d.p.id].topinfo && a(".tinfo", l).show();
                        b[d.p.id].bottominfo && a(".binfo", l + "_2").show();
                        o = o = null;
                        a("#" + a.jgrid.jqID(q.themodal)).keydown(function (e) {
                            var k = e.target;
                            if (a("#" + g).data("disabled") === true) return false;
                            if (b[d.p.id].savekey[0] === true && e.which == b[d.p.id].savekey[1] && k.tagName != "TEXTAREA") {
                                a("#sData", l + "_2").trigger("click");
                                return false
                            }
                            if (e.which === 27) {
                                if (!f()) return false;
                                N && a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                    gb: c.gbox,
                                    jqm: c.jqModal,
                                    onClose: b[d.p.id].onClose
                                });
                                return false
                            }
                            if (b[d.p.id].navkeys[0] === true) {
                                if (a("#id_g", l).val() == "_empty") return true;
                                if (e.which == b[d.p.id].navkeys[1]) {
                                    a("#pData", l + "_2").trigger("click");
                                    return false
                                }
                                if (e.which == b[d.p.id].navkeys[2]) {
                                    a("#nData", l + "_2").trigger("click");
                                    return false
                                }
                            }
                        });
                        c.checkOnUpdate && (a("a.ui-jqdialog-titlebar-close span", "#" + a.jgrid.jqID(q.themodal)).removeClass("jqmClose"), a("a.ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(q.themodal)).unbind("click").click(function () {
                            if (!f()) return false;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(n),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return false
                        }));
                        c.saveicon = a.extend([!0, "left", "ui-icon-disk"], c.saveicon);
                        c.closeicon = a.extend([!0, "left", "ui-icon-close"], c.closeicon);
                        !0 === c.saveicon[0] && a("#sData", l + "_2").addClass("right" == c.saveicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.saveicon[2] + "'></span>");
                        !0 === c.closeicon[0] && a("#cData", l + "_2").addClass("right" == c.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] + "'></span>");
                        if (b[d.p.id].checkOnSubmit || b[d.p.id].checkOnUpdate) J = "<a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + c.bYes + "</a>", E = "<a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + c.bNo + "</a>", K = "<a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" + c.bExit + "</a>", o = c.zIndex || 999, o++, a("<div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:" + o + ";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" + (o + 1) + "'>" + c.saveData + "<br/><br/>" + J + E + K + "</div>").insertAfter("#" + g), a("#sNew", "#" + a.jgrid.jqID(q.themodal)).click(function () {
                            r();
                            a("#" + g).data("disabled", false);
                            a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide();
                            return false
                        }), a("#nNew", "#" + a.jgrid.jqID(q.themodal)).click(function () {
                            a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide();
                            a("#" + g).data("disabled", false);
                            setTimeout(function () {
                                a(":input", "#" + g)[0].focus()
                            }, 0);
                            return false
                        }), a("#cNew", "#" + a.jgrid.jqID(q.themodal)).click(function () {
                            a(".confirm", "#" + a.jgrid.jqID(q.themodal)).hide();
                            a("#" + g).data("disabled", false);
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(n),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return false
                        });
                        a(d).triggerHandler("jqGridAddEditInitializeForm", [a("#" + g), z]);
                        C && C.call(d, a("#" + g));
                        "_empty" == u || !b[d.p.id].viewPagerButtons ? a("#pData,#nData", l + "_2").hide() : a("#pData,#nData", l + "_2").show();
                        a(d).triggerHandler("jqGridAddEditBeforeShowForm", [a("#" + g), z]);
                        x && x.call(d, a("#" + g));
                        a("#" + a.jgrid.jqID(q.themodal)).data("onClose", b[d.p.id].onClose);
                        a.jgrid.viewModal("#" + a.jgrid.jqID(q.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(n),
                            jqm: c.jqModal,
                            overlay: c.overlay,
                            modal: c.modal
                        });
                        I || a(".jqmOverlay").click(function () {
                            if (!f()) return false;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(n),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return false
                        });
                        a(d).triggerHandler("jqGridAddEditAfterShowForm", [a("#" + g), z]);
                        A && A.call(d, a("#" + g));
                        a(".fm-button", "#" + a.jgrid.jqID(q.themodal)).hover(function () {
                            a(this).addClass("ui-state-hover")
                        }, function () {
                            a(this).removeClass("ui-state-hover")
                        });
                        a("#sData", l + "_2").click(function () {
                            j = {};
                            B = {};
                            a("#FormError", l).hide();
                            e();
                            if (j[d.p.id + "_id"] == "_empty") r();
                            else if (c.checkOnSubmit === true) {
                                F = a.extend({}, j, B);
                                if (M = p(F, b[d.p.id]._savedData)) {
                                    a("#" + g).data("disabled", true);
                                    a(".confirm", "#" + a.jgrid.jqID(q.themodal)).show()
                                } else r()
                            } else r();
                            return false
                        });
                        a("#cData", l + "_2").click(function () {
                            if (!f()) return false;
                            a.jgrid.hideModal("#" + a.jgrid.jqID(q.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(n),
                                jqm: c.jqModal,
                                onClose: b[d.p.id].onClose
                            });
                            return false
                        });
                        a("#nData", l + "_2").click(function () {
                            if (!f()) return false;
                            a("#FormError", l).hide();
                            var b = w();
                            b[0] = parseInt(b[0], 10);
                            if (b[0] != -1 && b[1][b[0] + 1]) {
                                a(d).triggerHandler("jqGridAddEditClickPgButtons", ["next", a("#" + g), b[1][b[0]]]);
                                var e;
                                if (a.isFunction(c.onclickPgButtons)) {
                                    e = c.onclickPgButtons.call(d, "next", a("#" + g), b[1][b[0]]);
                                    if (e !== void 0 && e === false) return false
                                }
                                if (a("#" + a.jgrid.jqID(b[1][b[0] + 1])).hasClass("ui-state-disabled")) return false;
                                s(b[1][b[0] + 1], d, g);
                                a(d).jqGrid("setSelection", b[1][b[0] + 1]);
                                a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", ["next", a("#" + g), b[1][b[0]]]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(d, "next", a("#" + g), b[1][b[0] + 1]);
                                m(b[0] + 1, b)
                            }
                            return false
                        });
                        a("#pData", l + "_2").click(function () {
                            if (!f()) return false;
                            a("#FormError", l).hide();
                            var b = w();
                            if (b[0] != -1 && b[1][b[0] - 1]) {
                                a(d).triggerHandler("jqGridAddEditClickPgButtons", ["prev", a("#" + g), b[1][b[0]]]);
                                var e;
                                if (a.isFunction(c.onclickPgButtons)) {
                                    e = c.onclickPgButtons.call(d, "prev", a("#" + g), b[1][b[0]]);
                                    if (e !== void 0 && e === false) return false
                                }
                                if (a("#" + a.jgrid.jqID(b[1][b[0] - 1])).hasClass("ui-state-disabled")) return false;
                                s(b[1][b[0] - 1], d, g);
                                a(d).jqGrid("setSelection", b[1][b[0] - 1]);
                                a(d).triggerHandler("jqGridAddEditAfterClickPgButtons", ["prev", a("#" + g), b[1][b[0]]]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(d, "prev", a("#" + g), b[1][b[0] - 1]);
                                m(b[0] - 1, b)
                            }
                            return false
                        })
                    }
                    x = w();
                    m(x[0], x)
                }
            })
        },
        viewGridRow: function (u, c) {
            c = a.extend(!0, {
                top: 0,
                left: 0,
                width: 0,
                datawidth: "auto",
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                jqModal: !0,
                closeOnEscape: !1,
                labelswidth: "30%",
                closeicon: [],
                navkeys: [!1, 38, 40],
                onClose: null,
                beforeShowForm: null,
                beforeInitData: null,
                viewPagerButtons: !0
            }, a.jgrid.view, c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function () {
                function e() {
                    (!0 === b[p.p.id].closeOnEscape || !0 === b[p.p.id].navkeys[0]) && setTimeout(function () {
                        a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(n.modalhead)).focus()
                    }, 0)
                }
                function h(b, d, e, f) {
                    var g, i, h, l = 0,
                        q, n, p = [],
                        o = !1,
                        m, u = "<td class='CaptionTD form-view-label ui-widget-content' width='" + c.labelswidth + "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>",
                        r = "",
                        v = ["integer", "number", "currency"],
                        s = 0,
                        t = 0,
                        x, w, A;
                    for (m = 1; m <= f; m++) r += 1 == m ? u : "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>";
                    a(d.p.colModel).each(function () {
                        i = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1;
                        !i && "right" === this.align && (this.formatter && -1 !== a.inArray(this.formatter, v) ? s = Math.max(s, parseInt(this.width, 10)) : t = Math.max(t, parseInt(this.width, 10)))
                    });
                    x = 0 !== s ? s : 0 !== t ? t : 0;
                    o = a(d).jqGrid("getInd", b);
                    a(d.p.colModel).each(function (b) {
                        g = this.name;
                        w = !1;
                        n = (i = this.editrules && !0 === this.editrules.edithidden ? !1 : !0 === this.hidden ? !0 : !1) ? "style='display:none'" : "";
                        A = "boolean" !== typeof this.viewable ? !0 : this.viewable;
                        if ("cb" !== g && "subgrid" !== g && "rn" !== g && A) {
                            q = !1 === o ? "" : g == d.p.ExpandColumn && !0 === d.p.treeGrid ? a("td:eq(" + b + ")", d.rows[o]).text() : a("td:eq(" + b + ")", d.rows[o]).html();
                            w = "right" === this.align && 0 !== x ? !0 : !1;
                            var c = a.extend({}, {
                                rowabove: !1,
                                rowcontent: ""
                            }, this.formoptions || {}),
                                k = parseInt(c.rowpos, 10) || l + 1,
                                m = parseInt(2 * (parseInt(c.colpos, 10) || 1), 10);
                            if (c.rowabove) {
                                var u = a("<tr><td class='contentinfo' colspan='" + 2 * f + "'>" + c.rowcontent + "</td></tr>");
                                a(e).append(u);
                                u[0].rp = k
                            }
                            h = a(e).find("tr[rowpos=" + k + "]");
                            0 === h.length && (h = a("<tr " + n + " rowpos='" + k + "'></tr>").addClass("FormData").attr("id", "trv_" + g), a(h).append(r), a(e).append(h), h[0].rp = k);
                            a("td:eq(" + (m - 2) + ")", h[0]).html("<b>" + (void 0 === c.label ? d.p.colNames[b] : c.label) + "</b>");
                            a("td:eq(" + (m - 1) + ")", h[0]).append("<span>" + q + "</span>").attr("id", "v_" + g);
                            w && a("td:eq(" + (m - 1) + ") span", h[0]).css({
                                "text-align": "right",
                                width: x + "px"
                            });
                            p[l] = b;
                            l++
                        }
                    });
                    0 < l && (b = a("<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" + (2 * f - 1) + "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" + b + "'/></td></tr>"), b[0].rp = l + 99, a(e).append(b));
                    return p
                }
                function s(b, c) {
                    var d, e, f = 0,
                        g, i;
                    if (i = a(c).jqGrid("getInd", b, !0)) a("td", i).each(function (b) {
                        d = c.p.colModel[b].name;
                        e = c.p.colModel[b].editrules && !0 === c.p.colModel[b].editrules.edithidden ? !1 : !0 === c.p.colModel[b].hidden ? !0 : !1;
                        "cb" !== d && "subgrid" !== d && "rn" !== d && (g = d == c.p.ExpandColumn && !0 === c.p.treeGrid ? a(this).text() : a(this).html(), a.extend({}, c.p.colModel[b].editoptions || {}), d = a.jgrid.jqID("v_" + d), a("#" + d + " span", "#" + m).html(g), e && a("#" + d, "#" + m).parents("tr:first").hide(), f++)
                    }), 0 < f && a("#id_g", "#" + m).val(b)
                }
                function t(b, c) {
                    var d = c[1].length - 1;
                    0 === b ? a("#pData", "#" + m + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b - 1] && a("#" + a.jgrid.jqID(c[1][b - 1])).hasClass("ui-state-disabled") ? a("#pData", m + "_2").addClass("ui-state-disabled") : a("#pData", "#" + m + "_2").removeClass("ui-state-disabled");
                    b == d ? a("#nData", "#" + m + "_2").addClass("ui-state-disabled") : void 0 !== c[1][b + 1] && a("#" + a.jgrid.jqID(c[1][b + 1])).hasClass("ui-state-disabled") ? a("#nData", m + "_2").addClass("ui-state-disabled") : a("#nData", "#" + m + "_2").removeClass("ui-state-disabled")
                }
                function r() {
                    var b = a(p).jqGrid("getDataIDs"),
                        c = a("#id_g", "#" + m).val();
                    return [a.inArray(c, b), b]
                }
                var p = this;
                if (p.grid && u) {
                    var f = p.p.id,
                        i = "ViewGrid_" + a.jgrid.jqID(f),
                        m = "ViewTbl_" + a.jgrid.jqID(f),
                        w = "ViewGrid_" + f,
                        d = "ViewTbl_" + f,
                        n = {
                            themodal: "viewmod" + f,
                            modalhead: "viewhd" + f,
                            modalcontent: "viewcnt" + f,
                            scrollelm: i
                        },
                        g = a.isFunction(b[p.p.id].beforeInitData) ? b[p.p.id].beforeInitData : !1,
                        o = !0,
                        l = 1,
                        q = 0;
                    if (void 0 !== a("#" + a.jgrid.jqID(n.themodal))[0]) {
                        g && (o = g.call(p, a("#" + i)), void 0 === o && (o = !0));
                        if (!1 === o) return;
                        a(".ui-jqdialog-title", "#" + a.jgrid.jqID(n.modalhead)).html(c.caption);
                        a("#FormError", "#" + m).hide();
                        s(u, p);
                        a.isFunction(b[p.p.id].beforeShowForm) && b[p.p.id].beforeShowForm.call(p, a("#" + i));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(n.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(f),
                            jqm: c.jqModal,
                            jqM: !1,
                            overlay: c.overlay,
                            modal: c.modal
                        });
                        e()
                    } else {
                        var x = isNaN(c.dataheight) ? c.dataheight : c.dataheight + "px",
                            A = isNaN(c.datawidth) ? c.datawidth : c.datawidth + "px",
                            w = a("<form name='FormPost' id='" + w + "' class='FormGrid' style='width:" + A + ";overflow:auto;position:relative;height:" + x + ";'></form>"),
                            v = a("<table id='" + d + "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>");
                        g && (o = g.call(p, a("#" + i)), void 0 === o && (o = !0));
                        if (!1 === o) return;
                        a(p.p.colModel).each(function () {
                            var a = this.formoptions;
                            l = Math.max(l, a ? a.colpos || 0 : 0);
                            q = Math.max(q, a ? a.rowpos || 0 : 0)
                        });
                        a(w).append(v);
                        h(u, p, v, l);
                        d = "rtl" == p.p.direction ? !0 : !1;
                        g = "<a href='javascript:void(0)' id='" + (d ? "nData" : "pData") + "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>";
                        o = "<a href='javascript:void(0)' id='" + (d ? "pData" : "nData") + "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>";
                        x = "<a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'>" + c.bClose + "</a>";
                        if (0 < q) {
                            var C = [];
                            a.each(a(v)[0].rows, function (a, b) {
                                C[a] = b
                            });
                            C.sort(function (a, b) {
                                return a.rp > b.rp ? 1 : a.rp < b.rp ? -1 : 0
                            });
                            a.each(C, function (b, c) {
                                a("tbody", v).append(c)
                            })
                        }
                        c.gbox = "#gbox_" + a.jgrid.jqID(f);
                        w = a("<div></div>").append(w).append("<table border='0' class='EditTable' id='" + m + "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" + c.labelswidth + "'>" + (d ? o + g : g + o) + "</td><td class='EditButton'>" + x + "</td></tr></tbody></table>");
                        a.jgrid.createModal(n, w, c, "#gview_" + a.jgrid.jqID(p.p.id), a("#gview_" + a.jgrid.jqID(p.p.id))[0]);
                        d && (a("#pData, #nData", "#" + m + "_2").css("float", "right"), a(".EditButton", "#" + m + "_2").css("text-align", "left"));
                        c.viewPagerButtons || a("#pData, #nData", "#" + m + "_2").hide();
                        w = null;
                        a("#" + n.themodal).keydown(function (d) {
                            if (d.which === 27) {
                                b[p.p.id].closeOnEscape && a.jgrid.hideModal("#" + a.jgrid.jqID(n.themodal), {
                                    gb: c.gbox,
                                    jqm: c.jqModal,
                                    onClose: c.onClose
                                });
                                return false
                            }
                            if (c.navkeys[0] === true) {
                                if (d.which === c.navkeys[1]) {
                                    a("#pData", "#" + m + "_2").trigger("click");
                                    return false
                                }
                                if (d.which === c.navkeys[2]) {
                                    a("#nData", "#" + m + "_2").trigger("click");
                                    return false
                                }
                            }
                        });
                        c.closeicon = a.extend([!0, "left", "ui-icon-close"], c.closeicon);
                        !0 === c.closeicon[0] && a("#cData", "#" + m + "_2").addClass("right" == c.closeicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.closeicon[2] + "'></span>");
                        a.isFunction(c.beforeShowForm) && c.beforeShowForm.call(p, a("#" + i));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(n.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(f),
                            jqm: c.jqModal,
                            overlay: c.overlay,
                            modal: c.modal
                        });
                        a(".fm-button:not(.ui-state-disabled)", "#" + m + "_2").hover(function () {
                            a(this).addClass("ui-state-hover")
                        }, function () {
                            a(this).removeClass("ui-state-hover")
                        });
                        e();
                        a("#cData", "#" + m + "_2").click(function () {
                            a.jgrid.hideModal("#" + a.jgrid.jqID(n.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(f),
                                jqm: c.jqModal,
                                onClose: c.onClose
                            });
                            return false
                        });
                        a("#nData", "#" + m + "_2").click(function () {
                            a("#FormError", "#" + m).hide();
                            var b = r();
                            b[0] = parseInt(b[0], 10);
                            if (b[0] != -1 && b[1][b[0] + 1]) {
                                a.isFunction(c.onclickPgButtons) && c.onclickPgButtons.call(p, "next", a("#" + i), b[1][b[0]]);
                                s(b[1][b[0] + 1], p);
                                a(p).jqGrid("setSelection", b[1][b[0] + 1]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(p, "next", a("#" + i), b[1][b[0] + 1]);
                                t(b[0] + 1, b)
                            }
                            e();
                            return false
                        });
                        a("#pData", "#" + m + "_2").click(function () {
                            a("#FormError", "#" + m).hide();
                            var b = r();
                            if (b[0] != -1 && b[1][b[0] - 1]) {
                                a.isFunction(c.onclickPgButtons) && c.onclickPgButtons.call(p, "prev", a("#" + i), b[1][b[0]]);
                                s(b[1][b[0] - 1], p);
                                a(p).jqGrid("setSelection", b[1][b[0] - 1]);
                                a.isFunction(c.afterclickPgButtons) && c.afterclickPgButtons.call(p, "prev", a("#" + i), b[1][b[0] - 1]);
                                t(b[0] - 1, b)
                            }
                            e();
                            return false
                        })
                    }
                    w = r();
                    t(w[0], w)
                }
            })
        },
        delGridRow: function (u, c) {
            c = a.extend(!0, {
                top: 0,
                left: 0,
                width: 240,
                height: "auto",
                dataheight: "auto",
                modal: !1,
                overlay: 30,
                drag: !0,
                resize: !0,
                url: "",
                mtype: "POST",
                reloadAfterSubmit: !0,
                beforeShowForm: null,
                beforeInitData: null,
                afterShowForm: null,
                beforeSubmit: null,
                onclickSubmit: null,
                afterSubmit: null,
                jqModal: !0,
                closeOnEscape: !1,
                delData: {},
                delicon: [],
                cancelicon: [],
                onClose: null,
                ajaxDelOptions: {},
                processing: !1,
                serializeDelData: null,
                useDataProxy: !1
            }, a.jgrid.del, c || {});
            b[a(this)[0].p.id] = c;
            return this.each(function () {
                var e = this;
                if (e.grid && u) {
                    var h = a.isFunction(b[e.p.id].beforeShowForm),
                        s = a.isFunction(b[e.p.id].afterShowForm),
                        t = a.isFunction(b[e.p.id].beforeInitData) ? b[e.p.id].beforeInitData : !1,
                        r = e.p.id,
                        p = {},
                        f = !0,
                        i = "DelTbl_" + a.jgrid.jqID(r),
                        m, w, d, n, g = "DelTbl_" + r,
                        o = {
                            themodal: "delmod" + r,
                            modalhead: "delhd" + r,
                            modalcontent: "delcnt" + r,
                            scrollelm: i
                        };
                    a.isArray(u) && (u = u.join());
                    if (void 0 !== a("#" + a.jgrid.jqID(o.themodal))[0]) {
                        t && (f = t.call(e, a("#" + i)), void 0 === f && (f = !0));
                        if (!1 === f) return;
                        a("#DelData>td", "#" + i).text(u);
                        a("#DelError", "#" + i).hide();
                        !0 === b[e.p.id].processing && (b[e.p.id].processing = !1, a("#dData", "#" + i).removeClass("ui-state-active"));
                        h && b[e.p.id].beforeShowForm.call(e, a("#" + i));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(o.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(r),
                            jqm: b[e.p.id].jqModal,
                            jqM: !1,
                            overlay: b[e.p.id].overlay,
                            modal: b[e.p.id].modal
                        })
                    } else {
                        var l = isNaN(b[e.p.id].dataheight) ? b[e.p.id].dataheight : b[e.p.id].dataheight + "px",
                            q = isNaN(c.datawidth) ? c.datawidth : c.datawidth + "px",
                            g = "<div id='" + g + "' class='formdata' style='width:" + q + ";overflow:auto;position:relative;height:" + l + ";'><table class='DelTable'><tbody><tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>" + ("<tr id='DelData' style='display:none'><td >" + u + "</td></tr>"),
                            g = g + ('<tr><td class="delmsg" style="white-space:pre;">' + b[e.p.id].msg + "</td></tr><tr><td >&#160;</td></tr>"),
                            g = g + "</tbody></table></div>" + ("<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" + i + "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" + ("<a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'>" + c.bSubmit + "</a>") + "&#160;" + ("<a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'>" + c.bCancel + "</a>") + "</td></tr></tbody></table>");
                        c.gbox = "#gbox_" + a.jgrid.jqID(r);
                        a.jgrid.createModal(o, g, c, "#gview_" + a.jgrid.jqID(e.p.id), a("#gview_" + a.jgrid.jqID(e.p.id))[0]);
                        t && (f = t.call(e, a("#" + i)), void 0 === f && (f = !0));
                        if (!1 === f) return;
                        a(".fm-button", "#" + i + "_2").hover(function () {
                            a(this).addClass("ui-state-hover")
                        }, function () {
                            a(this).removeClass("ui-state-hover")
                        });
                        c.delicon = a.extend([!0, "left", "ui-icon-scissors"], b[e.p.id].delicon);
                        c.cancelicon = a.extend([!0, "left", "ui-icon-cancel"], b[e.p.id].cancelicon);
                        !0 === c.delicon[0] && a("#dData", "#" + i + "_2").addClass("right" == c.delicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.delicon[2] + "'></span>");
                        !0 === c.cancelicon[0] && a("#eData", "#" + i + "_2").addClass("right" == c.cancelicon[1] ? "fm-button-icon-right" : "fm-button-icon-left").append("<span class='ui-icon " + c.cancelicon[2] + "'></span>");
                        a("#dData", "#" + i + "_2").click(function () {
                            var f = [true, ""],
                                g, h = a("#DelData>td", "#" + i).text();
                            p = {};
                            a.isFunction(b[e.p.id].onclickSubmit) && (p = b[e.p.id].onclickSubmit.call(e, b[e.p.id], h) || {});
                            a.isFunction(b[e.p.id].beforeSubmit) && (f = b[e.p.id].beforeSubmit.call(e, h));
                            if (f[0] && !b[e.p.id].processing) {
                                b[e.p.id].processing = true;
                                d = e.p.prmNames;
                                m = a.extend({}, b[e.p.id].delData, p);
                                n = d.oper;
                                m[n] = d.deloper;
                                w = d.id;
                                h = ("" + h).split(",");
                                if (!h.length) return false;
                                for (g in h) h.hasOwnProperty(g) && (h[g] = a.jgrid.stripPref(e.p.idPrefix, h[g]));
                                m[w] = h.join();
                                a(this).addClass("ui-state-active");
                                g = a.extend({
                                    url: b[e.p.id].url || a(e).jqGrid("getGridParam", "editurl"),
                                    type: b[e.p.id].mtype,
                                    data: a.isFunction(b[e.p.id].serializeDelData) ? b[e.p.id].serializeDelData.call(e, m) : m,
                                    complete: function (d, g) {
                                        var l;
                                        if (g != "success") {
                                            f[0] = false;
                                            f[1] = a.isFunction(b[e.p.id].errorTextFormat) ? b[e.p.id].errorTextFormat.call(e, d) : g + " Status: '" + d.statusText + "'. Error code: " + d.status
                                        } else a.isFunction(b[e.p.id].afterSubmit) && (f = b[e.p.id].afterSubmit.call(e, d, m));
                                        if (f[0] === false) {
                                            a("#DelError>td", "#" + i).html(f[1]);
                                            a("#DelError", "#" + i).show()
                                        } else {
                                            if (b[e.p.id].reloadAfterSubmit && e.p.datatype != "local") a(e).trigger("reloadGrid");
                                            else {
                                                if (e.p.treeGrid === true) try {
                                                    a(e).jqGrid("delTreeNode", e.p.idPrefix + h[0])
                                                } catch (q) { } else for (l = 0; l < h.length; l++) a(e).jqGrid("delRowData", e.p.idPrefix + h[l]);
                                                e.p.selrow = null;
                                                e.p.selarrrow = []
                                            }
                                            a.isFunction(b[e.p.id].afterComplete) && setTimeout(function () {
                                                b[e.p.id].afterComplete.call(e, d, h)
                                            }, 500)
                                        }
                                        b[e.p.id].processing = false;
                                        a("#dData", "#" + i + "_2").removeClass("ui-state-active");
                                        f[0] && a.jgrid.hideModal("#" + a.jgrid.jqID(o.themodal), {
                                            gb: "#gbox_" + a.jgrid.jqID(r),
                                            jqm: c.jqModal,
                                            onClose: b[e.p.id].onClose
                                        })
                                    }
                                }, a.jgrid.ajaxOptions, b[e.p.id].ajaxDelOptions);
                                if (!g.url && !b[e.p.id].useDataProxy) if (a.isFunction(e.p.dataProxy)) b[e.p.id].useDataProxy = true;
                                else {
                                    f[0] = false;
                                    f[1] = f[1] + (" " + a.jgrid.errors.nourl)
                                }
                                if (f[0]) if (b[e.p.id].useDataProxy) {
                                    g = e.p.dataProxy.call(e, g, "del_" + e.p.id);
                                    g === void 0 && (g = [true, ""]);
                                    if (g[0] === false) {
                                        f[0] = false;
                                        f[1] = g[1] || "Error deleting the selected row!"
                                    } else a.jgrid.hideModal("#" + a.jgrid.jqID(o.themodal), {
                                        gb: "#gbox_" + a.jgrid.jqID(r),
                                        jqm: c.jqModal,
                                        onClose: b[e.p.id].onClose
                                    })
                                } else a.ajax(g)
                            }
                            if (f[0] === false) {
                                a("#DelError>td", "#" + i).html(f[1]);
                                a("#DelError", "#" + i).show()
                            }
                            return false
                        });
                        a("#eData", "#" + i + "_2").click(function () {
                            a.jgrid.hideModal("#" + a.jgrid.jqID(o.themodal), {
                                gb: "#gbox_" + a.jgrid.jqID(r),
                                jqm: b[e.p.id].jqModal,
                                onClose: b[e.p.id].onClose
                            });
                            return false
                        });
                        h && b[e.p.id].beforeShowForm.call(e, a("#" + i));
                        a.jgrid.viewModal("#" + a.jgrid.jqID(o.themodal), {
                            gbox: "#gbox_" + a.jgrid.jqID(r),
                            jqm: b[e.p.id].jqModal,
                            overlay: b[e.p.id].overlay,
                            modal: b[e.p.id].modal
                        })
                    }
                    s && b[e.p.id].afterShowForm.call(e, a("#" + i));
                    !0 === b[e.p.id].closeOnEscape && setTimeout(function () {
                        a(".ui-jqdialog-titlebar-close", "#" + a.jgrid.jqID(o.modalhead)).focus()
                    }, 0)
                }
            })
        },
        navGrid: function (b, c, e, h, s, t, r) {
            c = a.extend({
                edit: !0,
                editicon: "ui-icon-pencil",
                add: !0,
                addicon: "ui-icon-plus",
                del: !0,
                delicon: "ui-icon-trash",
                search: !0,
                searchicon: "ui-icon-search",
                refresh: !0,
                refreshicon: "ui-icon-refresh",
                refreshstate: "firstpage",
                view: !1,
                viewicon: "ui-icon-document",
                position: "left",
                closeOnEscape: !0,
                beforeRefresh: null,
                afterRefresh: null,
                cloneToTop: !1,
                alertwidth: 200,
                alertheight: "auto",
                alerttop: null,
                alertleft: null,
                alertzIndex: null
            }, a.jgrid.nav, c || {});
            return this.each(function () {
                if (!this.nav) {
                    var p = {
                        themodal: "alertmod_" + this.p.id,
                        modalhead: "alerthd_" + this.p.id,
                        modalcontent: "alertcnt_" + this.p.id
                    },
                        f = this,
                        i;
                    if (f.grid && "string" === typeof b) {
                        void 0 === a("#" + p.themodal)[0] && (!c.alerttop && !c.alertleft && (void 0 !== window.innerWidth ? (c.alertleft = window.innerWidth, c.alerttop = window.innerHeight) : void 0 !== document.documentElement && void 0 !== document.documentElement.clientWidth && 0 !== document.documentElement.clientWidth ? (c.alertleft = document.documentElement.clientWidth, c.alerttop = document.documentElement.clientHeight) : (c.alertleft = 1024, c.alerttop = 768), c.alertleft = c.alertleft / 2 - parseInt(c.alertwidth, 10) / 2, c.alerttop = c.alerttop / 2 - 25), a.jgrid.createModal(p, "<div>" + c.alerttext + "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>", {
                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                            jqModal: !0,
                            drag: !0,
                            resize: !0,
                            caption: c.alertcap,
                            top: c.alerttop,
                            left: c.alertleft,
                            width: c.alertwidth,
                            height: c.alertheight,
                            closeOnEscape: c.closeOnEscape,
                            zIndex: c.alertzIndex
                        }, "#gview_" + a.jgrid.jqID(f.p.id), a("#gbox_" + a.jgrid.jqID(f.p.id))[0], !0));
                        var m = 1,
                            w, d = function () {
                                a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                            },
                            n = function () {
                                a(this).removeClass("ui-state-hover")
                            };
                        c.cloneToTop && f.p.toppager && (m = 2);
                        for (w = 0; w < m; w++) {
                            var g = a("<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"),
                                o, l;
                            0 === w ? (o = b, l = f.p.id, o == f.p.toppager && (l += "_top", m = 1)) : (o = f.p.toppager, l = f.p.id + "_top");
                            "rtl" == f.p.direction && a(g).attr("dir", "rtl").css("float", "right");
                            c.add && (h = h || {}, i = a("<td class='ui-pg-button ui-corner-all'></td>"), a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.addicon + "'></span>" + c.addtext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.addtitle || "",
                                id: h.id || "add_" + l
                            }).click(function () {
                                a(this).hasClass("ui-state-disabled") || (a.isFunction(c.addfunc) ? c.addfunc.call(f) : a(f).jqGrid("editGridRow", "new", h));
                                return false
                            }).hover(d, n), i = null);
                            c.edit && (i = a("<td class='ui-pg-button ui-corner-all'></td>"), e = e || {}, a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.editicon + "'></span>" + c.edittext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.edittitle || "",
                                id: e.id || "edit_" + l
                            }).click(function () {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b = f.p.selrow;
                                    if (b) a.isFunction(c.editfunc) ? c.editfunc.call(f, b) : a(f).jqGrid("editGridRow", b, e);
                                    else {
                                        a.jgrid.viewModal("#" + p.themodal, {
                                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                            jqm: true
                                        });
                                        a("#jqg_alrt").focus()
                                    }
                                }
                                return false
                            }).hover(d, n), i = null);
                            c.view && (i = a("<td class='ui-pg-button ui-corner-all'></td>"), r = r || {}, a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.viewicon + "'></span>" + c.viewtext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.viewtitle || "",
                                id: r.id || "view_" + l
                            }).click(function () {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b = f.p.selrow;
                                    if (b) a.isFunction(c.viewfunc) ? c.viewfunc.call(f, b) : a(f).jqGrid("viewGridRow", b, r);
                                    else {
                                        a.jgrid.viewModal("#" + p.themodal, {
                                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                            jqm: true
                                        });
                                        a("#jqg_alrt").focus()
                                    }
                                }
                                return false
                            }).hover(d, n), i = null);
                            c.del && (i = a("<td class='ui-pg-button ui-corner-all'></td>"), s = s || {}, a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.delicon + "'></span>" + c.deltext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.deltitle || "",
                                id: s.id || "del_" + l
                            }).click(function () {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    var b;
                                    if (f.p.multiselect) {
                                        b = f.p.selarrrow;
                                        b.length === 0 && (b = null)
                                    } else b = f.p.selrow;
                                    if (b) a.isFunction(c.delfunc) ? c.delfunc.call(f, b) : a(f).jqGrid("delGridRow", b, s);
                                    else {
                                        a.jgrid.viewModal("#" + p.themodal, {
                                            gbox: "#gbox_" + a.jgrid.jqID(f.p.id),
                                            jqm: true
                                        });
                                        a("#jqg_alrt").focus()
                                    }
                                }
                                return false
                            }).hover(d, n), i = null);
                            (c.add || c.edit || c.del || c.view) && a("tr", g).append("<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>");
                            c.search && (i = a("<td class='ui-pg-button ui-corner-all'></td>"), t = t || {}, a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.searchicon + "'></span>" + c.searchtext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.searchtitle || "",
                                id: t.id || "search_" + l
                            }).click(function () {
                                a(this).hasClass("ui-state-disabled") || (a.isFunction(c.searchfunc) ? c.searchfunc.call(f, t) : a(f).jqGrid("searchGrid", t));
                                return false
                            }).hover(d, n), t.showOnLoad && !0 === t.showOnLoad && a(i, g).click(), i = null);
                            c.refresh && (i = a("<td class='ui-pg-button ui-corner-all'></td>"), a(i).append("<div class='ui-pg-div'><span class='ui-icon " + c.refreshicon + "'></span>" + c.refreshtext + "</div>"), a("tr", g).append(i), a(i, g).attr({
                                title: c.refreshtitle || "",
                                id: "refresh_" + l
                            }).click(function () {
                                if (!a(this).hasClass("ui-state-disabled")) {
                                    a.isFunction(c.beforeRefresh) && c.beforeRefresh.call(f);
                                    f.p.search = false;
                                    try {
                                        var b = f.p.id;
                                        f.p.postData.filters = "";
                                        a("#fbox_" + a.jgrid.jqID(b)).jqFilter("resetFilter");
                                        a.isFunction(f.clearToolbar) && f.clearToolbar.call(f, false)
                                    } catch (d) { }
                                    switch (c.refreshstate) {
                                        case "firstpage":
                                            a(f).trigger("reloadGrid", [{
                                                page: 1
                                            }]);
                                            break;
                                        case "current":
                                            a(f).trigger("reloadGrid", [{
                                                current: true
                                            }])
                                    }
                                    a.isFunction(c.afterRefresh) && c.afterRefresh.call(f)
                                }
                                return false
                            }).hover(d, n), i = null);
                            i = a(".ui-jqgrid").css("font-size") || "11px";
                            a("body").append("<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + i + ";visibility:hidden;' ></div>");
                            i = a(g).clone().appendTo("#testpg2").width();
                            a("#testpg2").remove();
                            a(o + "_" + c.position, o).append(g);
                            f.p._nvtd && (i > f.p._nvtd[0] && (a(o + "_" + c.position, o).width(i), f.p._nvtd[0] = i), f.p._nvtd[1] = i);
                            g = i = i = null;
                            this.nav = !0
                        }
                    }
                }
            })
        },
        navButtonAdd: function (b, c) {
            c = a.extend({
                caption: "newButton",
                title: "",
                buttonicon: "ui-icon-newwin",
                onClickButton: null,
                position: "last",
                cursor: "pointer"
            }, c || {});
            return this.each(function () {
                if (this.grid) {
                    "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                    var e = a(".navtable", b)[0],
                        h = this;
                    if (e && !(c.id && void 0 !== a("#" + a.jgrid.jqID(c.id), e)[0])) {
                        var s = a("<td></td>");
                        "NONE" == c.buttonicon.toString().toUpperCase() ? a(s).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'>" + c.caption + "</div>") : a(s).addClass("ui-pg-button ui-corner-all").append("<div class='ui-pg-div'><span class='ui-icon " + c.buttonicon + "'></span>" + c.caption + "</div>");
                        c.id && a(s).attr("id", c.id);
                        "first" == c.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(s) : a("tr td:eq(0)", e).before(s) : a("tr", e).append(s);
                        a(s, e).attr("title", c.title || "").click(function (b) {
                            a(this).hasClass("ui-state-disabled") || a.isFunction(c.onClickButton) && c.onClickButton.call(h, b);
                            return !1
                        }).hover(function () {
                            a(this).hasClass("ui-state-disabled") || a(this).addClass("ui-state-hover")
                        }, function () {
                            a(this).removeClass("ui-state-hover")
                        })
                    }
                }
            })
        },
        navSeparatorAdd: function (b, c) {
            c = a.extend({
                sepclass: "ui-separator",
                sepcontent: "",
                position: "last"
            }, c || {});
            return this.each(function () {
                if (this.grid) {
                    "string" === typeof b && 0 !== b.indexOf("#") && (b = "#" + a.jgrid.jqID(b));
                    var e = a(".navtable", b)[0];
                    if (e) {
                        var h = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" + c.sepclass + "'></span>" + c.sepcontent + "</td>";
                        "first" === c.position ? 0 === e.rows[0].cells.length ? a("tr", e).append(h) : a("tr td:eq(0)", e).before(h) : a("tr", e).append(h)
                    }
                }
            })
        },
        GridToForm: function (b, c) {
            return this.each(function () {
                var e = this,
                    h;
                if (e.grid) {
                    var s = a(e).jqGrid("getRowData", b);
                    if (s) for (h in s) s.hasOwnProperty(h) && (a("[name=" + a.jgrid.jqID(h) + "]", c).is("input:radio") || a("[name=" + a.jgrid.jqID(h) + "]", c).is("input:checkbox") ? a("[name=" + a.jgrid.jqID(h) + "]", c).each(function () {
                        if (a(this).val() == s[h]) a(this)[e.p.useProp ? "prop" : "attr"]("checked", !0);
                        else a(this)[e.p.useProp ? "prop" : "attr"]("checked", !1)
                    }) : a("[name=" + a.jgrid.jqID(h) + "]", c).val(s[h]))
                }
            })
        },
        FormToGrid: function (b, c, e, h) {
            return this.each(function () {
                if (this.grid) {
                    e || (e = "set");
                    h || (h = "first");
                    var s = a(c).serializeArray(),
                        t = {};
                    a.each(s, function (a, b) {
                        t[b.name] = b.value
                    });
                    "add" == e ? a(this).jqGrid("addRowData", b, t, h) : "set" == e && a(this).jqGrid("setRowData", b, t)
                }
            })
        }
    })
})(jQuery);
(function (a) {
    a.fn.jqFilter = function (d) {
        if ("string" === typeof d) {
            var n = a.fn.jqFilter[d];
            if (!n) throw "jqFilter - No such method: " + d;
            var u = a.makeArray(arguments).slice(1);
            return n.apply(this, u)
        }
        var p = a.extend(!0, {
            filter: null,
            columns: [],
            onChange: null,
            afterRedraw: null,
            checkValues: null,
            error: !1,
            errmsg: "",
            errorcheck: !0,
            showQuery: !0,
            sopt: null,
            ops: [{
                name: "eq",
                description: "equal",
                operator: "="
            }, {
                name: "ne",
                description: "not equal",
                operator: "<>"
            }, {
                name: "lt",
                description: "less",
                operator: "<"
            }, {
                name: "le",
                description: "less or equal",
                operator: "<="
            }, {
                name: "gt",
                description: "greater",
                operator: ">"
            }, {
                name: "ge",
                description: "greater or equal",
                operator: ">="
            }, {
                name: "bw",
                description: "begins with",
                operator: "LIKE"
            }, {
                name: "bn",
                description: "does not begin with",
                operator: "NOT LIKE"
            }, {
                name: "in",
                description: "in",
                operator: "IN"
            }, {
                name: "ni",
                description: "not in",
                operator: "NOT IN"
            }, {
                name: "ew",
                description: "ends with",
                operator: "LIKE"
            }, {
                name: "en",
                description: "does not end with",
                operator: "NOT LIKE"
            }, {
                name: "cn",
                description: "contains",
                operator: "LIKE"
            }, {
                name: "nc",
                description: "does not contain",
                operator: "NOT LIKE"
            }, {
                name: "nu",
                description: "is null",
                operator: "IS NULL"
            }, {
                name: "nn",
                description: "is not null",
                operator: "IS NOT NULL"
            }],
            numopts: "eq,ne,lt,le,gt,ge,nu,nn,in,ni".split(","),
            stropts: "eq,ne,bw,bn,ew,en,cn,nc,nu,nn,in,ni".split(","),
            strarr: ["text", "string", "blob"],
            _gridsopt: [],
            groupOps: [{
                op: "AND",
                text: "AND"
            }, {
                op: "OR",
                text: "OR"
            }],
            groupButton: !0,
            ruleButtons: !0,
            direction: "ltr"
        }, a.jgrid.filter, d || {});
        return this.each(function () {
            if (!this.filter) {
                this.p = p;
                if (null === this.p.filter || void 0 === this.p.filter) this.p.filter = {
                    groupOp: this.p.groupOps[0].op,
                    rules: [],
                    groups: []
                };
                var d, n = this.p.columns.length,
                    f, t = /msie/i.test(navigator.userAgent) && !window.opera;
                if (this.p._gridsopt.length) for (d = 0; d < this.p._gridsopt.length; d++) this.p.ops[d].description = this.p._gridsopt[d];
                this.p.initFilter = a.extend(!0, {}, this.p.filter);
                if (n) {
                    for (d = 0; d < n; d++) if (f = this.p.columns[d], f.stype ? f.inputtype = f.stype : f.inputtype || (f.inputtype = "text"), f.sorttype ? f.searchtype = f.sorttype : f.searchtype || (f.searchtype = "string"), void 0 === f.hidden && (f.hidden = !1), f.label || (f.label = f.name), f.index && (f.name = f.index), f.hasOwnProperty("searchoptions") || (f.searchoptions = {}), !f.hasOwnProperty("searchrules")) f.searchrules = {};
                    this.p.showQuery && a(this).append("<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" + this.p.direction + "'><tbody><tr><td class='query'></td></tr></tbody></table>");
                    var r = function (g, k) {
                        var b = [!0, ""];
                        if (a.isFunction(k.searchrules)) b = k.searchrules(g, k);
                        else if (a.jgrid && a.jgrid.checkValues) try {
                            b = a.jgrid.checkValues(g, -1, null, k.searchrules, k.label)
                        } catch (c) { }
                        b && b.length && !1 === b[0] && (p.error = !b[0], p.errmsg = b[1])
                    };
                    this.onchange = function () {
                        this.p.error = !1;
                        this.p.errmsg = "";
                        return a.isFunction(this.p.onChange) ? this.p.onChange.call(this, this.p) : !1
                    };
                    this.reDraw = function () {
                        a("table.group:first", this).remove();
                        var g = this.createTableForGroup(p.filter, null);
                        a(this).append(g);
                        a.isFunction(this.p.afterRedraw) && this.p.afterRedraw.call(this, this.p)
                    };
                    this.createTableForGroup = function (g, k) {
                        var b = this,
                            c, e = a("<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"),
                            d = "left";
                        "rtl" == this.p.direction && (d = "right", e.attr("dir", "rtl"));
                        null === k && e.append("<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" + d + "'></th></tr>");
                        var h = a("<tr></tr>");
                        e.append(h);
                        d = a("<th colspan='5' align='" + d + "'></th>");
                        h.append(d);
                        if (!0 === this.p.ruleButtons) {
                            var i = a("<select class='opsel'></select>");
                            d.append(i);
                            var h = "",
                                f;
                            for (c = 0; c < p.groupOps.length; c++) f = g.groupOp === b.p.groupOps[c].op ? " selected='selected'" : "", h += "<option value='" + b.p.groupOps[c].op + "'" + f + ">" + b.p.groupOps[c].text + "</option>";
                            i.append(h).bind("change", function () {
                                g.groupOp = a(i).val();
                                b.onchange()
                            })
                        }
                        h = "<span></span>";
                        this.p.groupButton && (h = a("<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"), h.bind("click", function () {
                            if (g.groups === void 0) g.groups = [];
                            g.groups.push({
                                groupOp: p.groupOps[0].op,
                                rules: [],
                                groups: []
                            });
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        d.append(h);
                        if (!0 === this.p.ruleButtons) {
                            var h = a("<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"),
                                l;
                            h.bind("click", function () {
                                if (g.rules === void 0) g.rules = [];
                                for (c = 0; c < b.p.columns.length; c++) {
                                    var e = b.p.columns[c].search === void 0 ? true : b.p.columns[c].search,
                                        d = b.p.columns[c].hidden === true;
                                    if (b.p.columns[c].searchoptions.searchhidden === true && e || e && !d) {
                                        l = b.p.columns[c];
                                        break
                                    }
                                }
                                e = l.searchoptions.sopt ? l.searchoptions.sopt : b.p.sopt ? b.p.sopt : a.inArray(l.searchtype, b.p.strarr) !== -1 ? b.p.stropts : b.p.numopts;
                                g.rules.push({
                                    field: l.name,
                                    op: e[0],
                                    data: ""
                                });
                                b.reDraw();
                                return false
                            });
                            d.append(h)
                        }
                        null !== k && (h = a("<input type='button' value='-' title='Delete group' class='delete-group'/>"), d.append(h), h.bind("click", function () {
                            for (c = 0; c < k.groups.length; c++) if (k.groups[c] === g) {
                                k.groups.splice(c, 1);
                                break
                            }
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        if (void 0 !== g.groups) for (c = 0; c < g.groups.length; c++) d = a("<tr></tr>"), e.append(d), h = a("<td class='first'></td>"), d.append(h), h = a("<td colspan='4'></td>"), h.append(this.createTableForGroup(g.groups[c], g)), d.append(h);
                        void 0 === g.groupOp && (g.groupOp = b.p.groupOps[0].op);
                        if (void 0 !== g.rules) for (c = 0; c < g.rules.length; c++) e.append(this.createTableRowForRule(g.rules[c], g));
                        return e
                    };
                    this.createTableRowForRule = function (g, d) {
                        var b = this,
                            c = a("<tr></tr>"),
                            e, f, h, i, j = "",
                            l;
                        c.append("<td class='first'></td>");
                        var m = a("<td class='columns'></td>");
                        c.append(m);
                        var n = a("<select></select>"),
                            o, q = [];
                        m.append(n);
                        n.bind("change", function () {
                            g.field = a(n).val();
                            h = a(this).parents("tr:first");
                            for (e = 0; e < b.p.columns.length; e++) if (b.p.columns[e].name === g.field) {
                                i = b.p.columns[e];
                                break
                            }
                            if (i) {
                                i.searchoptions.id = a.jgrid.randId();
                                t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                                var c = a.jgrid.createEl(i.inputtype, i.searchoptions, "", !0, b.p.ajaxSelectOptions, !0);
                                a(c).addClass("input-elm");
                                f = i.searchoptions.sopt ? i.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(i.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                                var d = "",
                                    k = 0;
                                q = [];
                                a.each(b.p.ops, function () {
                                    q.push(this.name)
                                });
                                for (e = 0; e < f.length; e++) o = a.inArray(f[e], q), -1 !== o && (0 === k && (g.op = b.p.ops[o].name), d += "<option value='" + b.p.ops[o].name + "'>" + b.p.ops[o].description + "</option>", k++);
                                a(".selectopts", h).empty().append(d);
                                a(".selectopts", h)[0].selectedIndex = 0;
                                a.jgrid.msie && 9 > a.jgrid.msiever() && (d = parseInt(a("select.selectopts", h)[0].offsetWidth, 10) + 1, a(".selectopts", h).width(d), a(".selectopts", h).css("width", "auto"));
                                a(".data", h).empty().append(c);
                                a.jgrid.bindEv(c, i.searchoptions, b);
                                a(".input-elm", h).bind("change", function (c) {
                                    var e = a(this).hasClass("ui-autocomplete-input") ? 200 : 0;
                                    setTimeout(function () {
                                        var e = c.target;
                                        g.data = e.nodeName.toUpperCase() === "SPAN" && i.searchoptions && a.isFunction(i.searchoptions.custom_value) ? i.searchoptions.custom_value(a(e).children(".customelement:first"), "get") : e.value;
                                        b.onchange()
                                    }, e)
                                });
                                setTimeout(function () {
                                    g.data = a(c).val();
                                    b.onchange()
                                }, 0)
                            }
                        });
                        for (e = m = 0; e < b.p.columns.length; e++) {
                            l = void 0 === b.p.columns[e].search ? !0 : b.p.columns[e].search;
                            var r = !0 === b.p.columns[e].hidden;
                            if (!0 === b.p.columns[e].searchoptions.searchhidden && l || l && !r) l = "", g.field === b.p.columns[e].name && (l = " selected='selected'", m = e), j += "<option value='" + b.p.columns[e].name + "'" + l + ">" + b.p.columns[e].label + "</option>"
                        }
                        n.append(j);
                        j = a("<td class='operators'></td>");
                        c.append(j);
                        i = p.columns[m];
                        i.searchoptions.id = a.jgrid.randId();
                        t && "text" === i.inputtype && !i.searchoptions.size && (i.searchoptions.size = 10);
                        m = a.jgrid.createEl(i.inputtype, i.searchoptions, g.data, !0, b.p.ajaxSelectOptions, !0);
                        if ("nu" == g.op || "nn" == g.op) a(m).attr("readonly", "true"), a(m).attr("disabled", "true");
                        var s = a("<select class='selectopts'></select>");
                        j.append(s);
                        s.bind("change", function () {
                            g.op = a(s).val();
                            h = a(this).parents("tr:first");
                            var c = a(".input-elm", h)[0];
                            if (g.op === "nu" || g.op === "nn") {
                                g.data = "";
                                c.value = "";
                                c.setAttribute("readonly", "true");
                                c.setAttribute("disabled", "true")
                            } else {
                                c.removeAttribute("readonly");
                                c.removeAttribute("disabled")
                            }
                            b.onchange()
                        });
                        f = i.searchoptions.sopt ? i.searchoptions.sopt : b.p.sopt ? b.p.sopt : -1 !== a.inArray(i.searchtype, b.p.strarr) ? b.p.stropts : b.p.numopts;
                        j = "";
                        a.each(b.p.ops, function () {
                            q.push(this.name)
                        });
                        for (e = 0; e < f.length; e++) o = a.inArray(f[e], q), -1 !== o && (l = g.op === b.p.ops[o].name ? " selected='selected'" : "", j += "<option value='" + b.p.ops[o].name + "'" + l + ">" + b.p.ops[o].description + "</option>");
                        s.append(j);
                        j = a("<td class='data'></td>");
                        c.append(j);
                        j.append(m);
                        a.jgrid.bindEv(m, i.searchoptions, b);
                        a(m).addClass("input-elm").bind("change", function () {
                            g.data = i.inputtype === "custom" ? i.searchoptions.custom_value(a(this).children(".customelement:first"), "get") : a(this).val();
                            b.onchange()
                        });
                        j = a("<td></td>");
                        c.append(j);
                        !0 === this.p.ruleButtons && (m = a("<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"), j.append(m), m.bind("click", function () {
                            for (e = 0; e < d.rules.length; e++) if (d.rules[e] === g) {
                                d.rules.splice(e, 1);
                                break
                            }
                            b.reDraw();
                            b.onchange();
                            return false
                        }));
                        return c
                    };
                    this.getStringForGroup = function (a) {
                        var d = "(",
                            b;
                        if (void 0 !== a.groups) for (b = 0; b < a.groups.length; b++) {
                            1 < d.length && (d += " " + a.groupOp + " ");
                            try {
                                d += this.getStringForGroup(a.groups[b])
                            } catch (c) {
                                alert(c)
                            }
                        }
                        if (void 0 !== a.rules) try {
                            for (b = 0; b < a.rules.length; b++) 1 < d.length && (d += " " + a.groupOp + " "), d += this.getStringForRule(a.rules[b])
                        } catch (e) {
                            alert(e)
                        }
                        d += ")";
                        return "()" === d ? "" : d
                    };
                    this.getStringForRule = function (d) {
                        var f = "",
                            b = "",
                            c, e;
                        for (c = 0; c < this.p.ops.length; c++) if (this.p.ops[c].name === d.op) {
                            f = this.p.ops[c].operator;
                            b = this.p.ops[c].name;
                            break
                        }
                        for (c = 0; c < this.p.columns.length; c++) if (this.p.columns[c].name === d.field) {
                            e = this.p.columns[c];
                            break
                        }
                        if (null == e) return "";
                        c = d.data;
                        if ("bw" === b || "bn" === b) c += "%";
                        if ("ew" === b || "en" === b) c = "%" + c;
                        if ("cn" === b || "nc" === b) c = "%" + c + "%";
                        if ("in" === b || "ni" === b) c = " (" + c + ")";
                        p.errorcheck && r(d.data, e);
                        return -1 !== a.inArray(e.searchtype, ["int", "integer", "float", "number", "currency"]) || "nn" === b || "nu" === b ? d.field + " " + f + " " + c : d.field + " " + f + ' "' + c + '"'
                    };
                    this.resetFilter = function () {
                        this.p.filter = a.extend(!0, {}, this.p.initFilter);
                        this.reDraw();
                        this.onchange()
                    };
                    this.hideError = function () {
                        a("th.ui-state-error", this).html("");
                        a("tr.error", this).hide()
                    };
                    this.showError = function () {
                        a("th.ui-state-error", this).html(this.p.errmsg);
                        a("tr.error", this).show()
                    };
                    this.toUserFriendlyString = function () {
                        return this.getStringForGroup(p.filter)
                    };
                    this.toString = function () {
                        function a(b) {
                            var c = "(",
                                e;
                            if (void 0 !== b.groups) for (e = 0; e < b.groups.length; e++) 1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && "), c += a(b.groups[e]);
                            if (void 0 !== b.rules) for (e = 0; e < b.rules.length; e++) {
                                1 < c.length && (c = "OR" === b.groupOp ? c + " || " : c + " && ");
                                var f = b.rules[e];
                                if (d.p.errorcheck) {
                                    for (var h = void 0, i = void 0, h = 0; h < d.p.columns.length; h++) if (d.p.columns[h].name === f.field) {
                                        i = d.p.columns[h];
                                        break
                                    }
                                    i && r(f.data, i)
                                }
                                c += f.op + "(item." + f.field + ",'" + f.data + "')"
                            }
                            c += ")";
                            return "()" === c ? "" : c
                        }
                        var d = this;
                        return a(this.p.filter)
                    };
                    this.reDraw();
                    if (this.p.showQuery) this.onchange();
                    this.filter = !0
                }
            }
        })
    };
    a.extend(a.fn.jqFilter, {
        toSQLString: function () {
            var a = "";
            this.each(function () {
                a = this.toUserFriendlyString()
            });
            return a
        },
        filterData: function () {
            var a;
            this.each(function () {
                a = this.p.filter
            });
            return a
        },
        getParameter: function (a) {
            return void 0 !== a && this.p.hasOwnProperty(a) ? this.p[a] : this.p
        },
        resetFilter: function () {
            return this.each(function () {
                this.resetFilter()
            })
        },
        addFilter: function (d) {
            "string" === typeof d && (d = a.jgrid.parse(d));
            this.each(function () {
                this.p.filter = d;
                this.reDraw();
                this.onchange()
            })
        }
    })
})(jQuery);
(function (a) {
    a.jgrid.inlineEdit = a.jgrid.inlineEdit || {};
    a.jgrid.extend({
        editRow: function (b, c, e, o, l, g, n, i, f) {
            var j = {},
                d = a.makeArray(arguments).slice(1);
            if ("object" === a.type(d[0])) j = d[0];
            else if (void 0 !== c && (j.keys = c), a.isFunction(e) && (j.oneditfunc = e), a.isFunction(o) && (j.successfunc = o), void 0 !== l && (j.url = l), void 0 !== g && (j.extraparam = g), a.isFunction(n) && (j.aftersavefunc = n), a.isFunction(i) && (j.errorfunc = i), a.isFunction(f)) j.afterrestorefunc = f;
            j = a.extend(!0, {
                keys: !1,
                oneditfunc: null,
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: !0,
                mtype: "POST"
            }, a.jgrid.inlineEdit, j);
            return this.each(function () {
                var d = this,
                    c, f, e = 0,
                    i = null,
                    l = {},
                    g, k;
                if (d.grid && (g = a(d).jqGrid("getInd", b, !0), !1 !== g && "0" == (a(g).attr("editable") || "0") && !a(g).hasClass("not-editable-row"))) k = d.p.colModel, a('td[role="gridcell"]', g).each(function (g) {
                    c = k[g].name;
                    var j = !0 === d.p.treeGrid && c == d.p.ExpandColumn;
                    if (j) f = a("span:first", this).html();
                    else try {
                        f = a.unformat.call(d, this, {
                            rowId: b,
                            colModel: k[g]
                        }, g)
                    } catch (o) {
                        f = k[g].edittype && "textarea" == k[g].edittype ? a(this).text() : a(this).html()
                    }
                    if ("cb" != c && "subgrid" != c && "rn" != c && (d.p.autoencode && (f = a.jgrid.htmlDecode(f)), l[c] = f, !0 === k[g].editable)) {
                        null === i && (i = g);
                        j ? a("span:first", this).html("") : a(this).html("");
                        var x = a.extend({}, k[g].editoptions || {}, {
                            id: b + "_" + c,
                            name: c
                        });
                        k[g].edittype || (k[g].edittype = "text");
                        if ("&nbsp;" == f || "&#160;" == f || 1 == f.length && 160 == f.charCodeAt(0)) f = "";
                        var v = a.jgrid.createEl.call(d, k[g].edittype, x, f, !0, a.extend({}, a.jgrid.ajaxOptions, d.p.ajaxSelectOptions || {}));
                        a(v).addClass("editable");
                        j ? a("span:first", this).append(v) : a(this).append(v);
                        a.jgrid.bindEv(v, x, d);
                        "select" == k[g].edittype && void 0 !== k[g].editoptions && !0 === k[g].editoptions.multiple && void 0 === k[g].editoptions.dataUrl && a.jgrid.msie && a(v).width(a(v).width());
                        e++
                    }
                }), 0 < e && (l.id = b, d.p.savedRow.push(l), a(g).attr("editable", "1"), a("td:eq(" + i + ") input", g).focus(), !0 === j.keys && a(g).bind("keydown", function (f) {
                    if (27 === f.keyCode) {
                        a(d).jqGrid("restoreRow", b, j.afterrestorefunc);
                        if (d.p._inlinenav) try {
                            a(d).jqGrid("showAddEditButtons")
                        } catch (c) { }
                        return !1
                    }
                    if (13 === f.keyCode) {
                        if ("TEXTAREA" == f.target.tagName) return !0;
                        if (a(d).jqGrid("saveRow", b, j) && d.p._inlinenav) try {
                            a(d).jqGrid("showAddEditButtons")
                        } catch (g) { }
                        return !1
                    }
                }), a(d).triggerHandler("jqGridInlineEditRow", [b, j]), a.isFunction(j.oneditfunc) && j.oneditfunc.call(d, b))
            })
        },
        saveRow: function (b, c, e, o, l, g, n) {
            var i = a.makeArray(arguments).slice(1),
                f = {};
            if ("object" === a.type(i[0])) f = i[0];
            else if (a.isFunction(c) && (f.successfunc = c), void 0 !== e && (f.url = e), void 0 !== o && (f.extraparam = o), a.isFunction(l) && (f.aftersavefunc = l), a.isFunction(g) && (f.errorfunc = g), a.isFunction(n)) f.afterrestorefunc = n;
            var f = a.extend(!0, {
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: !0,
                mtype: "POST"
            }, a.jgrid.inlineEdit, f),
                j = !1,
                d = this[0],
                m, h = {},
                w = {},
                r = {},
                t, s, q;
            if (!d.grid) return j;
            q = a(d).jqGrid("getInd", b, !0);
            if (!1 === q) return j;
            i = a(q).attr("editable");
            f.url = f.url || d.p.editurl;
            if ("1" === i) {
                var k;
                a('td[role="gridcell"]', q).each(function (b) {
                    k = d.p.colModel[b];
                    m = k.name;
                    if ("cb" != m && "subgrid" != m && !0 === k.editable && "rn" != m && !a(this).hasClass("not-editable-cell")) {
                        switch (k.edittype) {
                            case "checkbox":
                                var c = ["Yes", "No"];
                                k.editoptions && (c = k.editoptions.value.split(":"));
                                h[m] = a("input", this).is(":checked") ? c[0] : c[1];
                                break;
                            case "text":
                            case "password":
                            case "textarea":
                            case "button":
                                h[m] = a("input, textarea", this).val();
                                break;
                            case "select":
                                if (k.editoptions.multiple) {
                                    var c = a("select", this),
                                    g = [];
                                    h[m] = a(c).val();
                                    h[m] = h[m] ? h[m].join(",") : "";
                                    a("select option:selected", this).each(function (d, b) {
                                        g[d] = a(b).text()
                                    });
                                    w[m] = g.join(",")
                                } else h[m] = a("select option:selected", this).val(), w[m] = a("select option:selected", this).text();
                                k.formatter && "select" == k.formatter && (w = {});
                                break;
                            case "custom":
                                try {
                                    if (k.editoptions && a.isFunction(k.editoptions.custom_value)) {
                                        if (h[m] = k.editoptions.custom_value.call(d, a(".customelement", this), "get"), void 0 === h[m]) throw "e2";
                                    } else throw "e1";
                                } catch (e) {
                                    "e1" == e && a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.nodefined, a.jgrid.edit.bClose), "e2" == e ? a.jgrid.info_dialog(a.jgrid.errors.errcap, "function 'custom_value' " + a.jgrid.edit.msg.novalue, a.jgrid.edit.bClose) : a.jgrid.info_dialog(a.jgrid.errors.errcap, e.message, a.jgrid.edit.bClose)
                                }
                        }
                        s = a.jgrid.checkValues(h[m], b, d);
                        if (!1 === s[0]) return s[1] = h[m] + " " + s[1], !1;
                        d.p.autoencode && (h[m] = a.jgrid.htmlEncode(h[m]));
                        "clientArray" !== f.url && k.editoptions && !0 === k.editoptions.NullIfEmpty && "" === h[m] && (r[m] = "null")
                    }
                });
                if (!1 === s[0]) {
                    try {
                        var u = a.jgrid.findPos(a("#" + a.jgrid.jqID(b), d.grid.bDiv)[0]);
                        a.jgrid.info_dialog(a.jgrid.errors.errcap, s[1], a.jgrid.edit.bClose, {
                            left: u[0],
                            top: u[1]
                        })
                    } catch (y) {
                        alert(s[1])
                    }
                    return j
                }
                var p = d.p.prmNames,
                    u = b,
                    i = !1 === d.p.keyIndex ? p.id : d.p.colModel[d.p.keyIndex + (!0 === d.p.rownumbers ? 1 : 0) + (!0 === d.p.multiselect ? 1 : 0) + (!0 === d.p.subGrid ? 1 : 0)].name;
                if (h) {
                    h[p.oper] = p.editoper;
                    if (void 0 === h[i]) h[i] = b;
                    else if (q.id !== d.p.idPrefix + h[i] && (p = a.jgrid.stripPref(d.p.idPrefix, b), void 0 !== d.p._index[p] && (d.p._index[h[i]] = d.p._index[p], delete d.p._index[p]), b = d.p.idPrefix + h[i], a(q).attr("id", b), d.p.selrow === u && (d.p.selrow = b), a.isArray(d.p.selarrrow) && (p = a.inArray(u, d.p.selarrrow), 0 <= p && (d.p.selarrrow[p] = b)), d.p.multiselect)) p = "jqg_" + d.p.id + "_" + b, a("input.cbox", q).attr("id", p).attr("name", p);
                    void 0 === d.p.inlineData && (d.p.inlineData = {});
                    h = a.extend({}, h, d.p.inlineData, f.extraparam)
                }
                if ("clientArray" == f.url) {
                    h = a.extend({}, h, w);
                    d.p.autoencode && a.each(h, function (d, b) {
                        h[d] = a.jgrid.htmlDecode(b)
                    });
                    p = a(d).jqGrid("setRowData", b, h);
                    a(q).attr("editable", "0");
                    for (i = 0; i < d.p.savedRow.length; i++) if (d.p.savedRow[i].id == u) {
                        t = i;
                        break
                    }
                    0 <= t && d.p.savedRow.splice(t, 1);
                    a(d).triggerHandler("jqGridInlineAfterSaveRow", [b, p, h, f]);
                    a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(d, b, p, f);
                    j = !0;
                    a(q).unbind("keydown")
                } else a("#lui_" + a.jgrid.jqID(d.p.id)).show(), r = a.extend({}, h, r), r[i] = a.jgrid.stripPref(d.p.idPrefix, r[i]), a.ajax(a.extend({
                    url: f.url,
                    data: a.isFunction(d.p.serializeRowData) ? d.p.serializeRowData.call(d, r) : r,
                    type: f.mtype,
                    async: !1,
                    complete: function (c, g) {
                        a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                        if ("success" === g) {
                            var e = !0,
                                i;
                            i = a(d).triggerHandler("jqGridInlineSuccessSaveRow", [c, b, f]);
                            a.isArray(i) || (i = [!0, h]);
                            i[0] && a.isFunction(f.successfunc) && (i = f.successfunc.call(d, c));
                            a.isArray(i) ? (e = i[0], h = i[1] || h) : e = i;
                            if (!0 === e) {
                                d.p.autoencode && a.each(h, function (d, b) {
                                    h[d] = a.jgrid.htmlDecode(b)
                                });
                                h = a.extend({}, h, w);
                                a(d).jqGrid("setRowData", b, h);
                                a(q).attr("editable", "0");
                                for (e = 0; e < d.p.savedRow.length; e++) if (d.p.savedRow[e].id == b) {
                                    t = e;
                                    break
                                }
                                0 <= t && d.p.savedRow.splice(t, 1);
                                a(d).triggerHandler("jqGridInlineAfterSaveRow", [b, c, h, f]);
                                a.isFunction(f.aftersavefunc) && f.aftersavefunc.call(d, b, c);
                                j = !0;
                                a(q).unbind("keydown")
                            } else a(d).triggerHandler("jqGridInlineErrorSaveRow", [b, c, g, null, f]), a.isFunction(f.errorfunc) && f.errorfunc.call(d, b, c, g, null), !0 === f.restoreAfterError && a(d).jqGrid("restoreRow", b, f.afterrestorefunc)
                        }
                    },
                    error: function (c, e, g) {
                        a("#lui_" + a.jgrid.jqID(d.p.id)).hide();
                        a(d).triggerHandler("jqGridInlineErrorSaveRow", [b, c, e, g, f]);
                        if (a.isFunction(f.errorfunc)) f.errorfunc.call(d, b, c, e, g);
                        else {
                            c = c.responseText || c.statusText;
                            try {
                                a.jgrid.info_dialog(a.jgrid.errors.errcap, '<div class="ui-state-error">' + c + "</div>", a.jgrid.edit.bClose, {
                                    buttonalign: "right"
                                })
                            } catch (i) {
                                alert(c)
                            }
                        } !0 === f.restoreAfterError && a(d).jqGrid("restoreRow", b, f.afterrestorefunc)
                    }
                }, a.jgrid.ajaxOptions, d.p.ajaxRowOptions || {}))
            }
            return j
        },
        restoreRow: function (b, c) {
            var e = a.makeArray(arguments).slice(1),
                o = {};
            "object" === a.type(e[0]) ? o = e[0] : a.isFunction(c) && (o.afterrestorefunc = c);
            o = a.extend(!0, a.jgrid.inlineEdit, o);
            return this.each(function () {
                var c = this,
                    e, n, i = {},
                    f;
                if (c.grid) {
                    n = a(c).jqGrid("getInd", b, true);
                    if (n !== false) {
                        for (f = 0; f < c.p.savedRow.length; f++) if (c.p.savedRow[f].id == b) {
                            e = f;
                            break
                        }
                        if (e >= 0) {
                            if (a.isFunction(a.fn.datepicker)) try {
                                a("input.hasDatepicker", "#" + a.jgrid.jqID(n.id)).datepicker("hide")
                            } catch (j) { }
                            a.each(c.p.colModel, function () {
                                this.editable === true && c.p.savedRow[e].hasOwnProperty(this.name) && (i[this.name] = c.p.savedRow[e][this.name])
                            });
                            a(c).jqGrid("setRowData", b, i);
                            a(n).attr("editable", "0").unbind("keydown");
                            c.p.savedRow.splice(e, 1);
                            a("#" + a.jgrid.jqID(b), "#" + a.jgrid.jqID(c.p.id)).hasClass("jqgrid-new-row") && setTimeout(function () {
                                a(c).jqGrid("delRowData", b)
                            }, 0)
                        }
                        a(c).triggerHandler("jqGridInlineAfterRestoreRow", [b]);
                        a.isFunction(o.afterrestorefunc) && o.afterrestorefunc.call(c, b)
                    }
                }
            })
        },
        addRow: function (b) {
            b = a.extend(!0, {
                rowID: null,
                initdata: {},
                position: "first",
                useDefValues: !0,
                useFormatter: !1,
                addRowParams: {
                    extraparam: {}
                }
            }, b || {});
            return this.each(function () {
                if (this.grid) {
                    var c = this;
                    b.rowID = a.isFunction(b.rowID) ? b.rowID.call(c, b) : null != b.rowID ? b.rowID : a.jgrid.randId();
                    !0 === b.useDefValues && a(c.p.colModel).each(function () {
                        if (this.editoptions && this.editoptions.defaultValue) {
                            var e = this.editoptions.defaultValue,
                                e = a.isFunction(e) ? e.call(c) : e;
                            b.initdata[this.name] = e
                        }
                    });
                    a(c).jqGrid("addRowData", b.rowID, b.initdata, b.position);
                    b.rowID = c.p.idPrefix + b.rowID;
                    a("#" + a.jgrid.jqID(b.rowID), "#" + a.jgrid.jqID(c.p.id)).addClass("jqgrid-new-row");
                    if (b.useFormatter) a("#" + a.jgrid.jqID(b.rowID) + " .ui-inline-edit", "#" + a.jgrid.jqID(c.p.id)).click();
                    else {
                        var e = c.p.prmNames;
                        b.addRowParams.extraparam[e.oper] = e.addoper;
                        a(c).jqGrid("editRow", b.rowID, b.addRowParams);
                        a(c).jqGrid("setSelection", b.rowID)
                    }
                }
            })
        },
        inlineNav: function (b, c) {
            c = a.extend({
                edit: !0,
                editicon: "ui-icon-pencil",
                add: !0,
                addicon: "ui-icon-plus",
                save: !0,
                saveicon: "ui-icon-disk",
                cancel: !0,
                cancelicon: "ui-icon-cancel",
                addParams: {},
                editParams: {},
                restoreAfterSelect: !0
            }, a.jgrid.nav, c || {});
            return this.each(function () {
                if (this.grid) {
                    var e = this,
                        o, l = a.jgrid.jqID(e.p.id);
                    e.p._inlinenav = !0;
                    if (!0 === c.addParams.useFormatter) {
                        var g = e.p.colModel,
                            n;
                        for (n = 0; n < g.length; n++) if (g[n].formatter && "actions" === g[n].formatter) {
                            g[n].formatoptions && (g = a.extend({
                                keys: !1,
                                onEdit: null,
                                onSuccess: null,
                                afterSave: null,
                                onError: null,
                                afterRestore: null,
                                extraparam: {},
                                url: null
                            }, g[n].formatoptions), c.addParams.addRowParams = {
                                keys: g.keys,
                                oneditfunc: g.onEdit,
                                successfunc: g.onSuccess,
                                url: g.url,
                                extraparam: g.extraparam,
                                aftersavefunc: g.afterSavef,
                                errorfunc: g.onError,
                                afterrestorefunc: g.afterRestore
                            });
                            break
                        }
                    }
                    c.add && a(e).jqGrid("navButtonAdd", b, {
                        caption: c.addtext,
                        title: c.addtitle,
                        buttonicon: c.addicon,
                        id: e.p.id + "_iladd",
                        onClickButton: function () {
                            a(e).jqGrid("addRow", c.addParams);
                            c.addParams.useFormatter || (a("#" + l + "_ilsave").removeClass("ui-state-disabled"), a("#" + l + "_ilcancel").removeClass("ui-state-disabled"), a("#" + l + "_iladd").addClass("ui-state-disabled"), a("#" + l + "_iledit").addClass("ui-state-disabled"))
                        }
                    });
                    c.edit && a(e).jqGrid("navButtonAdd", b, {
                        caption: c.edittext,
                        title: c.edittitle,
                        buttonicon: c.editicon,
                        id: e.p.id + "_iledit",
                        onClickButton: function () {
                            var b = a(e).jqGrid("getGridParam", "selrow");
                            b ? (a(e).jqGrid("editRow", b, c.editParams), a("#" + l + "_ilsave").removeClass("ui-state-disabled"), a("#" + l + "_ilcancel").removeClass("ui-state-disabled"), a("#" + l + "_iladd").addClass("ui-state-disabled"), a("#" + l + "_iledit").addClass("ui-state-disabled")) : (a.jgrid.viewModal("#alertmod", {
                                gbox: "#gbox_" + l,
                                jqm: !0
                            }), a("#jqg_alrt").focus())
                        }
                    });
                    c.save && (a(e).jqGrid("navButtonAdd", b, {
                        caption: c.savetext || "",
                        title: c.savetitle || "Save row",
                        buttonicon: c.saveicon,
                        id: e.p.id + "_ilsave",
                        onClickButton: function () {
                            var b = e.p.savedRow[0].id;
                            if (b) {
                                var f = e.p.prmNames,
                                    g = f.oper;
                                c.editParams.extraparam || (c.editParams.extraparam = {});
                                c.editParams.extraparam[g] = a("#" + a.jgrid.jqID(b), "#" + l).hasClass("jqgrid-new-row") ? f.addoper : f.editoper;
                                a(e).jqGrid("saveRow", b, c.editParams) && a(e).jqGrid("showAddEditButtons")
                            } else a.jgrid.viewModal("#alertmod", {
                                gbox: "#gbox_" + l,
                                jqm: !0
                            }), a("#jqg_alrt").focus()
                        }
                    }), a("#" + l + "_ilsave").addClass("ui-state-disabled"));
                    c.cancel && (a(e).jqGrid("navButtonAdd", b, {
                        caption: c.canceltext || "",
                        title: c.canceltitle || "Cancel row editing",
                        buttonicon: c.cancelicon,
                        id: e.p.id + "_ilcancel",
                        onClickButton: function () {
                            var b = e.p.savedRow[0].id;
                            if (b) {
                                a(e).jqGrid("restoreRow", b, c.editParams);
                                a(e).jqGrid("showAddEditButtons")
                            } else {
                                a.jgrid.viewModal("#alertmod", {
                                    gbox: "#gbox_" + l,
                                    jqm: true
                                });
                                a("#jqg_alrt").focus()
                            }
                        }
                    }), a("#" + l + "_ilcancel").addClass("ui-state-disabled"));
                    !0 === c.restoreAfterSelect && (o = a.isFunction(e.p.beforeSelectRow) ? e.p.beforeSelectRow : !1, e.p.beforeSelectRow = function (b, f) {
                        var g = true;
                        if (e.p.savedRow.length > 0 && e.p._inlinenav === true && b !== e.p.selrow && e.p.selrow !== null) {
                            e.p.selrow == c.addParams.rowID ? a(e).jqGrid("delRowData", e.p.selrow) : a(e).jqGrid("restoreRow", e.p.selrow, c.editParams);
                            a(e).jqGrid("showAddEditButtons")
                        }
                        o && (g = o.call(e, b, f));
                        return g
                    })
                }
            })
        },
        showAddEditButtons: function () {
            return this.each(function () {
                if (this.grid) {
                    var b = a.jgrid.jqID(this.p.id);
                    a("#" + b + "_ilsave").addClass("ui-state-disabled");
                    a("#" + b + "_ilcancel").addClass("ui-state-disabled");
                    a("#" + b + "_iladd").removeClass("ui-state-disabled");
                    a("#" + b + "_iledit").removeClass("ui-state-disabled")
                }
            })
        }
    })
})(jQuery);
(function (b) {
    b.jgrid.extend({
        editCell: function (d, f, a) {
            return this.each(function () {
                var c = this,
                    g, e, h, i;
                if (c.grid && !0 === c.p.cellEdit) {
                    f = parseInt(f, 10);
                    c.p.selrow = c.rows[d].id;
                    c.p.knv || b(c).jqGrid("GridNav");
                    if (0 < c.p.savedRow.length) {
                        if (!0 === a && d == c.p.iRow && f == c.p.iCol) return;
                        b(c).jqGrid("saveCell", c.p.savedRow[0].id, c.p.savedRow[0].ic)
                    } else window.setTimeout(function () {
                        b("#" + b.jgrid.jqID(c.p.knv)).attr("tabindex", "-1").focus()
                    }, 0);
                    i = c.p.colModel[f];
                    g = i.name;
                    if (!("subgrid" == g || "cb" == g || "rn" == g)) {
                        h = b("td:eq(" + f + ")", c.rows[d]);
                        if (!0 === i.editable && !0 === a && !h.hasClass("not-editable-cell")) {
                            0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover"));
                            b(h).addClass("edit-cell ui-state-highlight");
                            b(c.rows[d]).addClass("selected-row ui-state-hover");
                            try {
                                e = b.unformat.call(c, h, {
                                    rowId: c.rows[d].id,
                                    colModel: i
                                }, f)
                            } catch (k) {
                                e = i.edittype && "textarea" == i.edittype ? b(h).text() : b(h).html()
                            }
                            c.p.autoencode && (e = b.jgrid.htmlDecode(e));
                            i.edittype || (i.edittype = "text");
                            c.p.savedRow.push({
                                id: d,
                                ic: f,
                                name: g,
                                v: e
                            });
                            if ("&nbsp;" === e || "&#160;" === e || 1 === e.length && 160 === e.charCodeAt(0)) e = "";
                            if (b.isFunction(c.p.formatCell)) {
                                var j = c.p.formatCell.call(c, c.rows[d].id, g, e, d, f);
                                void 0 !== j && (e = j)
                            }
                            var j = b.extend({}, i.editoptions || {}, {
                                id: d + "_" + g,
                                name: g
                            }),
                                n = b.jgrid.createEl.call(c, i.edittype, j, e, !0, b.extend({}, b.jgrid.ajaxOptions, c.p.ajaxSelectOptions || {}));
                            b(c).triggerHandler("jqGridBeforeEditCell", [c.rows[d].id, g, e, d, f]);
                            b.isFunction(c.p.beforeEditCell) && c.p.beforeEditCell.call(c, c.rows[d].id, g, e, d, f);
                            b(h).html("").append(n).attr("tabindex", "0");
                            b.jgrid.bindEv(n, j, c);
                            window.setTimeout(function () {
                                b(n).focus()
                            }, 0);
                            b("input, select, textarea", h).bind("keydown", function (a) {
                                a.keyCode === 27 && (b("input.hasDatepicker", h).length > 0 ? b(".ui-datepicker").is(":hidden") ? b(c).jqGrid("restoreCell", d, f) : b("input.hasDatepicker", h).datepicker("hide") : b(c).jqGrid("restoreCell", d, f));
                                if (a.keyCode === 13) {
                                    b(c).jqGrid("saveCell", d, f);
                                    return false
                                }
                                if (a.keyCode === 9) {
                                    if (c.grid.hDiv.loading) return false;
                                    a.shiftKey ? b(c).jqGrid("prevCell", d, f) : b(c).jqGrid("nextCell", d, f)
                                }
                                a.stopPropagation()
                            });
                            b(c).triggerHandler("jqGridAfterEditCell", [c.rows[d].id, g, e, d, f]);
                            b.isFunction(c.p.afterEditCell) && c.p.afterEditCell.call(c, c.rows[d].id, g, e, d, f)
                        } else 0 <= parseInt(c.p.iCol, 10) && 0 <= parseInt(c.p.iRow, 10) && (b("td:eq(" + c.p.iCol + ")", c.rows[c.p.iRow]).removeClass("edit-cell ui-state-highlight"), b(c.rows[c.p.iRow]).removeClass("selected-row ui-state-hover")), h.addClass("edit-cell ui-state-highlight"), b(c.rows[d]).addClass("selected-row ui-state-hover"), e = h.html().replace(/\&#160\;/ig, ""), b(c).triggerHandler("jqGridSelectCell", [c.rows[d].id, g, e, d, f]), b.isFunction(c.p.onSelectCell) && c.p.onSelectCell.call(c, c.rows[d].id, g, e, d, f);
                        c.p.iCol = f;
                        c.p.iRow = d
                    }
                }
            })
        },
        saveCell: function (d, f) {
            return this.each(function () {
                var a = this,
                    c;
                if (a.grid && !0 === a.p.cellEdit) {
                    c = 1 <= a.p.savedRow.length ? 0 : null;
                    if (null !== c) {
                        var g = b("td:eq(" + f + ")", a.rows[d]),
                            e, h, i = a.p.colModel[f],
                            k = i.name,
                            j = b.jgrid.jqID(k);
                        switch (i.edittype) {
                            case "select":
                                if (i.editoptions.multiple) {
                                    var j = b("#" + d + "_" + j, a.rows[d]),
                                    n = [];
                                    (e = b(j).val()) ? e.join(",") : e = "";
                                    b("option:selected", j).each(function (a, c) {
                                        n[a] = b(c).text()
                                    });
                                    h = n.join(",")
                                } else e = b("#" + d + "_" + j + " option:selected", a.rows[d]).val(), h = b("#" + d + "_" + j + " option:selected", a.rows[d]).text();
                                i.formatter && (h = e);
                                break;
                            case "checkbox":
                                var l = ["Yes", "No"];
                                i.editoptions && (l = i.editoptions.value.split(":"));
                                h = e = b("#" + d + "_" + j, a.rows[d]).is(":checked") ? l[0] : l[1];
                                break;
                            case "password":
                            case "text":
                            case "textarea":
                            case "button":
                                h = e = b("#" + d + "_" + j, a.rows[d]).val();
                                break;
                            case "custom":
                                try {
                                    if (i.editoptions && b.isFunction(i.editoptions.custom_value)) {
                                        e = i.editoptions.custom_value.call(a, b(".customelement", g), "get");
                                        if (void 0 === e) throw "e2";
                                        h = e
                                    } else throw "e1";
                                } catch (o) {
                                    "e1" == o && b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.nodefined, b.jgrid.edit.bClose), "e2" == o ? b.jgrid.info_dialog(b.jgrid.errors.errcap, "function 'custom_value' " + b.jgrid.edit.msg.novalue, b.jgrid.edit.bClose) : b.jgrid.info_dialog(b.jgrid.errors.errcap, o.message, b.jgrid.edit.bClose)
                                }
                        }
                        if (h !== a.p.savedRow[c].v) {
                            if (c = b(a).triggerHandler("jqGridBeforeSaveCell", [a.rows[d].id, k, e, d, f])) h = e = c;
                            if (b.isFunction(a.p.beforeSaveCell) && (c = a.p.beforeSaveCell.call(a, a.rows[d].id, k, e, d, f))) h = e = c;
                            var p = b.jgrid.checkValues(e, f, a);
                            if (!0 === p[0]) {
                                c = b(a).triggerHandler("jqGridBeforeSubmitCell", [a.rows[d].id, k, e, d, f]) || {};
                                b.isFunction(a.p.beforeSubmitCell) && ((c = a.p.beforeSubmitCell.call(a, a.rows[d].id, k, e, d, f)) || (c = {}));
                                0 < b("input.hasDatepicker", g).length && b("input.hasDatepicker", g).datepicker("hide");
                                if ("remote" == a.p.cellsubmit) if (a.p.cellurl) {
                                    var m = {};
                                    a.p.autoencode && (e = b.jgrid.htmlEncode(e));
                                    m[k] = e;
                                    l = a.p.prmNames;
                                    i = l.id;
                                    j = l.oper;
                                    m[i] = b.jgrid.stripPref(a.p.idPrefix, a.rows[d].id);
                                    m[j] = l.editoper;
                                    m = b.extend(c, m);
                                    b("#lui_" + b.jgrid.jqID(a.p.id)).show();
                                    a.grid.hDiv.loading = !0;
                                    b.ajax(b.extend({
                                        url: a.p.cellurl,
                                        data: b.isFunction(a.p.serializeCellData) ? a.p.serializeCellData.call(a, m) : m,
                                        type: "POST",
                                        complete: function (c, i) {
                                            b("#lui_" + a.p.id).hide();
                                            a.grid.hDiv.loading = false;
                                            if (i == "success") {
                                                var j = b(a).triggerHandler("jqGridAfterSubmitCell", [a, c, m.id, k, e, d, f]) || [true, ""];
                                                j[0] === true && b.isFunction(a.p.afterSubmitCell) && (j = a.p.afterSubmitCell.call(a, c, m.id, k, e, d, f));
                                                if (j[0] === true) {
                                                    b(g).empty();
                                                    b(a).jqGrid("setCell", a.rows[d].id, f, h, false, false, true);
                                                    b(g).addClass("dirty-cell");
                                                    b(a.rows[d]).addClass("edited");
                                                    b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]);
                                                    b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, k, e, d, f);
                                                    a.p.savedRow.splice(0, 1)
                                                } else {
                                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, j[1], b.jgrid.edit.bClose);
                                                    b(a).jqGrid("restoreCell", d, f)
                                                }
                                            }
                                        },
                                        error: function (c, e, h) {
                                            b("#lui_" + b.jgrid.jqID(a.p.id)).hide();
                                            a.grid.hDiv.loading = false;
                                            b(a).triggerHandler("jqGridErrorCell", [c, e, h]);
                                            b.isFunction(a.p.errorCell) ? a.p.errorCell.call(a, c, e, h) : b.jgrid.info_dialog(b.jgrid.errors.errcap, c.status + " : " + c.statusText + "<br/>" + e, b.jgrid.edit.bClose);
                                            b(a).jqGrid("restoreCell", d, f)
                                        }
                                    }, b.jgrid.ajaxOptions, a.p.ajaxCellOptions || {}))
                                } else try {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, b.jgrid.errors.nourl, b.jgrid.edit.bClose), b(a).jqGrid("restoreCell", d, f)
                                } catch (q) { }
                                "clientArray" == a.p.cellsubmit && (b(g).empty(), b(a).jqGrid("setCell", a.rows[d].id, f, h, !1, !1, !0), b(g).addClass("dirty-cell"), b(a.rows[d]).addClass("edited"), b(a).triggerHandler("jqGridAfterSaveCell", [a.rows[d].id, k, e, d, f]), b.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[d].id, k, e, d, f), a.p.savedRow.splice(0, 1))
                            } else try {
                                window.setTimeout(function () {
                                    b.jgrid.info_dialog(b.jgrid.errors.errcap, e + " " + p[1], b.jgrid.edit.bClose)
                                }, 100), b(a).jqGrid("restoreCell", d, f)
                            } catch (r) { }
                        } else b(a).jqGrid("restoreCell", d, f)
                    }
                    window.setTimeout(function () {
                        b("#" + b.jgrid.jqID(a.p.knv)).attr("tabindex", "-1").focus()
                    }, 0)
                }
            })
        },
        restoreCell: function (d, f) {
            return this.each(function () {
                var a = this,
                    c;
                if (a.grid && !0 === a.p.cellEdit) {
                    c = 1 <= a.p.savedRow.length ? 0 : null;
                    if (null !== c) {
                        var g = b("td:eq(" + f + ")", a.rows[d]);
                        if (b.isFunction(b.fn.datepicker)) try {
                            b("input.hasDatepicker", g).datepicker("hide")
                        } catch (e) { }
                        b(g).empty().attr("tabindex", "-1");
                        b(a).jqGrid("setCell", a.rows[d].id, f, a.p.savedRow[c].v, !1, !1, !0);
                        b(a).triggerHandler("jqGridAfterRestoreCell", [a.rows[d].id, a.p.savedRow[c].v, d, f]);
                        b.isFunction(a.p.afterRestoreCell) && a.p.afterRestoreCell.call(a, a.rows[d].id, a.p.savedRow[c].v, d, f);
                        a.p.savedRow.splice(0, 1)
                    }
                    window.setTimeout(function () {
                        b("#" + a.p.knv).attr("tabindex", "-1").focus()
                    }, 0)
                }
            })
        },
        nextCell: function (d, f) {
            return this.each(function () {
                var a = !1,
                    c;
                if (this.grid && !0 === this.p.cellEdit) {
                    for (c = f + 1; c < this.p.colModel.length; c++) if (!0 === this.p.colModel[c].editable) {
                        a = c;
                        break
                    } !1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                }
            })
        },
        prevCell: function (d, f) {
            return this.each(function () {
                var a = !1,
                    c;
                if (this.grid && !0 === this.p.cellEdit) {
                    for (c = f - 1; 0 <= c; c--) if (!0 === this.p.colModel[c].editable) {
                        a = c;
                        break
                    } !1 !== a ? b(this).jqGrid("editCell", d, a, !0) : 0 < this.p.savedRow.length && b(this).jqGrid("saveCell", d, f)
                }
            })
        },
        GridNav: function () {
            return this.each(function () {
                function d(c, d, e) {
                    if ("v" == e.substr(0, 1)) {
                        var f = b(a.grid.bDiv)[0].clientHeight,
                            g = b(a.grid.bDiv)[0].scrollTop,
                            l = a.rows[c].offsetTop + a.rows[c].clientHeight,
                            o = a.rows[c].offsetTop;
                        "vd" == e && l >= f && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop + a.rows[c].clientHeight);
                        "vu" == e && o < g && (b(a.grid.bDiv)[0].scrollTop = b(a.grid.bDiv)[0].scrollTop - a.rows[c].clientHeight)
                    }
                    "h" == e && (e = b(a.grid.bDiv)[0].clientWidth, f = b(a.grid.bDiv)[0].scrollLeft, g = a.rows[c].cells[d].offsetLeft, a.rows[c].cells[d].offsetLeft + a.rows[c].cells[d].clientWidth >= e + parseInt(f, 10) ? b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft + a.rows[c].cells[d].clientWidth : g < f && (b(a.grid.bDiv)[0].scrollLeft = b(a.grid.bDiv)[0].scrollLeft - a.rows[c].cells[d].clientWidth))
                }
                function f(b, c) {
                    var d, e;
                    if ("lft" == c) {
                        d = b + 1;
                        for (e = b; 0 <= e; e--) if (!0 !== a.p.colModel[e].hidden) {
                            d = e;
                            break
                        }
                    }
                    if ("rgt" == c) {
                        d = b - 1;
                        for (e = b; e < a.p.colModel.length; e++) if (!0 !== a.p.colModel[e].hidden) {
                            d = e;
                            break
                        }
                    }
                    return d
                }
                var a = this;
                if (a.grid && !0 === a.p.cellEdit) {
                    a.p.knv = a.p.id + "_kn";
                    var c = b("<div style='position:fixed;top:-1000000px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" + a.p.knv + "'></div></div>"),
                        g, e;
                    b(c).insertBefore(a.grid.cDiv);
                    b("#" + a.p.knv).focus().keydown(function (c) {
                        e = c.keyCode;
                        "rtl" == a.p.direction && (37 === e ? e = 39 : 39 === e && (e = 37));
                        switch (e) {
                            case 38:
                                0 < a.p.iRow - 1 && (d(a.p.iRow - 1, a.p.iCol, "vu"), b(a).jqGrid("editCell", a.p.iRow - 1, a.p.iCol, !1));
                                break;
                            case 40:
                                a.p.iRow + 1 <= a.rows.length - 1 && (d(a.p.iRow + 1, a.p.iCol, "vd"), b(a).jqGrid("editCell", a.p.iRow + 1, a.p.iCol, !1));
                                break;
                            case 37:
                                0 <= a.p.iCol - 1 && (g = f(a.p.iCol - 1, "lft"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                break;
                            case 39:
                                a.p.iCol + 1 <= a.p.colModel.length - 1 && (g = f(a.p.iCol + 1, "rgt"), d(a.p.iRow, g, "h"), b(a).jqGrid("editCell", a.p.iRow, g, !1));
                                break;
                            case 13:
                                0 <= parseInt(a.p.iCol, 10) && 0 <= parseInt(a.p.iRow, 10) && b(a).jqGrid("editCell", a.p.iRow, a.p.iCol, !0);
                                break;
                            default:
                                return !0
                        }
                        return !1
                    })
                }
            })
        },
        getChangedCells: function (d) {
            var f = [];
            d || (d = "all");
            this.each(function () {
                var a = this,
                    c;
                a.grid && !0 === a.p.cellEdit && b(a.rows).each(function (g) {
                    var e = {};
                    b(this).hasClass("edited") && (b("td", this).each(function (f) {
                        c = a.p.colModel[f].name;
                        if ("cb" !== c && "subgrid" !== c) if ("dirty" == d) {
                            if (b(this).hasClass("dirty-cell")) try {
                                e[c] = b.unformat.call(a, this, {
                                    rowId: a.rows[g].id,
                                    colModel: a.p.colModel[f]
                                }, f)
                            } catch (i) {
                                e[c] = b.jgrid.htmlDecode(b(this).html())
                            }
                        } else try {
                            e[c] = b.unformat.call(a, this, {
                                rowId: a.rows[g].id,
                                colModel: a.p.colModel[f]
                            }, f)
                        } catch (k) {
                            e[c] = b.jgrid.htmlDecode(b(this).html())
                        }
                    }), e.id = this.id, f.push(e))
                })
            });
            return f
        }
    })
})(jQuery);
(function (c) {
    c.fn.jqm = function (a) {
        var h = {
            overlay: 50,
            closeoverlay: !0,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: d,
            ajaxText: "",
            target: d,
            modal: d,
            toTop: d,
            onShow: d,
            onHide: d,
            onLoad: d
        };
        return this.each(function () {
            if (this._jqm) return i[this._jqm].c = c.extend({}, i[this._jqm].c, a);
            k++;
            this._jqm = k;
            i[k] = {
                c: c.extend(h, c.jqm.params, a),
                a: d,
                w: c(this).addClass("jqmID" + k),
                s: k
            };
            h.trigger && c(this).jqmAddTrigger(h.trigger)
        })
    };
    c.fn.jqmAddClose = function (a) {
        return o(this, a, "jqmHide")
    };
    c.fn.jqmAddTrigger = function (a) {
        return o(this, a, "jqmShow")
    };
    c.fn.jqmShow = function (a) {
        return this.each(function () {
            c.jqm.open(this._jqm, a)
        })
    };
    c.fn.jqmHide = function (a) {
        return this.each(function () {
            c.jqm.close(this._jqm, a)
        })
    };
    c.jqm = {
        hash: {},
        open: function (a, h) {
            var b = i[a],
                e = b.c,
                l = "." + e.closeClass,
                f = parseInt(b.w.css("z-index")),
                f = 0 < f ? f : 3E3,
                g = c("<div></div>").css({
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    "z-index": f - 1,
                    opacity: e.overlay / 100
                });
            if (b.a) return d;
            b.t = h;
            b.a = !0;
            b.w.css("z-index", f);
            e.modal ? (j[0] || setTimeout(function () {
                p("bind")
            }, 1), j.push(a)) : 0 < e.overlay ? e.closeoverlay && b.w.jqmAddClose(g) : g = d;
            b.o = g ? g.addClass(e.overlayClass).prependTo("body") : d;
            e.ajax ? (f = e.target || b.w, g = e.ajax, f = "string" == typeof f ? c(f, b.w) : c(f), g = "@" == g.substr(0, 1) ? c(h).attr(g.substring(1)) : g, f.html(e.ajaxText).load(g, function () {
                e.onLoad && e.onLoad.call(this, b);
                l && b.w.jqmAddClose(c(l, b.w));
                m(b)
            })) : l && b.w.jqmAddClose(c(l, b.w));
            e.toTop && b.o && b.w.before('<span id="jqmP' + b.w[0]._jqm + '"></span>').insertAfter(b.o);
            e.onShow ? e.onShow(b) : b.w.show();
            m(b);
            return d
        },
        close: function (a) {
            a = i[a];
            if (!a.a) return d;
            a.a = d;
            j[0] && (j.pop(), j[0] || p("unbind"));
            a.c.toTop && a.o && c("#jqmP" + a.w[0]._jqm).after(a.w).remove();
            if (a.c.onHide) a.c.onHide(a);
            else a.w.hide(), a.o && a.o.remove();
            return d
        },
        params: {}
    };
    var k = 0,
        i = c.jqm.hash,
        j = [],
        d = !1,
        m = function (a) {
            try {
                c(":input:visible", a.w)[0].focus()
            } catch (d) { }
        },
        p = function (a) {
            c(document)[a]("keypress", n)[a]("keydown", n)[a]("mousedown", n)
        },
        n = function (a) {
            var d = i[j[j.length - 1]];
            (a = !c(a.target).parents(".jqmID" + d.s)[0]) && m(d);
            return !a
        },
        o = function (a, h, b) {
            return a.each(function () {
                var a = this._jqm;
                c(h).each(function () {
                    this[b] || (this[b] = [], c(this).click(function () {
                        for (var a in {
                            jqmShow: 1,
                            jqmHide: 1
                        }) for (var b in this[a]) if (i[this[a][b]]) i[this[a][b]].w[a](this);
                        return d
                    }));
                    this[b].push(a)
                })
            })
        }
})(jQuery);
(function (b) {
    b.fn.jqDrag = function (a) {
        return h(this, a, "d")
    };
    b.fn.jqResize = function (a, b) {
        return h(this, a, "r", b)
    };
    b.jqDnR = {
        dnr: {},
        e: 0,
        drag: function (a) {
            "d" == d.k ? e.css({
                left: d.X + a.pageX - d.pX,
                top: d.Y + a.pageY - d.pY
            }) : (e.css({
                width: Math.max(a.pageX - d.pX + d.W, 0),
                height: Math.max(a.pageY - d.pY + d.H, 0)
            }), f && g.css({
                width: Math.max(a.pageX - f.pX + f.W, 0),
                height: Math.max(a.pageY - f.pY + f.H, 0)
            }));
            return !1
        },
        stop: function () {
            b(document).unbind("mousemove", c.drag).unbind("mouseup", c.stop)
        }
    };
    var c = b.jqDnR,
        d = c.dnr,
        e = c.e,
        g, f, h = function (a, c, h, l) {
            return a.each(function () {
                c = c ? b(c, a) : a;
                c.bind("mousedown", {
                    e: a,
                    k: h
                }, function (a) {
                    var c = a.data,
                        i = {};
                    e = c.e;
                    g = l ? b(l) : !1;
                    if ("relative" != e.css("position")) try {
                        e.position(i)
                    } catch (h) { }
                    d = {
                        X: i.left || j("left") || 0,
                        Y: i.top || j("top") || 0,
                        W: j("width") || e[0].scrollWidth || 0,
                        H: j("height") || e[0].scrollHeight || 0,
                        pX: a.pageX,
                        pY: a.pageY,
                        k: c.k
                    };
                    f = g && "d" != c.k ? {
                        X: i.left || k("left") || 0,
                        Y: i.top || k("top") || 0,
                        W: g[0].offsetWidth || k("width") || 0,
                        H: g[0].offsetHeight || k("height") || 0,
                        pX: a.pageX,
                        pY: a.pageY,
                        k: c.k
                    } : !1;
                    if (b("input.hasDatepicker", e[0])[0]) try {
                        b("input.hasDatepicker", e[0]).datepicker("hide")
                    } catch (m) { }
                    b(document).mousemove(b.jqDnR.drag).mouseup(b.jqDnR.stop);
                    return !1
                })
            })
        },
        j = function (a) {
            return parseInt(e.css(a), 10) || !1
        },
        k = function (a) {
            return parseInt(g.css(a), 10) || !1
        }
})(jQuery);
(function (b) {
    b.jgrid.extend({
        setSubGrid: function () {
            return this.each(function () {
                var e, c;
                this.p.subGridOptions = b.extend({
                    plusicon: "ui-icon-plus",
                    minusicon: "ui-icon-minus",
                    openicon: "ui-icon-carat-1-sw",
                    expandOnLoad: !1,
                    delayOnLoad: 50,
                    selectOnExpand: !1,
                    reloadOnExpand: !0
                }, this.p.subGridOptions || {});
                this.p.colNames.unshift("");
                this.p.colModel.unshift({
                    name: "subgrid",
                    width: b.jgrid.cell_width ? this.p.subGridWidth + this.p.cellLayout : this.p.subGridWidth,
                    sortable: !1,
                    resizable: !1,
                    hidedlg: !0,
                    search: !1,
                    fixed: !0
                });
                e = this.p.subGridModel;
                if (e[0]) {
                    e[0].align = b.extend([], e[0].align || []);
                    for (c = 0; c < e[0].name.length; c++) e[0].align[c] = e[0].align[c] || "left"
                }
            })
        },
        addSubGridCell: function (b, c) {
            var a = "",
                m, l;
            this.each(function () {
                a = this.formatCol(b, c);
                l = this.p.id;
                m = this.p.subGridOptions.plusicon
            });
            return '<td role="gridcell" aria-describedby="' + l + '_subgrid" class="ui-sgcollapsed sgcollapsed" ' + a + "><a href='javascript:void(0);'><span class='ui-icon " + m + "'></span></a></td>"
        },
        addSubGrid: function (e, c) {
            return this.each(function () {
                var a = this;
                if (a.grid) {
                    var m = function (c, e, h) {
                        e = b("<td align='" + a.p.subGridModel[0].align[h] + "'></td>").html(e);
                        b(c).append(e)
                    },
                        l = function (c, e) {
                            var h, f, n, d = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                i = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(i).append(h);
                            b(d).append(i);
                            c && (n = a.p.xmlReader.subgrid, b(n.root + " " + n.row, c).each(function () {
                                i = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                if (!0 === n.repeatitems) b(n.cell, this).each(function (a) {
                                    m(i, b(this).text() || "&#160;", a)
                                });
                                else {
                                    var c = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                    if (c) for (f = 0; f < c.length; f++) m(i, b(c[f], this).text() || "&#160;", f)
                                }
                                b(d).append(i)
                            }));
                            h = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(h + e)).append(d);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        p = function (c, e) {
                            var h, f, d, g, i, k = b("<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"),
                                j = b("<tr></tr>");
                            for (f = 0; f < a.p.subGridModel[0].name.length; f++) h = b("<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" + a.p.direction + "'></th>"), b(h).html(a.p.subGridModel[0].name[f]), b(h).width(a.p.subGridModel[0].width[f]), b(j).append(h);
                            b(k).append(j);
                            if (c && (g = a.p.jsonReader.subgrid, h = b.jgrid.getAccessor(c, g.root), void 0 !== h)) for (f = 0; f < h.length; f++) {
                                d = h[f];
                                j = b("<tr class='ui-widget-content ui-subtblcell'></tr>");
                                if (!0 === g.repeatitems) {
                                    g.cell && (d = d[g.cell]);
                                    for (i = 0; i < d.length; i++) m(j, d[i] || "&#160;", i)
                                } else {
                                    var l = a.p.subGridModel[0].mapping || a.p.subGridModel[0].name;
                                    if (l.length) for (i = 0; i < l.length; i++) m(j, d[l[i]] || "&#160;", i)
                                }
                                b(k).append(j)
                            }
                            f = b("table:first", a.grid.bDiv).attr("id") + "_";
                            b("#" + b.jgrid.jqID(f + e)).append(k);
                            a.grid.hDiv.loading = !1;
                            b("#load_" + b.jgrid.jqID(a.p.id)).hide();
                            return !1
                        },
                        t = function (c) {
                            var e, d, f, g;
                            e = b(c).attr("id");
                            d = {
                                nd_: (new Date).getTime()
                            };
                            d[a.p.prmNames.subgridid] = e;
                            if (!a.p.subGridModel[0]) return !1;
                            if (a.p.subGridModel[0].params) for (g = 0; g < a.p.subGridModel[0].params.length; g++) for (f = 0; f < a.p.colModel.length; f++) a.p.colModel[f].name === a.p.subGridModel[0].params[g] && (d[a.p.colModel[f].name] = b("td:eq(" + f + ")", c).text().replace(/\&#160\;/ig, ""));
                            if (!a.grid.hDiv.loading) switch (a.grid.hDiv.loading = !0, b("#load_" + b.jgrid.jqID(a.p.id)).show(), a.p.subgridtype || (a.p.subgridtype = a.p.datatype), b.isFunction(a.p.subgridtype) ? a.p.subgridtype.call(a, d) : a.p.subgridtype = a.p.subgridtype.toLowerCase(), a.p.subgridtype) {
                                case "xml":
                                case "json":
                                    b.ajax(b.extend({
                                        type: a.p.mtype,
                                        url: a.p.subGridUrl,
                                        dataType: a.p.subgridtype,
                                        data: b.isFunction(a.p.serializeSubGridData) ? a.p.serializeSubGridData.call(a, d) : d,
                                        complete: function (c) {
                                            a.p.subgridtype === "xml" ? l(c.responseXML, e) : p(b.jgrid.parse(c.responseText), e)
                                        }
                                    }, b.jgrid.ajaxOptions, a.p.ajaxSubgridOptions || {}))
                            }
                            return !1
                        },
                        d, k, q, r = 0,
                        g, j;
                    b.each(a.p.colModel, function () {
                        (!0 === this.hidden || "rn" === this.name || "cb" === this.name) && r++
                    });
                    var s = a.rows.length,
                        o = 1;
                    void 0 !== c && 0 < c && (o = c, s = c + 1);
                    for (; o < s; ) b(a.rows[o]).hasClass("jqgrow") && b(a.rows[o].cells[e]).bind("click", function () {
                        var c = b(this).parent("tr")[0];
                        j = c.nextSibling;
                        if (b(this).hasClass("sgcollapsed")) {
                            k = a.p.id;
                            d = c.id;
                            if (a.p.subGridOptions.reloadOnExpand === true || a.p.subGridOptions.reloadOnExpand === false && !b(j).hasClass("ui-subgrid")) {
                                q = e >= 1 ? "<td colspan='" + e + "'>&#160;</td>" : "";
                                g = b(a).triggerHandler("jqGridSubGridBeforeExpand", [k + "_" + d, d]);
                                (g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridBeforeExpand) && (g = a.p.subGridBeforeExpand.call(a, k + "_" + d, d));
                                if (g === false) return false;
                                b(c).after("<tr role='row' class='ui-subgrid'>" + q + "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " + a.p.subGridOptions.openicon + "'></span></td><td colspan='" + parseInt(a.p.colNames.length - 1 - r, 10) + "' class='ui-widget-content subgrid-data'><div id=" + k + "_" + d + " class='tablediv'></div></td></tr>");
                                b(a).triggerHandler("jqGridSubGridRowExpanded", [k + "_" + d, d]);
                                b.isFunction(a.p.subGridRowExpanded) ? a.p.subGridRowExpanded.call(a, k + "_" + d, d) : t(c)
                            } else b(j).show();
                            b(this).html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.minusicon + "'></span></a>").removeClass("sgcollapsed").addClass("sgexpanded");
                            a.p.subGridOptions.selectOnExpand && b(a).jqGrid("setSelection", d)
                        } else if (b(this).hasClass("sgexpanded")) {
                            g = b(a).triggerHandler("jqGridSubGridRowColapsed", [k + "_" + d, d]);
                            if ((g = g === false || g === "stop" ? false : true) && b.isFunction(a.p.subGridRowColapsed)) {
                                d = c.id;
                                g = a.p.subGridRowColapsed.call(a, k + "_" + d, d)
                            }
                            if (g === false) return false;
                            a.p.subGridOptions.reloadOnExpand === true ? b(j).remove(".ui-subgrid") : b(j).hasClass("ui-subgrid") && b(j).hide();
                            b(this).html("<a href='javascript:void(0);'><span class='ui-icon " + a.p.subGridOptions.plusicon + "'></span></a>").removeClass("sgexpanded").addClass("sgcollapsed")
                        }
                        return false
                    }), o++;
                    !0 === a.p.subGridOptions.expandOnLoad && b(a.rows).filter(".jqgrow").each(function (a, c) {
                        b(c.cells[0]).click()
                    });
                    a.subGridXml = function (a, b) {
                        l(a, b)
                    };
                    a.subGridJson = function (a, b) {
                        p(a, b)
                    }
                }
            })
        },
        expandSubGridRow: function (e) {
            return this.each(function () {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", e, !0);
                    c && (c = b("td.sgcollapsed", c)[0]) && b(c).trigger("click")
                }
            })
        },
        collapseSubGridRow: function (e) {
            return this.each(function () {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", e, !0);
                    c && (c = b("td.sgexpanded", c)[0]) && b(c).trigger("click")
                }
            })
        },
        toggleSubGridRow: function (e) {
            return this.each(function () {
                if ((this.grid || e) && !0 === this.p.subGrid) {
                    var c = b(this).jqGrid("getInd", e, !0);
                    if (c) {
                        var a = b("td.sgcollapsed", c)[0];
                        a ? b(a).trigger("click") : (a = b("td.sgexpanded", c)[0]) && b(a).trigger("click")
                    }
                }
            })
        }
    })
})(jQuery);
(function (c) {
    c.extend(c.jgrid, {
        template: function (d) {
            var h = c.makeArray(arguments).slice(1),
                e, a = h.length;
            null == d && (d = "");
            return d.replace(/\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g, function (d, g) {
                if (!isNaN(parseInt(g, 10))) return h[parseInt(g, 10)];
                for (e = 0; e < a; e++) if (c.isArray(h[e])) for (var b = h[e], j = b.length; j--; ) if (g === b[j].nm) return b[j].v
            })
        }
    });
    c.jgrid.extend({
        groupingSetup: function () {
            return this.each(function () {
                var d, h, e = this.p.colModel,
                    a = this.p.groupingView;
                if (null !== a && ("object" === typeof a || c.isFunction(a))) if (a.groupField.length) {
                    void 0 === a.visibiltyOnNextGrouping && (a.visibiltyOnNextGrouping = []);
                    a.lastvalues = [];
                    a.groups = [];
                    a.counters = [];
                    for (d = 0; d < a.groupField.length; d++) a.groupOrder[d] || (a.groupOrder[d] = "asc"), a.groupText[d] || (a.groupText[d] = "{0}"), "boolean" !== typeof a.groupColumnShow[d] && (a.groupColumnShow[d] = !0), "boolean" !== typeof a.groupSummary[d] && (a.groupSummary[d] = !1), !0 === a.groupColumnShow[d] ? (a.visibiltyOnNextGrouping[d] = !0, c(this).jqGrid("showCol", a.groupField[d])) : (a.visibiltyOnNextGrouping[d] = c("#" + c.jgrid.jqID(this.p.id + "_" + a.groupField[d])).is(":visible"), c(this).jqGrid("hideCol", a.groupField[d]));
                    a.summary = [];
                    d = 0;
                    for (h = e.length; d < h; d++) e[d].summaryType && a.summary.push({
                        nm: e[d].name,
                        st: e[d].summaryType,
                        v: "",
                        sr: e[d].summaryRound,
                        srt: e[d].summaryRoundType || "round"
                    })
                } else this.p.grouping = !1;
                else this.p.grouping = !1
            })
        },
        groupingPrepare: function (d, h, e, a) {
            this.each(function () {
                var f = this.p.groupingView,
                    g = this,
                    b, j = f.groupField.length,
                    k, i, l, r = 0;
                for (b = 0; b < j; b++) k = f.groupField[b], l = f.displayField[b], i = e[k], l = null == l ? null : e[l], null == l && (l = i), void 0 !== i && (0 === a ? (f.groups.push({
                    idx: b,
                    dataIndex: k,
                    value: i,
                    displayValue: l,
                    startRow: a,
                    cnt: 1,
                    summary: []
                }), f.lastvalues[b] = i, f.counters[b] = {
                    cnt: 1,
                    pos: f.groups.length - 1,
                    summary: c.extend(!0, [], f.summary)
                }) : "object" !== typeof i && f.lastvalues[b] !== i ? (f.groups.push({
                    idx: b,
                    dataIndex: k,
                    value: i,
                    displayValue: l,
                    startRow: a,
                    cnt: 1,
                    summary: []
                }), f.lastvalues[b] = i, r = 1, f.counters[b] = {
                    cnt: 1,
                    pos: f.groups.length - 1,
                    summary: c.extend(!0, [], f.summary)
                }) : 1 === r ? (f.groups.push({
                    idx: b,
                    dataIndex: k,
                    value: i,
                    displayValue: l,
                    startRow: a,
                    cnt: 1,
                    summary: []
                }), f.lastvalues[b] = i, f.counters[b] = {
                    cnt: 1,
                    pos: f.groups.length - 1,
                    summary: c.extend(!0, [], f.summary)
                }) : (f.counters[b].cnt += 1, f.groups[f.counters[b].pos].cnt = f.counters[b].cnt), c.each(f.counters[b].summary, function () {
                    this.v = c.isFunction(this.st) ? this.st.call(g, this.v, this.nm, e) : c(g).jqGrid("groupingCalculations.handler", this.st, this.v, this.nm, this.sr, this.srt, e)
                }), f.groups[f.counters[b].pos].summary = f.counters[b].summary);
                h.push(d)
            });
            return h
        },
        groupingToggle: function (d) {
            this.each(function () {
                var h = this.p.groupingView,
                    e = d.split("_"),
                    a = parseInt(e[e.length - 2], 10);
                e.splice(e.length - 2, 2);
                var e = e.join("_"),
                    f = h.minusicon,
                    g = h.plusicon,
                    b = c("#" + c.jgrid.jqID(d)),
                    b = b.length ? b[0].nextSibling : null,
                    j = c("#" + c.jgrid.jqID(d) + " span.tree-wrap-" + this.p.direction),
                    k = !1;
                if (j.hasClass(f)) {
                    if (h.showSummaryOnHide) {
                        if (b) for (; b && !(c(b).hasClass("jqfoot") && parseInt(c(b).attr("jqfootlevel"), 10) <= a); ) c(b).hide(), b = b.nextSibling
                    } else if (b) for (; b && !c(b).hasClass(e + "_" + ("" + a)) && !c(b).hasClass(e + "_" + ("" + (a - 1))); ) c(b).hide(), b = b.nextSibling;
                    j.removeClass(f).addClass(g);
                    k = !0
                } else {
                    if (b) for (; b && !c(b).hasClass(e + "_" + ("" + a)) && !c(b).hasClass(e + "_" + ("" + (a - 1))); ) c(b).show(), (h = c(b).find("span.tree-wrap-" + this.p.direction)) && c(h).hasClass(g) && c(h).removeClass(g).addClass(f), b = b.nextSibling;
                    j.removeClass(g).addClass(f)
                }
                c(this).triggerHandler("jqGridGroupingClickGroup", [d, k]);
                c.isFunction(this.p.onClickGroup) && this.p.onClickGroup.call(this, d, k)
            });
            return !1
        },
        groupingRender: function (d, h) {
            return this.each(function () {
                function e(a, d, b) {
                    var c = !1;
                    if (0 === d) c = b[a];
                    else {
                        var e = b[a].idx;
                        if (0 === e) c = b[a];
                        else for (; 0 <= a; a--) if (b[a].idx === e - d) {
                            c = b[a];
                            break
                        }
                    }
                    return c
                }
                var a = this,
                    f = a.p.groupingView,
                    g = "",
                    b = "",
                    j, k, i = f.groupCollapse ? f.plusicon : f.minusicon,
                    l, r = [],
                    w = f.groupField.length,
                    i = i + (" tree-wrap-" + a.p.direction);
                c.each(a.p.colModel, function (a, d) {
                    var b;
                    for (b = 0; b < w; b++) if (f.groupField[b] === d.name) {
                        r[b] = a;
                        break
                    }
                });
                var t = 0,
                    x = c.makeArray(f.groupSummary);
                x.reverse();
                c.each(f.groups, function (s, m) {
                    t++;
                    k = a.p.id + "ghead_" + m.idx;
                    j = k + "_" + s;
                    b = "<span style='cursor:pointer;' class='ui-icon " + i + "' onclick=\"jQuery('#" + c.jgrid.jqID(a.p.id) + "').jqGrid('groupingToggle','" + j + "');return false;\"></span>";
                    try {
                        l = a.formatter(j, m.displayValue, r[m.idx], m.value)
                    } catch (C) {
                        l = m.displayValue
                    }
                    g += '<tr id="' + j + '" role="row" class= "ui-widget-content jqgroup ui-row-' + a.p.direction + " " + k + '"><td style="padding-left:' + 12 * m.idx + 'px;" colspan="' + h + '">' + b + c.jgrid.template(f.groupText[m.idx], l, m.cnt, m.summary) + "</td></tr>";
                    if (w - 1 === m.idx) {
                        var o = f.groups[s + 1],
                            p, n, B = void 0 !== o ? f.groups[s + 1].startRow : d.length;
                        for (n = m.startRow; n < B; n++) g += d[n].join("");
                        var q;
                        if (void 0 !== o) {
                            for (q = 0; q < f.groupField.length && o.dataIndex !== f.groupField[q]; q++);
                            t = f.groupField.length - q
                        }
                        for (o = 0; o < t; o++) if (x[o]) {
                            n = "";
                            f.groupCollapse && !f.showSummaryOnHide && (n = ' style="display:none;"');
                            g += "<tr" + n + ' jqfootlevel="' + (m.idx - o) + '" role="row" class="ui-widget-content jqfoot ui-row-' + a.p.direction + '">';
                            n = e(s, o, f.groups);
                            var u = a.p.colModel,
                                v, y = n.cnt;
                            for (p = 0; p < h; p++) {
                                var z = "<td " + a.formatCol(p, 1, "") + ">&#160;</td>",
                                    A = "{0}";
                                c.each(n.summary, function () {
                                    if (this.nm === u[p].name) {
                                        u[p].summaryTpl && (A = u[p].summaryTpl);
                                        "string" === typeof this.st && "avg" === this.st.toLowerCase() && this.v && 0 < y && (this.v /= y);
                                        try {
                                            v = a.formatter("", this.v, p, this)
                                        } catch (b) {
                                            v = this.v
                                        }
                                        z = "<td " + a.formatCol(p, 1, "") + ">" + c.jgrid.format(A, v) + "</td>";
                                        return !1
                                    }
                                });
                                g += z
                            }
                            g += "</tr>"
                        }
                        t = q
                    }
                });
                c("#" + c.jgrid.jqID(a.p.id) + " tbody:first").append(g);
                g = null
            })
        },
        groupingGroupBy: function (d, h) {
            return this.each(function () {
                "string" === typeof d && (d = [d]);
                var e = this.p.groupingView;
                this.p.grouping = !0;
                void 0 === e.visibiltyOnNextGrouping && (e.visibiltyOnNextGrouping = []);
                var a;
                for (a = 0; a < e.groupField.length; a++) !e.groupColumnShow[a] && e.visibiltyOnNextGrouping[a] && c(this).jqGrid("showCol", e.groupField[a]);
                for (a = 0; a < d.length; a++) e.visibiltyOnNextGrouping[a] = c("#" + c.jgrid.jqID(this.p.id) + "_" + c.jgrid.jqID(d[a])).is(":visible");
                this.p.groupingView = c.extend(this.p.groupingView, h || {});
                e.groupField = d;
                c(this).trigger("reloadGrid")
            })
        },
        groupingRemove: function (d) {
            return this.each(function () {
                void 0 === d && (d = !0);
                this.p.grouping = !1;
                if (!0 === d) {
                    var h = this.p.groupingView,
                        e;
                    for (e = 0; e < h.groupField.length; e++) !h.groupColumnShow[e] && h.visibiltyOnNextGrouping[e] && c(this).jqGrid("showCol", h.groupField);
                    c("tr.jqgroup, tr.jqfoot", "#" + c.jgrid.jqID(this.p.id) + " tbody:first").remove();
                    c("tr.jqgrow:hidden", "#" + c.jgrid.jqID(this.p.id) + " tbody:first").show()
                } else c(this).trigger("reloadGrid")
            })
        },
        groupingCalculations: {
            handler: function (d, c, e, a, f, g) {
                var b = {
                    sum: function () {
                        return parseFloat(c || 0) + parseFloat(g[e] || 0)
                    },
                    min: function () {
                        return "" === c ? parseFloat(g[e] || 0) : Math.min(parseFloat(c), parseFloat(g[e] || 0))
                    },
                    max: function () {
                        return "" === c ? parseFloat(g[e] || 0) : Math.max(parseFloat(c), parseFloat(g[e] || 0))
                    },
                    count: function () {
                        "" === c && (c = 0);
                        return g.hasOwnProperty(e) ? c + 1 : 0
                    },
                    avg: function () {
                        return b.sum()
                    }
                };
                if (!b[d]) throw "jqGrid Grouping No such method: " + d;
                d = b[d]();
                null != a && ("fixed" == f ? d = d.toFixed(a) : (a = Math.pow(10, a), d = Math.round(d * a) / a));
                return d
            }
        }
    })
})(jQuery);
(function (d) {
    d.jgrid.extend({
        setTreeNode: function (a, c) {
            return this.each(function () {
                var b = this;
                if (b.grid && b.p.treeGrid) for (var h = b.p.expColInd, e = b.p.treeReader.expanded_field, i = b.p.treeReader.leaf_field, g = b.p.treeReader.level_field, f = b.p.treeReader.icon_field, l = b.p.treeReader.loaded, k, m, n, j; a < c; ) j = b.p.data[b.p._index[b.rows[a].id]], "nested" == b.p.treeGridModel && !j[i] && (k = parseInt(j[b.p.treeReader.left_field], 10), m = parseInt(j[b.p.treeReader.right_field], 10), j[i] = m === k + 1 ? "true" : "false", b.rows[a].cells[b.p._treeleafpos].innerHTML = j[i]), k = parseInt(j[g], 10), 0 === b.p.tree_root_level ? (n = k + 1, m = k) : (n = k, m = k - 1), n = "<div class='tree-wrap tree-wrap-" + b.p.direction + "' style='width:" + 18 * n + "px;'>", n += "<div style='" + ("rtl" == b.p.direction ? "right:" : "left:") + 18 * m + "px;' class='ui-icon ", void 0 !== j[l] && (j[l] = "true" == j[l] || !0 === j[l] ? !0 : !1), "true" == j[i] || !0 === j[i] ? (n += (void 0 !== j[f] && "" !== j[f] ? j[f] : b.p.treeIcons.leaf) + " tree-leaf treeclick", j[i] = !0, m = "leaf") : (j[i] = !1, m = ""), j[e] = ("true" == j[e] || !0 === j[e] ? !0 : !1) && (j[l] || void 0 === j[l]), n = !1 === j[e] ? n + (!0 === j[i] ? "'" : b.p.treeIcons.plus + " tree-plus treeclick'") : n + (!0 === j[i] ? "'" : b.p.treeIcons.minus + " tree-minus treeclick'"), n += "></div></div>", d(b.rows[a].cells[h]).wrapInner("<span class='cell-wrapper" + m + "'></span>").prepend(n), k !== parseInt(b.p.tree_root_level, 10) && ((j = (j = d(b).jqGrid("getNodeParent", j)) && j.hasOwnProperty(e) ? j[e] : !0) || d(b.rows[a]).css("display", "none")), d(b.rows[a].cells[h]).find("div.treeclick").bind("click", function (a) {
                    a = d(a.target || a.srcElement, b.rows).closest("tr.jqgrow")[0].id;
                    a = b.p._index[a];
                    if (!b.p.data[a][i]) if (b.p.data[a][e]) {
                        d(b).jqGrid("collapseRow", b.p.data[a]);
                        d(b).jqGrid("collapseNode", b.p.data[a])
                    } else {
                        d(b).jqGrid("expandRow", b.p.data[a]);
                        d(b).jqGrid("expandNode", b.p.data[a])
                    }
                    return false
                }), !0 === b.p.ExpandColClick && d(b.rows[a].cells[h]).find("span.cell-wrapper").css("cursor", "pointer").bind("click", function (a) {
                    var a = d(a.target || a.srcElement, b.rows).closest("tr.jqgrow")[0].id,
                        c = b.p._index[a];
                    if (!b.p.data[c][i]) if (b.p.data[c][e]) {
                        d(b).jqGrid("collapseRow", b.p.data[c]);
                        d(b).jqGrid("collapseNode", b.p.data[c])
                    } else {
                        d(b).jqGrid("expandRow", b.p.data[c]);
                        d(b).jqGrid("expandNode", b.p.data[c])
                    }
                    d(b).jqGrid("setSelection", a);
                    return false
                }), a++
            })
        },
        setTreeGrid: function () {
            return this.each(function () {
                var a = this,
                    c = 0,
                    b = !1,
                    h, e, i, g = [];
                if (a.p.treeGrid) {
                    a.p.treedatatype || d.extend(a.p, {
                        treedatatype: a.p.datatype
                    });
                    a.p.subGrid = !1;
                    a.p.altRows = !1;
                    a.p.pgbuttons = !1;
                    a.p.pginput = !1;
                    a.p.gridview = !0;
                    null === a.p.rowTotal && (a.p.rowNum = 1E4);
                    a.p.multiselect = !1;
                    a.p.rowList = [];
                    a.p.expColInd = 0;
                    a.p.treeIcons = d.extend({
                        plus: "ui-icon-triangle-1-" + ("rtl" == a.p.direction ? "w" : "e"),
                        minus: "ui-icon-triangle-1-s",
                        leaf: "ui-icon-radio-off"
                    }, a.p.treeIcons || {});
                    "nested" == a.p.treeGridModel ? a.p.treeReader = d.extend({
                        level_field: "level",
                        left_field: "lft",
                        right_field: "rgt",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    }, a.p.treeReader) : "adjacency" == a.p.treeGridModel && (a.p.treeReader = d.extend({
                        level_field: "level",
                        parent_id_field: "parent",
                        leaf_field: "isLeaf",
                        expanded_field: "expanded",
                        loaded: "loaded",
                        icon_field: "icon"
                    }, a.p.treeReader));
                    for (e in a.p.colModel) if (a.p.colModel.hasOwnProperty(e)) for (i in h = a.p.colModel[e].name, h == a.p.ExpandColumn && !b && (b = !0, a.p.expColInd = c), c++, a.p.treeReader) a.p.treeReader.hasOwnProperty(i) && a.p.treeReader[i] == h && g.push(h);
                    d.each(a.p.treeReader, function (b, e) {
                        if (e && d.inArray(e, g) === -1) {
                            if (b === "leaf_field") a.p._treeleafpos = c;
                            c++;
                            a.p.colNames.push(e);
                            a.p.colModel.push({
                                name: e,
                                width: 1,
                                hidden: true,
                                sortable: false,
                                resizable: false,
                                hidedlg: true,
                                editable: true,
                                search: false
                            })
                        }
                    })
                }
            })
        },
        expandRow: function (a) {
            this.each(function () {
                var c = this;
                if (c.grid && c.p.treeGrid) {
                    var b = d(c).jqGrid("getNodeChildren", a),
                        h = c.p.treeReader.expanded_field,
                        e = c.rows;
                    d(b).each(function () {
                        var a = d.jgrid.getAccessor(this, c.p.localReader.id);
                        d(e.namedItem(a)).css("display", "");
                        this[h] && d(c).jqGrid("expandRow", this)
                    })
                }
            })
        },
        collapseRow: function (a) {
            this.each(function () {
                var c = this;
                if (c.grid && c.p.treeGrid) {
                    var b = d(c).jqGrid("getNodeChildren", a),
                        h = c.p.treeReader.expanded_field,
                        e = c.rows;
                    d(b).each(function () {
                        var a = d.jgrid.getAccessor(this, c.p.localReader.id);
                        d(e.namedItem(a)).css("display", "none");
                        this[h] && d(c).jqGrid("collapseRow", this)
                    })
                }
            })
        },
        getRootNodes: function () {
            var a = [];
            this.each(function () {
                var c = this;
                if (c.grid && c.p.treeGrid) switch (c.p.treeGridModel) {
                    case "nested":
                        var b = c.p.treeReader.level_field;
                        d(c.p.data).each(function () {
                            parseInt(this[b], 10) === parseInt(c.p.tree_root_level, 10) && a.push(this)
                        });
                        break;
                    case "adjacency":
                        var h = c.p.treeReader.parent_id_field;
                        d(c.p.data).each(function () {
                            (null === this[h] || "null" == ("" + this[h]).toLowerCase()) && a.push(this)
                        })
                }
            });
            return a
        },
        getNodeDepth: function (a) {
            var c = null;
            this.each(function () {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                    case "nested":
                        c = parseInt(a[this.p.treeReader.level_field], 10) - parseInt(this.p.tree_root_level, 10);
                        break;
                    case "adjacency":
                        c = d(this).jqGrid("getNodeAncestors", a).length
                }
            });
            return c
        },
        getNodeParent: function (a) {
            var c = null;
            this.each(function () {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                    case "nested":
                        var b = this.p.treeReader.left_field,
                        h = this.p.treeReader.right_field,
                        e = this.p.treeReader.level_field,
                        i = parseInt(a[b], 10),
                        g = parseInt(a[h], 10),
                        f = parseInt(a[e], 10);
                        d(this.p.data).each(function () {
                            if (parseInt(this[e], 10) === f - 1 && parseInt(this[b], 10) < i && parseInt(this[h], 10) > g) return c = this, !1
                        });
                        break;
                    case "adjacency":
                        var l = this.p.treeReader.parent_id_field,
                        k = this.p.localReader.id;
                        d(this.p.data).each(function () {
                            if (this[k] == a[l]) return c = this, !1
                        })
                }
            });
            return c
        },
        getNodeChildren: function (a) {
            var c = [];
            this.each(function () {
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                    case "nested":
                        var b = this.p.treeReader.left_field,
                        h = this.p.treeReader.right_field,
                        e = this.p.treeReader.level_field,
                        i = parseInt(a[b], 10),
                        g = parseInt(a[h], 10),
                        f = parseInt(a[e], 10);
                        d(this.p.data).each(function () {
                            parseInt(this[e], 10) === f + 1 && parseInt(this[b], 10) > i && parseInt(this[h], 10) < g && c.push(this)
                        });
                        break;
                    case "adjacency":
                        var l = this.p.treeReader.parent_id_field,
                        k = this.p.localReader.id;
                        d(this.p.data).each(function () {
                            this[l] == a[k] && c.push(this)
                        })
                }
            });
            return c
        },
        getFullTreeNode: function (a) {
            var c = [];
            this.each(function () {
                var b;
                if (this.grid && this.p.treeGrid) switch (this.p.treeGridModel) {
                    case "nested":
                        var h = this.p.treeReader.left_field,
                        e = this.p.treeReader.right_field,
                        i = this.p.treeReader.level_field,
                        g = parseInt(a[h], 10),
                        f = parseInt(a[e], 10),
                        l = parseInt(a[i], 10);
                        d(this.p.data).each(function () {
                            parseInt(this[i], 10) >= l && parseInt(this[h], 10) >= g && parseInt(this[h], 10) <= f && c.push(this)
                        });
                        break;
                    case "adjacency":
                        if (a) {
                            c.push(a);
                            var k = this.p.treeReader.parent_id_field,
                            m = this.p.localReader.id;
                            d(this.p.data).each(function (a) {
                                b = c.length;
                                for (a = 0; a < b; a++) if (c[a][m] == this[k]) {
                                    c.push(this);
                                    break
                                }
                            })
                        }
                }
            });
            return c
        },
        getNodeAncestors: function (a) {
            var c = [];
            this.each(function () {
                if (this.grid && this.p.treeGrid) for (var b = d(this).jqGrid("getNodeParent", a); b; ) c.push(b), b = d(this).jqGrid("getNodeParent", b)
            });
            return c
        },
        isVisibleNode: function (a) {
            var c = !0;
            this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var b = d(this).jqGrid("getNodeAncestors", a),
                        h = this.p.treeReader.expanded_field;
                    d(b).each(function () {
                        c = c && this[h];
                        if (!c) return !1
                    })
                }
            });
            return c
        },
        isNodeLoaded: function (a) {
            var c;
            this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var b = this.p.treeReader.leaf_field;
                    c = void 0 !== a ? void 0 !== a.loaded ? a.loaded : a[b] || 0 < d(this).jqGrid("getNodeChildren", a).length ? !0 : !1 : !1
                }
            });
            return c
        },
        expandNode: function (a) {
            return this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var c = this.p.treeReader.expanded_field,
                        b = this.p.treeReader.parent_id_field,
                        h = this.p.treeReader.loaded,
                        e = this.p.treeReader.level_field,
                        i = this.p.treeReader.left_field,
                        g = this.p.treeReader.right_field;
                    if (!a[c]) {
                        var f = d.jgrid.getAccessor(a, this.p.localReader.id),
                            l = d("#" + d.jgrid.jqID(f), this.grid.bDiv)[0],
                            k = this.p._index[f];
                        d(this).jqGrid("isNodeLoaded", this.p.data[k]) ? (a[c] = !0, d("div.treeclick", l).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus")) : this.grid.hDiv.loading || (a[c] = !0, d("div.treeclick", l).removeClass(this.p.treeIcons.plus + " tree-plus").addClass(this.p.treeIcons.minus + " tree-minus"), this.p.treeANode = l.rowIndex, this.p.datatype = this.p.treedatatype, "nested" == this.p.treeGridModel ? d(this).jqGrid("setGridParam", {
                            postData: {
                                nodeid: f,
                                n_left: a[i],
                                n_right: a[g],
                                n_level: a[e]
                            }
                        }) : d(this).jqGrid("setGridParam", {
                            postData: {
                                nodeid: f,
                                parentid: a[b],
                                n_level: a[e]
                            }
                        }), d(this).trigger("reloadGrid"), a[h] = !0, "nested" == this.p.treeGridModel ? d(this).jqGrid("setGridParam", {
                            postData: {
                                nodeid: "",
                                n_left: "",
                                n_right: "",
                                n_level: ""
                            }
                        }) : d(this).jqGrid("setGridParam", {
                            postData: {
                                nodeid: "",
                                parentid: "",
                                n_level: ""
                            }
                        }))
                    }
                }
            })
        },
        collapseNode: function (a) {
            return this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var c = this.p.treeReader.expanded_field;
                    a[c] && (a[c] = !1, c = d.jgrid.getAccessor(a, this.p.localReader.id), c = d("#" + d.jgrid.jqID(c), this.grid.bDiv)[0], d("div.treeclick", c).removeClass(this.p.treeIcons.minus + " tree-minus").addClass(this.p.treeIcons.plus + " tree-plus"))
                }
            })
        },
        SortTree: function (a, c, b, h) {
            return this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var e, i, g, f = [],
                        l = this,
                        k;
                    e = d(this).jqGrid("getRootNodes");
                    e = d.jgrid.from(e);
                    e.orderBy(a, c, b, h);
                    k = e.select();
                    e = 0;
                    for (i = k.length; e < i; e++) g = k[e], f.push(g), d(this).jqGrid("collectChildrenSortTree", f, g, a, c, b, h);
                    d.each(f, function (a) {
                        var b = d.jgrid.getAccessor(this, l.p.localReader.id);
                        d("#" + d.jgrid.jqID(l.p.id) + " tbody tr:eq(" + a + ")").after(d("tr#" + d.jgrid.jqID(b), l.grid.bDiv))
                    });
                    f = k = e = null
                }
            })
        },
        collectChildrenSortTree: function (a, c, b, h, e, i) {
            return this.each(function () {
                if (this.grid && this.p.treeGrid) {
                    var g, f, l, k;
                    g = d(this).jqGrid("getNodeChildren", c);
                    g = d.jgrid.from(g);
                    g.orderBy(b, h, e, i);
                    k = g.select();
                    g = 0;
                    for (f = k.length; g < f; g++) l = k[g], a.push(l), d(this).jqGrid("collectChildrenSortTree", a, l, b, h, e, i)
                }
            })
        },
        setTreeRow: function (a, c) {
            var b = !1;
            this.each(function () {
                this.grid && this.p.treeGrid && (b = d(this).jqGrid("setRowData", a, c))
            });
            return b
        },
        delTreeNode: function (a) {
            return this.each(function () {
                var c = this.p.localReader.id,
                    b, h = this.p.treeReader.left_field,
                    e = this.p.treeReader.right_field,
                    i, g, f;
                if (this.grid && this.p.treeGrid && (b = this.p._index[a], void 0 !== b)) {
                    i = parseInt(this.p.data[b][e], 10);
                    g = i - parseInt(this.p.data[b][h], 10) + 1;
                    var l = d(this).jqGrid("getFullTreeNode", this.p.data[b]);
                    if (0 < l.length) for (b = 0; b < l.length; b++) d(this).jqGrid("delRowData", l[b][c]);
                    if ("nested" === this.p.treeGridModel) {
                        c = d.jgrid.from(this.p.data).greater(h, i, {
                            stype: "integer"
                        }).select();
                        if (c.length) for (f in c) c.hasOwnProperty(f) && (c[f][h] = parseInt(c[f][h], 10) - g);
                        c = d.jgrid.from(this.p.data).greater(e, i, {
                            stype: "integer"
                        }).select();
                        if (c.length) for (f in c) c.hasOwnProperty(f) && (c[f][e] = parseInt(c[f][e], 10) - g)
                    }
                }
            })
        },
        addChildNode: function (a, c, b, h) {
            var e = this[0];
            if (b) {
                var i = e.p.treeReader.expanded_field,
                    g = e.p.treeReader.leaf_field,
                    f = e.p.treeReader.level_field,
                    l = e.p.treeReader.parent_id_field,
                    k = e.p.treeReader.left_field,
                    m = e.p.treeReader.right_field,
                    n = e.p.treeReader.loaded,
                    j, r, q, t, p;
                j = 0;
                var s = c,
                    u;
                void 0 === h && (h = !1);
                if (void 0 === a || null === a) {
                    p = e.p.data.length - 1;
                    if (0 <= p) for (; 0 <= p; ) j = Math.max(j, parseInt(e.p.data[p][e.p.localReader.id], 10)), p--;
                    a = j + 1
                }
                var v = d(e).jqGrid("getInd", c);
                u = !1;
                if (void 0 === c || null === c || "" === c) s = c = null, j = "last", t = e.p.tree_root_level, p = e.p.data.length + 1;
                else if (j = "after", r = e.p._index[c], q = e.p.data[r], c = q[e.p.localReader.id], t = parseInt(q[f], 10) + 1, p = d(e).jqGrid("getFullTreeNode", q), p.length ? (s = p = p[p.length - 1][e.p.localReader.id], p = d(e).jqGrid("getInd", s) + 1) : p = d(e).jqGrid("getInd", c) + 1, q[g]) u = !0, q[i] = !0, d(e.rows[v]).find("span.cell-wrapperleaf").removeClass("cell-wrapperleaf").addClass("cell-wrapper").end().find("div.tree-leaf").removeClass(e.p.treeIcons.leaf + " tree-leaf").addClass(e.p.treeIcons.minus + " tree-minus"), e.p.data[r][g] = !1, q[n] = !0;
                r = p + 1;
                void 0 === b[i] && (b[i] = !1);
                void 0 === b[n] && (b[n] = !1);
                b[f] = t;
                void 0 === b[g] && (b[g] = !0);
                "adjacency" === e.p.treeGridModel && (b[l] = c);
                if ("nested" === e.p.treeGridModel) {
                    var o;
                    if (null !== c) {
                        g = parseInt(q[m], 10);
                        f = d.jgrid.from(e.p.data);
                        f = f.greaterOrEquals(m, g, {
                            stype: "integer"
                        });
                        f = f.select();
                        if (f.length) for (o in f) f.hasOwnProperty(o) && (f[o][k] = f[o][k] > g ? parseInt(f[o][k], 10) + 2 : f[o][k], f[o][m] = f[o][m] >= g ? parseInt(f[o][m], 10) + 2 : f[o][m]);
                        b[k] = g;
                        b[m] = g + 1
                    } else {
                        g = parseInt(d(e).jqGrid("getCol", m, !1, "max"), 10);
                        f = d.jgrid.from(e.p.data).greater(k, g, {
                            stype: "integer"
                        }).select();
                        if (f.length) for (o in f) f.hasOwnProperty(o) && (f[o][k] = parseInt(f[o][k], 10) + 2);
                        f = d.jgrid.from(e.p.data).greater(m, g, {
                            stype: "integer"
                        }).select();
                        if (f.length) for (o in f) f.hasOwnProperty(o) && (f[o][m] = parseInt(f[o][m], 10) + 2);
                        b[k] = g + 1;
                        b[m] = g + 2
                    }
                }
                if (null === c || d(e).jqGrid("isNodeLoaded", q) || u) d(e).jqGrid("addRowData", a, b, j, s), d(e).jqGrid("setTreeNode", p, r);
                q && !q[i] && h && d(e.rows[v]).find("div.treeclick").click()
            }
        }
    })
})(jQuery);
(function (c) {
    c.jgrid.extend({
        jqGridImport: function (a) {
            a = c.extend({
                imptype: "xml",
                impstring: "",
                impurl: "",
                mtype: "GET",
                impData: {},
                xmlGrid: {
                    config: "roots>grid",
                    data: "roots>rows"
                },
                jsonGrid: {
                    config: "grid",
                    data: "data"
                },
                ajaxOptions: {}
            }, a || {});
            return this.each(function () {
                var d = this,
                    f = function (a, b) {
                        var e = c(b.xmlGrid.config, a)[0],
                            h = c(b.xmlGrid.data, a)[0],
                            f, g;
                        if (xmlJsonClass.xml2json && c.jgrid.parse) {
                            e = xmlJsonClass.xml2json(e, " ");
                            e = c.jgrid.parse(e);
                            for (g in e) e.hasOwnProperty(g) && (f = e[g]);
                            h ? (h = e.grid.datatype, e.grid.datatype = "xmlstring", e.grid.datastr = a, c(d).jqGrid(f).jqGrid("setGridParam", {
                                datatype: h
                            })) : c(d).jqGrid(f)
                        } else alert("xml2json or parse are not present")
                    },
                    b = function (a, b) {
                        if (a && "string" == typeof a) {
                            var e = !1;
                            c.jgrid.useJSON && (c.jgrid.useJSON = !1, e = !0);
                            var f = c.jgrid.parse(a);
                            e && (c.jgrid.useJSON = !0);
                            e = f[b.jsonGrid.config];
                            if (f = f[b.jsonGrid.data]) {
                                var g = e.datatype;
                                e.datatype = "jsonstring";
                                e.datastr = f;
                                c(d).jqGrid(e).jqGrid("setGridParam", {
                                    datatype: g
                                })
                            } else c(d).jqGrid(e)
                        }
                    };
                switch (a.imptype) {
                    case "xml":
                        c.ajax(c.extend({
                            url: a.impurl,
                            type: a.mtype,
                            data: a.impData,
                            dataType: "xml",
                            complete: function (b, g) {
                                "success" == g && (f(b.responseXML, a), c(d).triggerHandler("jqGridImportComplete", [b, a]), c.isFunction(a.importComplete) && a.importComplete(b))
                            }
                        }, a.ajaxOptions));
                        break;
                    case "xmlstring":
                        if (a.impstring && "string" == typeof a.impstring) {
                            var g = c.jgrid.stringToDoc(a.impstring);
                            g && (f(g, a), c(d).triggerHandler("jqGridImportComplete", [g, a]), c.isFunction(a.importComplete) && a.importComplete(g), a.impstring = null);
                            g = null
                        }
                        break;
                    case "json":
                        c.ajax(c.extend({
                            url: a.impurl,
                            type: a.mtype,
                            data: a.impData,
                            dataType: "json",
                            complete: function (f) {
                                try {
                                    b(f.responseText, a), c(d).triggerHandler("jqGridImportComplete", [f, a]), c.isFunction(a.importComplete) && a.importComplete(f)
                                } catch (g) { }
                            }
                        }, a.ajaxOptions));
                        break;
                    case "jsonstring":
                        a.impstring && "string" == typeof a.impstring && (b(a.impstring, a), c(d).triggerHandler("jqGridImportComplete", [a.impstring, a]), c.isFunction(a.importComplete) && a.importComplete(a.impstring), a.impstring = null)
                }
            })
        },
        jqGridExport: function (a) {
            var a = c.extend({
                exptype: "xmlstring",
                root: "grid",
                ident: "\t"
            }, a || {}),
                d = null;
            this.each(function () {
                if (this.grid) {
                    var f, b = c.extend(!0, {}, c(this).jqGrid("getGridParam"));
                    b.rownumbers && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.multiselect && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.subGrid && (b.colNames.splice(0, 1), b.colModel.splice(0, 1));
                    b.knv = null;
                    if (b.treeGrid) for (f in b.treeReader) b.treeReader.hasOwnProperty(f) && (b.colNames.splice(b.colNames.length - 1), b.colModel.splice(b.colModel.length - 1));
                    switch (a.exptype) {
                        case "xmlstring":
                            d = "<" + a.root + ">" + xmlJsonClass.json2xml(b, a.ident) + "</" + a.root + ">";
                            break;
                        case "jsonstring":
                            d = "{" + xmlJsonClass.toJson(b, a.root, a.ident, !1) + "}", void 0 !== b.postData.filters && (d = d.replace(/filters":"/, 'filters":'), d = d.replace(/}]}"/, "}]}"))
                    }
                }
            });
            return d
        },
        excelExport: function (a) {
            a = c.extend({
                exptype: "remote",
                url: null,
                oper: "oper",
                tag: "excel",
                exportOptions: {}
            }, a || {});
            return this.each(function () {
                if (this.grid) {
                    var d;
                    "remote" == a.exptype && (d = c.extend({}, this.p.postData), d[a.oper] = a.tag, d = jQuery.param(d), d = -1 != a.url.indexOf("?") ? a.url + "&" + d : a.url + "?" + d, window.location = d)
                }
            })
        }
    })
})(jQuery);
var xmlJsonClass = {
    xml2json: function (a, b) {
        if (9 === a.nodeType) a = a.documentElement;
        var g = this.toJson(this.toObj(this.removeWhite(a)), a.nodeName, "\t");
        return "{\n" + b + (b ? g.replace(/\t/g, b) : g.replace(/\t|\n/g, "")) + "\n}"
    },
    json2xml: function (a, b) {
        var g = function (a, b, e) {
            var d = "",
                    f, i;
            if (a instanceof Array) if (0 === a.length) d += e + "<" + b + ">__EMPTY_ARRAY_</" + b + ">\n";
            else for (f = 0, i = a.length; f < i; f += 1) var l = e + g(a[f], b, e + "\t") + "\n",
                    d = d + l;
            else if ("object" === typeof a) {
                f = !1;
                d += e + "<" + b;
                for (i in a) a.hasOwnProperty(i) && ("@" === i.charAt(0) ? d += " " + i.substr(1) + '="' + a[i].toString() + '"' : f = !0);
                d += f ? ">" : "/>";
                if (f) {
                    for (i in a) a.hasOwnProperty(i) && ("#text" === i ? d += a[i] : "#cdata" === i ? d += "<![CDATA[" + a[i] + "]]\>" : "@" !== i.charAt(0) && (d += g(a[i], i, e + "\t")));
                    d += ("\n" === d.charAt(d.length - 1) ? e : "") + "</" + b + ">"
                }
            } else "function" === typeof a ? d += e + "<" + b + "><![CDATA[" + a + "]]\></" + b + ">" : (void 0 === a && (a = ""), d = '""' === a.toString() || 0 === a.toString().length ? d + (e + "<" + b + ">__EMPTY_STRING_</" + b + ">") : d + (e + "<" + b + ">" + a.toString() + "</" + b + ">"));
            return d
        },
            f = "",
            e;
        for (e in a) a.hasOwnProperty(e) && (f += g(a[e], e, ""));
        return b ? f.replace(/\t/g, b) : f.replace(/\t|\n/g, "")
    },
    toObj: function (a) {
        var b = {},
            g = /function/i;
        if (1 === a.nodeType) {
            if (a.attributes.length) {
                var f;
                for (f = 0; f < a.attributes.length; f += 1) b["@" + a.attributes[f].nodeName] = (a.attributes[f].nodeValue || "").toString()
            }
            if (a.firstChild) {
                var e = f = 0,
                    h = !1,
                    c;
                for (c = a.firstChild; c; c = c.nextSibling) 1 === c.nodeType ? h = !0 : 3 === c.nodeType && c.nodeValue.match(/[^ \f\n\r\t\v]/) ? f += 1 : 4 === c.nodeType && (e += 1);
                if (h) if (2 > f && 2 > e) {
                    this.removeWhite(a);
                    for (c = a.firstChild; c; c = c.nextSibling) 3 === c.nodeType ? b["#text"] = this.escape(c.nodeValue) : 4 === c.nodeType ? g.test(c.nodeValue) ? b[c.nodeName] = [b[c.nodeName], c.nodeValue] : b["#cdata"] = this.escape(c.nodeValue) : b[c.nodeName] ? b[c.nodeName] instanceof Array ? b[c.nodeName][b[c.nodeName].length] = this.toObj(c) : b[c.nodeName] = [b[c.nodeName], this.toObj(c)] : b[c.nodeName] = this.toObj(c)
                } else a.attributes.length ? b["#text"] = this.escape(this.innerXml(a)) : b = this.escape(this.innerXml(a));
                else if (f) a.attributes.length ? b["#text"] = this.escape(this.innerXml(a)) : (b = this.escape(this.innerXml(a)), "__EMPTY_ARRAY_" === b ? b = "[]" : "__EMPTY_STRING_" === b && (b = ""));
                else if (e) if (1 < e) b = this.escape(this.innerXml(a));
                else for (c = a.firstChild; c; c = c.nextSibling) if (g.test(a.firstChild.nodeValue)) {
                    b = a.firstChild.nodeValue;
                    break
                } else b["#cdata"] = this.escape(c.nodeValue)
            } !a.attributes.length && !a.firstChild && (b = null)
        } else 9 === a.nodeType ? b = this.toObj(a.documentElement) : alert("unhandled node type: " + a.nodeType);
        return b
    },
    toJson: function (a, b, g, f) {
        void 0 === f && (f = !0);
        var e = b ? '"' + b + '"' : "",
            h = "\t",
            c = "\n";
        f || (c = h = "");
        if ("[]" === a) e += b ? ":[]" : "[]";
        else if (a instanceof Array) {
            var j, d, k = [];
            for (d = 0, j = a.length; d < j; d += 1) k[d] = this.toJson(a[d], "", g + h, f);
            e += (b ? ":[" : "[") + (1 < k.length ? c + g + h + k.join("," + c + g + h) + c + g : k.join("")) + "]"
        } else if (null === a) e += (b && ":") + "null";
        else if ("object" === typeof a) {
            j = [];
            for (d in a) a.hasOwnProperty(d) && (j[j.length] = this.toJson(a[d], d, g + h, f));
            e += (b ? ":{" : "{") + (1 < j.length ? c + g + h + j.join("," + c + g + h) + c + g : j.join("")) + "}"
        } else e = "string" === typeof a ? e + ((b && ":") + '"' + a.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"') : e + ((b && ":") + a.toString());
        return e
    },
    innerXml: function (a) {
        var b = "";
        if ("innerHTML" in a) b = a.innerHTML;
        else for (var g = function (a) {
            var b = "",
                    h;
            if (1 === a.nodeType) {
                b += "<" + a.nodeName;
                for (h = 0; h < a.attributes.length; h += 1) b += " " + a.attributes[h].nodeName + '="' + (a.attributes[h].nodeValue || "").toString() + '"';
                if (a.firstChild) {
                    b += ">";
                    for (h = a.firstChild; h; h = h.nextSibling) b += g(h);
                    b += "</" + a.nodeName + ">"
                } else b += "/>"
            } else 3 === a.nodeType ? b += a.nodeValue : 4 === a.nodeType && (b += "<![CDATA[" + a.nodeValue + "]]\>");
            return b
        }, a = a.firstChild; a; a = a.nextSibling) b += g(a);
        return b
    },
    escape: function (a) {
        return a.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r")
    },
    removeWhite: function (a) {
        a.normalize();
        var b;
        for (b = a.firstChild; b; ) if (3 === b.nodeType) if (b.nodeValue.match(/[^ \f\n\r\t\v]/)) b = b.nextSibling;
        else {
            var g = b.nextSibling;
            a.removeChild(b);
            b = g
        } else 1 === b.nodeType && this.removeWhite(b), b = b.nextSibling;
        return a
    }
};

function tableToGrid(j, k) {
    jQuery(j).each(function () {
        if (!this.grid) {
            jQuery(this).width("99%");
            var b = jQuery(this).width(),
                c = jQuery("tr td:first-child input[type=checkbox]:first", jQuery(this)),
                a = jQuery("tr td:first-child input[type=radio]:first", jQuery(this)),
                c = 0 < c.length,
                a = !c && 0 < a.length,
                i = c || a,
                d = [],
                e = [];
            jQuery("th", jQuery(this)).each(function () {
                0 === d.length && i ? (d.push({
                    name: "__selection__",
                    index: "__selection__",
                    width: 0,
                    hidden: !0
                }), e.push("__selection__")) : (d.push({
                    name: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    index: jQuery(this).attr("id") || jQuery.trim(jQuery.jgrid.stripHtml(jQuery(this).html())).split(" ").join("_"),
                    width: jQuery(this).width() || 150
                }), e.push(jQuery(this).html()))
            });
            var f = [],
                g = [],
                h = [];
            jQuery("tbody > tr", jQuery(this)).each(function () {
                var b = {},
                    a = 0;
                jQuery("td", jQuery(this)).each(function () {
                    if (0 === a && i) {
                        var c = jQuery("input", jQuery(this)),
                            e = c.attr("value");
                        g.push(e || f.length);
                        c.is(":checked") && h.push(e);
                        b[d[a].name] = c.attr("value")
                    } else b[d[a].name] = jQuery(this).html();
                    a++
                });
                0 < a && f.push(b)
            });
            jQuery(this).empty();
            jQuery(this).addClass("scroll");
            jQuery(this).jqGrid(jQuery.extend({
                datatype: "local",
                width: b,
                colNames: e,
                colModel: d,
                multiselect: c
            }, k || {}));
            for (b = 0; b < f.length; b++) a = null, 0 < g.length && (a = g[b]) && a.replace && (a = encodeURIComponent(a).replace(/[.\-%]/g, "_")), null === a && (a = b + 1), jQuery(this).jqGrid("addRowData", a, f[b]);
            for (b = 0; b < h.length; b++) jQuery(this).jqGrid("setSelection", h[b])
        }
    })
};
(function (b) {
    b.jgrid.msie && 8 == b.jgrid.msiever() && (b.expr[":"].hidden = function (b) {
        return 0 === b.offsetWidth || 0 === b.offsetHeight || "none" == b.style.display
    });
    b.jgrid._multiselect = !1;
    if (b.ui && b.ui.multiselect) {
        if (b.ui.multiselect.prototype._setSelected) {
            var o = b.ui.multiselect.prototype._setSelected;
            b.ui.multiselect.prototype._setSelected = function (a, d) {
                var c = o.call(this, a, d);
                if (d && this.selectedList) {
                    var e = this.element;
                    this.selectedList.find("li").each(function () {
                        b(this).data("optionLink") && b(this).data("optionLink").remove().appendTo(e)
                    })
                }
                return c
            }
        }
        b.ui.multiselect.prototype.destroy && (b.ui.multiselect.prototype.destroy = function () {
            this.element.show();
            this.container.remove();
            b.Widget === void 0 ? b.widget.prototype.destroy.apply(this, arguments) : b.Widget.prototype.destroy.apply(this, arguments)
        });
        b.jgrid._multiselect = !0
    }
    b.jgrid.extend({
        sortableColumns: function (a) {
            return this.each(function () {
                function d() {
                    c.p.disableClick = true
                }
                var c = this,
                    e = b.jgrid.jqID(c.p.id),
                    e = {
                        tolerance: "pointer",
                        axis: "x",
                        scrollSensitivity: "1",
                        items: ">th:not(:has(#jqgh_" + e + "_cb,#jqgh_" + e + "_rn,#jqgh_" + e + "_subgrid),:hidden)",
                        placeholder: {
                            element: function (a) {
                                return b(document.createElement(a[0].nodeName)).addClass(a[0].className + " ui-sortable-placeholder ui-state-highlight").removeClass("ui-sortable-helper")[0]
                            },
                            update: function (b, a) {
                                a.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10));
                                a.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") || 0, 10))
                            }
                        },
                        update: function (a, e) {
                            var d = b(e.item).parent(),
                                d = b(">th", d),
                                f = {},
                                g = c.p.id + "_";
                            b.each(c.p.colModel, function (b) {
                                f[this.name] = b
                            });
                            var j = [];
                            d.each(function () {
                                var a = b(">div", this).get(0).id.replace(/^jqgh_/, "").replace(g, "");
                                f.hasOwnProperty(a) && j.push(f[a])
                            });
                            b(c).jqGrid("remapColumns", j, true, true);
                            b.isFunction(c.p.sortable.update) && c.p.sortable.update(j);
                            setTimeout(function () {
                                c.p.disableClick = false
                            }, 50)
                        }
                    };
                if (c.p.sortable.options) b.extend(e, c.p.sortable.options);
                else if (b.isFunction(c.p.sortable)) c.p.sortable = {
                    update: c.p.sortable
                };
                if (e.start) {
                    var g = e.start;
                    e.start = function (b, a) {
                        d();
                        g.call(this, b, a)
                    }
                } else e.start = d;
                if (c.p.sortable.exclude) e.items = e.items + (":not(" + c.p.sortable.exclude + ")");
                a.sortable(e).data("sortable").floating = true
            })
        },
        columnChooser: function (a) {
            function d(a, c) {
                a && (typeof a == "string" ? b.fn[a] && b.fn[a].apply(c, b.makeArray(arguments).slice(2)) : b.isFunction(a) && a.apply(c, b.makeArray(arguments).slice(2)))
            }
            var c = this;
            if (!b("#colchooser_" + b.jgrid.jqID(c[0].p.id)).length) {
                var e = b('<div id="colchooser_' + c[0].p.id + '" style="position:relative;overflow:hidden"><div><select id="ddlcolchooser_' + c[0].p.id + '"class="selectpicker" multiple="multiple"></select></div></div>'),
                    g = b("select", e),
                    a = b.extend({
                        width: 420,
                        height: 240,
                        classname: null,
                        done: function (b) {
                            b && c.jqGrid("remapColumns", b, true)
                        },
                        msel: "multiselect",
                        dlog: "dialog",
                        dialog_opts: {
                            minWidth: 470
                        },
                        dlog_opts: function (a) {
                            var c = {};
                            c[a.bSubmit] = function () {
                                a.apply_perm();
                                a.cleanup(false)
                            };
                            c[a.bCancel] = function () {
                                a.cleanup(true)
                            };
                            return b.extend(true, {
                                buttons: c,
                                close: function () {
                                    a.cleanup(true)
                                },
                                modal: a.modal || false,
                                resizable: a.resizable || true,
                                width: a.width + 20
                            }, a.dialog_opts || {})
                        },
                        apply_perm: function () {
                            b("option", g).each(function () {
                                this.selected ? c.jqGrid("showCol", i[this.value].name) : c.jqGrid("hideCol", i[this.value].name)
                            });
                            var e = [];
                            b("option:selected", g).each(function () {
                                e.push(parseInt(this.value, 10))
                            });
                            b.each(e, function () {
                                delete m[i[parseInt(this, 10)].name]
                            });
                            b.each(m, function () {
                                var b = parseInt(this, 10);
                                var a = e,
                                    c = b;
                                if (c >= 0) {
                                    var d = a.slice(),
                                        i = d.splice(c, Math.max(a.length - c, c));
                                    if (c > a.length) c = a.length;
                                    d[c] = b;
                                    e = d.concat(i)
                                } else e = void 0
                            });
                            a.done && a.done.call(c, e)
                        },
                        cleanup: function (b) {
                            d(a.dlog, e, "destroy");
                            d(a.msel, g, "destroy");
                            e.remove();
                            b && a.done && a.done.call(c)
                        },
                        msel_opts: {}
                    }, b.jgrid.col, a || {});
                if (b.ui && b.ui.multiselect && a.msel == "multiselect") {
                    if (!b.jgrid._multiselect) {
                        alert("Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!");
                        return
                    }
                    a.msel_opts = b.extend(b.ui.multiselect.defaults, a.msel_opts)
                }
                a.caption && e.attr("title", a.caption);
                if (a.classname) {
                    e.addClass(a.classname);
                    g.addClass(a.classname)
                }
                if (a.width) {
                    b(">div", e).css({
                        width: a.width,
                        margin: "0 auto"
                    });
                    g.css("width", a.width)
                }
                if (a.height) {
                    b(">div", e).css("height", a.height);
                    g.css("height", a.height - 10)
                }
                var i = c.jqGrid("getGridParam", "colModel"),
                    q = c.jqGrid("getGridParam", "colNames"),
                    m = {},
                    f = [];
                g.empty();
                b.each(i, function (a) {

                //mathan
                    if(this.name != 'Action' && this.classes != 'Hide')
                    {
                        m[this.name] = a;
                        this.hidedlg ? this.hidden || f.push(a) : g.append("<option value='" + a + "' " + (this.hidden ? "" : "selected='selected'") + ">" + b.jgrid.stripHtml(q[a]) + "</option>")
                    }
                    else
                    {
                        m[this.name] = a;
                    }
                });
                var n = b.isFunction(a.dlog_opts) ? a.dlog_opts.call(c, a) : a.dlog_opts;
                d(a.dlog, e, n);
                n = b.isFunction(a.msel_opts) ? a.msel_opts.call(c, a) : a.msel_opts;
                d(a.msel, g, n)
            }
        },
        sortableRows: function (a) {
            return this.each(function () {
                var d = this;
                if (d.grid && !d.p.treeGrid && b.fn.sortable) {
                    a = b.extend({
                        cursor: "move",
                        axis: "y",
                        items: ".jqgrow"
                    }, a || {});
                    if (a.start && b.isFunction(a.start)) {
                        a._start_ = a.start;
                        delete a.start
                    } else a._start_ = false;
                    if (a.update && b.isFunction(a.update)) {
                        a._update_ = a.update;
                        delete a.update
                    } else a._update_ = false;
                    a.start = function (c, e) {
                        b(e.item).css("border-width", "0px");
                        b("td", e.item).each(function (b) {
                            this.style.width = d.grid.cols[b].style.width
                        });
                        if (d.p.subGrid) {
                            var g = b(e.item).attr("id");
                            try {
                                b(d).jqGrid("collapseSubGridRow", g)
                            } catch (i) { }
                        }
                        a._start_ && a._start_.apply(this, [c, e])
                    };
                    a.update = function (c, e) {
                        b(e.item).css("border-width", "");
                        d.p.rownumbers === true && b("td.jqgrid-rownum", d.rows).each(function (a) {
                            b(this).html(a + 1 + (parseInt(d.p.page, 10) - 1) * parseInt(d.p.rowNum, 10))
                        });
                        a._update_ && a._update_.apply(this, [c, e])
                    };
                    b("tbody:first", d).sortable(a);
                    b("tbody:first", d).disableSelection()
                }
            })
        },
        gridDnD: function (a) {
            return this.each(function () {
                function d() {
                    var a = b.data(c, "dnd");
                    b("tr.jqgrow:not(.ui-draggable)", c).draggable(b.isFunction(a.drag) ? a.drag.call(b(c), a) : a.drag)
                }
                var c = this,
                    e, g;
                if (c.grid && !c.p.treeGrid && b.fn.draggable && b.fn.droppable) {
                    b("#jqgrid_dnd")[0] === void 0 && b("body").append("<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>");
                    if (typeof a == "string" && a == "updateDnD" && c.p.jqgdnd === true) d();
                    else {
                        a = b.extend({
                            drag: function (a) {
                                return b.extend({
                                    start: function (e, d) {
                                        var f;
                                        if (c.p.subGrid) {
                                            f = b(d.helper).attr("id");
                                            try {
                                                b(c).jqGrid("collapseSubGridRow", f)
                                            } catch (g) { }
                                        }
                                        for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) b(b.data(c, "dnd").connectWith[f]).jqGrid("getGridParam", "reccount") == "0" && b(b.data(c, "dnd").connectWith[f]).jqGrid("addRowData", "jqg_empty_row", {});
                                        d.helper.addClass("ui-state-highlight");
                                        b("td", d.helper).each(function (b) {
                                            this.style.width = c.grid.headers[b].width + "px"
                                        });
                                        a.onstart && b.isFunction(a.onstart) && a.onstart.call(b(c), e, d)
                                    },
                                    stop: function (e, d) {
                                        var f;
                                        if (d.helper.dropped && !a.dragcopy) {
                                            f = b(d.helper).attr("id");
                                            f === void 0 && (f = b(this).attr("id"));
                                            b(c).jqGrid("delRowData", f)
                                        }
                                        for (f = 0; f < b.data(c, "dnd").connectWith.length; f++) b(b.data(c, "dnd").connectWith[f]).jqGrid("delRowData", "jqg_empty_row");
                                        a.onstop && b.isFunction(a.onstop) && a.onstop.call(b(c), e, d)
                                    }
                                }, a.drag_opts || {})
                            },
                            drop: function (a) {
                                return b.extend({
                                    accept: function (a) {
                                        if (!b(a).hasClass("jqgrow")) return a;
                                        a = b(a).closest("table.ui-jqgrid-btable");
                                        if (a.length > 0 && b.data(a[0], "dnd") !== void 0) {
                                            a = b.data(a[0], "dnd").connectWith;
                                            return b.inArray("#" + b.jgrid.jqID(this.id), a) != -1 ? true : false
                                        }
                                        return false
                                    },
                                    drop: function (e, d) {
                                        if (b(d.draggable).hasClass("jqgrow")) {
                                            var f = b(d.draggable).attr("id"),
                                                f = d.draggable.parent().parent().jqGrid("getRowData", f);
                                            if (!a.dropbyname) {
                                                var g = 0,
                                                    j = {},
                                                    h, l, p = b("#" + b.jgrid.jqID(this.id)).jqGrid("getGridParam", "colModel");
                                                try {
                                                    for (l in f) if (f.hasOwnProperty(l)) {
                                                        h = p[g].name;
                                                        h == "cb" || h == "rn" || h == "subgrid" || f.hasOwnProperty(l) && p[g] && (j[h] = f[l]);
                                                        g++
                                                    }
                                                    f = j
                                                } catch (o) { }
                                            }
                                            d.helper.dropped = true;
                                            if (a.beforedrop && b.isFunction(a.beforedrop)) {
                                                h = a.beforedrop.call(this, e, d, f, b("#" + b.jgrid.jqID(c.p.id)), b(this));
                                                h !== void 0 && h !== null && typeof h == "object" && (f = h)
                                            }
                                            if (d.helper.dropped) {
                                                var k;
                                                if (a.autoid) if (b.isFunction(a.autoid)) k = a.autoid.call(this, f);
                                                else {
                                                    k = Math.ceil(Math.random() * 1E3);
                                                    k = a.autoidprefix + k
                                                }
                                                b("#" + b.jgrid.jqID(this.id)).jqGrid("addRowData", k, f, a.droppos)
                                            }
                                            a.ondrop && b.isFunction(a.ondrop) && a.ondrop.call(this, e, d, f)
                                        }
                                    }
                                }, a.drop_opts || {})
                            },
                            onstart: null,
                            onstop: null,
                            beforedrop: null,
                            ondrop: null,
                            drop_opts: {
                                activeClass: "ui-state-active",
                                hoverClass: "ui-state-hover"
                            },
                            drag_opts: {
                                revert: "invalid",
                                helper: "clone",
                                cursor: "move",
                                appendTo: "#jqgrid_dnd",
                                zIndex: 5E3
                            },
                            dragcopy: false,
                            dropbyname: false,
                            droppos: "first",
                            autoid: true,
                            autoidprefix: "dnd_"
                        }, a || {});
                        if (a.connectWith) {
                            a.connectWith = a.connectWith.split(",");
                            a.connectWith = b.map(a.connectWith, function (a) {
                                return b.trim(a)
                            });
                            b.data(c, "dnd", a);
                            c.p.reccount != "0" && !c.p.jqgdnd && d();
                            c.p.jqgdnd = true;
                            for (e = 0; e < a.connectWith.length; e++) {
                                g = a.connectWith[e];
                                b(g).droppable(b.isFunction(a.drop) ? a.drop.call(b(c), a) : a.drop)
                            }
                        }
                    }
                }
            })
        },
        gridResize: function (a) {
            return this.each(function () {
                var d = this,
                    c = b.jgrid.jqID(d.p.id);
                if (d.grid && b.fn.resizable) {
                    a = b.extend({}, a || {});
                    if (a.alsoResize) {
                        a._alsoResize_ = a.alsoResize;
                        delete a.alsoResize
                    } else a._alsoResize_ = false;
                    if (a.stop && b.isFunction(a.stop)) {
                        a._stop_ = a.stop;
                        delete a.stop
                    } else a._stop_ = false;
                    a.stop = function (e, g) {
                        b(d).jqGrid("setGridParam", {
                            height: b("#gview_" + c + " .ui-jqgrid-bdiv").height()
                        });
                        b(d).jqGrid("setGridWidth", g.size.width, a.shrinkToFit);
                        a._stop_ && a._stop_.call(d, e, g)
                    };
                    a.alsoResize = a._alsoResize_ ? eval("(" + ("{'#gview_" + c + " .ui-jqgrid-bdiv':true,'" + a._alsoResize_ + "':true}") + ")") : b(".ui-jqgrid-bdiv", "#gview_" + c);
                    delete a._alsoResize_;
                    b("#gbox_" + c).resizable(a)
                }
            })
        }
    })
})(jQuery);