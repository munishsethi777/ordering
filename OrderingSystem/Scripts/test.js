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