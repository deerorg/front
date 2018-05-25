define(function(require) {
  var e = require("jquery"),
    t = require("dialog");
  (function(e) {
    e.fn.TimePlan = function(i) {
      function n(t) {
        if (O && A.drawSection != null) {
          var i = Math.floor(S(t.clientX) - A.minClientX)
          if (W > i) {
            return A.drawEndClientX = A.drawStartClientX,
            void 0
          }
          if (h(A.drawSection.day, i)) { return }
          if (g(A.drawSection.day, W, i)) { return }
          A.drawEndClientX = i
          var n = A.drawEndClientX - A.drawStartClientX
          A.drawSection.width(n),
          e("#" + A.id + "_tipsLeft").css({
            left: A.drawStartClientX + 42,
            top: 45 * A.drawSection.day + 40
          }).text(u(A.drawStartClientX).substring(0, 5)).show(),
          e("#" + A.id + "_tipsRight").css({
            left: A.drawEndClientX + 41,
            top: 45 * A.drawSection.day + 40
          }).text(u(A.drawEndClientX).substring(0, 5)).show()
        }
        if (H != null && X == "") {
          z.is(":visible") && z.hide()
          var a = t.clientX - A.minClientX - W,
            o = H.start + a,
            r = o + (H.end - H.start)
          if (B.min > o || r > B.max) { return }
          w.css({
            left: o
          }),
          j = {
            start: o,
            end: r
          },
          e("#" + A.id + "_tipsLeft").css({
            left: o + 42,
            top: 45 * w.day + 40
          }).text(u(o).substring(0, 5)).show(),
          e("#" + A.id + "_tipsRight").css({
            left: r + 41,
            top: 45 * w.day + 40
          }).text(u(r).substring(0, 5)).show()
        }
        if (H != null && X != "") {
          z.is(":visible") && z.hide()
          var o, r, a = t.clientX - A.minClientX - W
          if (X == "left") {
            if (o = H.start + a,
              r = H.end,
              B.min > o || a > 0 && o > r - 5) { return }
          } else if (o = H.start,
            r = H.end + a,
            r > B.max || a < 0 && o + 5 > r) { return }
          w.css({
            left: o,
            width: r - o
          }),
          j = {
            start: o,
            end: r
          },
          e("#" + A.id + "_tipsLeft").css({
            left: o + 42,
            top: 45 * w.day + 40
          }).text(u(o).substring(0, 5)).show(),
          e("#" + A.id + "_tipsRight").css({
            left: r + 41,
            top: 45 * w.day + 40
          }).text(u(r).substring(0, 5)).show()
        }
      }

      function a() {
        if (e("#" + A.id + "_tipsLeft, #" + A.id + "_tipsRight").hide(),
          O = !1,
          A.drawSection != null) {
          if (A.drawStartClientX == A.drawEndClientX || A.drawEndClientX == 0) {
            return A.drawSection.unbind().remove(),
            A.drawSection = null,
            void 0
          }
          var t = {
            type: E,
            start: A.drawStartClientX,
            end: A.drawEndClientX,
            number: "0"
          };
          (E == "patrol" || E == "pattern" || E == "preset" || E == "auxoutput") && (t.number = "1")
          for (var i = 0, n = 0, a = 0, o = N[A.drawSection.day].length; o > a; a++) {
            n = N[A.drawSection.day][a].start,
            A.drawStartClientX > n && (i = a + 1)
          }
          N[A.drawSection.day].splice(i, 0, t),
          R[A.drawSection.day] === void 0 && (R[A.drawSection.day] = []),
          R[A.drawSection.day].splice(i, 0, {
            type: t.type,
            sTime: u(t.start),
            eTime: u(t.end),
            number: t.number
          }),
          A.drawSection.end = A.drawEndClientX,
          A.drawSection.sec = t,
          A.drawSection = null,
          A.drawStartClientX = 0,
          A.drawEndClientX = 0
        }
        if (H != null && j != null) {
          var r = j.start,
            s = j.end
          H.start = r,
          H.end = s,
          K.sTime = u(r),
          K.eTime = u(s),
          w.start = r,
          w.end = s,
          j = null
        }
        if (H != null && X != "" && j != null) {
          var r = j.start,
            s = j.end
          H.start = r,
          H.end = s,
          K.sTime = u(r),
          K.eTime = u(s),
          w.start = r,
          w.end = s,
          j = null
        }
        X = "",
        H = null,
        e(document).unbind("mousemove"),
        e(document).unbind("mouseup")
      }

      function o() {
        if (M != null && M.length != 0) {
          var t = ""
          e.each(M, function() {
            t += '<option value="' + this + '"></option>'
          }),
          e("#" + A.id + "_drawTypeSel").empty().append(t).show()
          var i = ""
          e.each(M, function() {
            e.inArray("" + this, k) == -1 && (i += '<div class="drawtype"><span class="color" style="background-color:' + V[this] + '"></span><span class="txt"></span></div>')
          }),
          e("#" + A.id + "_drawTypeShow").empty().append(i),
          y(),
          P(),
          e.each(M, function() {
            e.inArray("" + this, k) > -1 && e("#" + A.id + "_drawTypeSel option[value='" + this + "']").remove()
          })
        }
      }

      function r() {
        e("#" + A.id + " ." + A.prefix + "section").unbind().remove()
        for (var t = 0; t < 8; t++) { N[t] = [] }
        z && z.hide(),
        w = null,
        e("#" + A.id + "_delete").prop("disabled", !0),
        R != null && e.each(R, function(t, i) {
          e.each(i, function(e, i) {
            var n = {}
            n.type = i.type,
            n.start = c(i.sTime),
            n.end = c(i.eTime),
            n.number = i.number || 0,
            N[t].push(n)
            var i = d(t, n.type, n.start, n.end)
            i.sec = n,
            A.dayTimePlans[t].append(i)
          })
        })
      }

      function s() {
        e("#" + A.id + " ." + A.prefix + "section").unbind().remove(),
        e.each(N, function(t) {
          e.each(this, function() {
            var e = d(t, this.type, this.start, this.end)
            e.sec = this,
            A.dayTimePlans[t].append(e)
          })
        })
      }

      function l(e) {
        var t = 0
        if (e != "") {
          var i = e.split(":")
          t = 60 * parseInt(i[0], 10) + parseInt(i[1], 10)
        }
        return t
      }

      function c(e) {
        var t = 0
        if (e != "") {
          var i = e.split(":")
          t = Math.round((60 * parseInt(i[0], 10) + parseInt(i[1], 10)) * A.minuteWidth)
        }
        return t
      }

      function u(e) {
        var t = ""
        if (e >= 0) {
          var i = e / A.minuteWidth,
            n = "",
            a = ""
          n = Math.floor(i / 60),
          n < 10 && (n = "0" + n),
          a = Math.floor(i % 60),
          a < 10 && (a = "0" + a),
          t = n + ":" + a + ":00"
        }
        return t
      }

      function d(t, i, n, a) {
        var o = 0,
          r = 0,
          s = ""
        o = n,
        r = a === void 0 ? n : a,
        o = Math.floor(o),
        r = Math.floor(r),
        s = V[i],
        s === void 0 && (s = V.AllEvent)
        var l = e("<div class='" + A.prefix + "section'><i class='" + A.prefix + "resizeLeft'></i><i class='" + A.prefix + "resizeRight'></i></div>").css({
          position: "absolute",
          left: o,
          height: 16,
          width: r - o ? r - o : 1,
          background: s,
          boxSizing: "border-box"
        })
        return l.bind({
          mouseover: function() {
            if (!O) {
              for (var i = null, n = "", a = "", o = 0, r = N[t].length; r > o; o++) {
                if (i = N[t][o],
                  i.start == l.sec.start && i.end == l.sec.end) {
                  n = R[t][o].sTime,
                  a = R[t][o].eTime
                  break
                }
              }
              n = n.substring(0, 5),
              a = a.substring(0, 5)
              var s = e("#" + A.id + "_timeTipHover"),
                c = ""
              M != null && M.length > 0 && (c += i.type == "patrol" || i.type == "pattern" || i.type == "preset" || i.type == "auxoutput" ? T(i.type) + "(" + i.number + ")<br/>" : T(i.type) + "<br/>"),
              c += n + " - " + a,
              s.find("div").eq(0).html(c),
              s.css({
                left: e(l).position().left + e(l).outerWidth() / 2 + 9,
                top: 45 * t + (60 - s.height())
              }).show()
            }
          },
          mouseout: function() {
            e("#" + A.id + "_timeTipHover").hide()
          },
          mousedown: function(i) {
            X = i.target.className == A.prefix + "resizeLeft" ? "left" : i.target.className == A.prefix + "resizeRight" ? "right" : "",
            e("#" + A.id + "_timeTipHover").hide(),
            w != null && (w.css({
              border: 0
            }),
              e("." + A.prefix + "resizeLeft", w).eq(0).hide(),
              e("." + A.prefix + "resizeRight", w).eq(0).hide()),
            e(this).css({
              border: "1px dotted #000000"
            }),
            e("." + A.prefix + "resizeLeft", this).eq(0).css("display", "inline-block"),
            e("." + A.prefix + "resizeRight", this).eq(0).css("display", "inline-block"),
            e("#" + A.id + "_delete").prop("disabled", !1),
            w = e(this),
            w.day = t
            var n = this.sec || l.sec
            w.start = n.start,
            w.end = n.end,
            w.number = n.number,
            M != null && M.length > 0 && e("#" + A.id + "_drawTypeSel2").val(n.type),
            (n.type == "patrol" || n.type == "pattern" || n.type == "preset" || n.type == "auxoutput") && e("#" + A.id + "_drawNumberSel").val(n.number)
            for (var a = null, o = "", r = "", s = 0, c = N[w.day].length; c > s; s++) {
              if (a = N[w.day][s],
                a.start == w.start && a.end == w.end) {
                o = R[w.day][s].sTime,
                r = R[w.day][s].eTime,
                w.oSec = R[w.day][s]
                break
              }
            }
            o = o.split(":"),
            r = r.split(":"),
            z.find(".txt").each(function(t) {
              t < 2 ? e(this).val(o[t]) : e(this).val(r[t - 2])
            }),
            m(n.type, n.number),
            p()
          }
        }),
        l
      }

      function p() {
        z.css({
          left: e(w).position().left + e(w).outerWidth() / 2 - 33,
          top: 45 * w.day + (60 - z.height())
        }).show()
      }

      function m(t, n) {
        if (t == "patrol" || t == "pattern" || t == "preset" || t == "auxoutput") {
          for (var a = "<select style='margin-top: 5px;'>", o = i.oAlarmOutNum, r = 1; o[t] >= r; r++) { a += '<option value="' + r + '">' + r + "</option>" }
          a += "</select>",
          e("#" + A.id + "_numberSel").empty().append(e(a).width(147).attr("id", A.id + "_drawNumberSel")),
          e("#" + A.id + "_drawNumberSel").val(n)
        } else { e("#" + A.id + "_numberSel").empty() }
      }

      function h(e, t) {
        for (var i = end = 0, n = 0, a = N[e].length; a > n; n++) {
          if (i = N[e][n].start,
            end = N[e][n].end,
            t >= i && end >= t) { return !0 }
        }
        return !1
      }

      function g(e, t, i) {
        for (var n = end = 0, a = 0, o = N[e].length; o > a; a++) {
          if (n = N[e][a].start,
            end = N[e][a].end,
            n >= t && i >= end) { return !0 }
        }
        return !1
      }

      function f() {
        for (var e = null, t = 0, i = N[w.day].length; i > t; t++) {
          if (e = N[w.day][t],
            e.start == w.start && e.end == w.end) {
            var n = z.find(".txt"),
              a = null,
              o = null,
              r = n.eq(0).val() + ":" + n.eq(1).val() + ":00",
              s = n.eq(2).val() + ":" + n.eq(3).val() + ":00"
            if (R[w.day][t].sTime == r && R[w.day][t].eTime == s) { break }
            t - 1 >= 0 && (a = R[w.day][t - 1]),
            i > t + 1 && (o = R[w.day][t + 1])
            var c = l(r)
            if (a != null && l(a.eTime) > c) { return !0 }
            var u = l(s)
            if (o != null && u > l(o.sTime)) { return !0 }
            break
          }
        }
        return !1
      }

      function v(e) {
        return N[e].length == i.sectionNum ? !1 : !0
      }

      function S(e) {
        return A.minClientX > e ? A.minClientX : e > A.maxClientX ? A.maxClientX : e
      }

      function P() {
        var n = "<div id='" + A.id + "_timetip' class='" + A.prefix + "timetip'>" + "<div class='" + A.prefix + "timetip_top'></div>" + "<div id='" + A.id + "_timetip_middle' class='" + A.prefix + "timetip_middle'>" + "<div id='" + A.id + "_typeSel'></div>" + "<div id='" + A.id + "_numberSel'></div>" + "<div style='padding-top: 5px;'>" + "<input type='text' class='txt' maxlength='2' onpaste='return false' /> : <input type='text' class='txt' maxlength='2' onpaste='return false' />" + " - <input type='text' class='txt' maxlength='2' onpaste='return false' /> : <input type='text' class='txt' maxlength='2' onpaste='return false' /></div>" + "<div style='padding: 5px 0;'>" + "<span class='ctrl'>" + i.lan["delete"] + "</span> | <span class='ctrl'>" + i.lan.save + "</span>"
        i.onScenceCfg && (n += " | <span class='ctrl'>" + i.lan.config + "</span>"),
        n += "</div><span class='close'></span></div><div class='" + A.prefix + "timetip_bottom'></div>" + "</div>",
        z = e(n),
        e("#" + A.id + "_timetip").length > 0 && e("#" + A.id + "_timetip").unbind().remove(),
        e(A).append(z),
        M != null && M.length > 0 && (e("#" + A.id + "_typeSel").append(e("#" + A.id + "_drawTypeSel").clone().width(147).attr("id", A.id + "_drawTypeSel2")),
          E = M[0],
          e("#" + A.id + "_drawTypeSel2").change(function() {
            m(e(this).val(), 1),
            p()
          })),
        z.bind("click", function(e) {
          e.stopPropagation()
        }),
        z.find(".txt").each(function(t) {
          t % 2 == 0 ? e(this).bind("keyup", function() {
            b(this)
          }) : e(this).bind("keyup", function() {
            C(this)
          })
        }),
        z.find(".close").eq(0).click(function() {
          z.hide()
        }),
        z.find(".ctrl").eq(0).click(function() {
          e("#" + A.id + "_delete").click()
        }),
        z.find(".ctrl").eq(1).click(function() {
          if (D()) {
            if (f()) { t.alert(i.lan.timeIntersect) } else {
              for (var n = z.find(".txt"), a = n.eq(0).val() + ":" + n.eq(1).val() + ":00", o = n.eq(2).val() + ":" + n.eq(3).val() + ":00", r = c(a), s = c(o), l = null, u = 0, d = N[w.day].length; d > u; u++) {
                if (l = N[w.day][u],
                  l.start == w.start && l.end == w.end) {
                  if (M != null && M.length > 0) {
                    l.type = e("#" + A.id + "_drawTypeSel2").val()
                    var p = V[l.type]
                    p === void 0 && (p = V.AllEvent),
                    w.css({
                      background: p
                    }),
                    R[w.day][u].type = l.type,
                    l.number = "0",
                    (l.type == "patrol" || l.type == "pattern" || l.type == "preset" || l.type == "auxoutput") && (l.number = e("#" + A.id + "_drawNumberSel").val()),
                    R[w.day][u].number = l.number
                  }
                  w.css({
                    left: r,
                    width: s - r ? s - r : 1
                  }),
                  l.start = r,
                  l.end = s,
                  R[w.day][u].sTime = a,
                  R[w.day][u].eTime = o
                  break
                }
              }
              z.hide()
            }
          } else { t.alert(i.lan.sTimeEarlierETime) }
        }),
        i.onScenceCfg && z.find(".ctrl").eq(2).click(function() {
          i.onScenceCfg(w)
        })
      }

      function b(t) {
        Number(t.value) <= 24 ? Number(t.value) == 24 && e(t).next().val("00") : t.value = t.value.replace(t.value, "00")
      }

      function C(t) {
        Number(t.value) <= 59 ? Number(e(t).prev().val()) == 24 && (t.value = "00") : t.value = t.value.replace(t.value, "00")
      }

      function _() {
        var t = "<table id='" + A.id + "_checkboxs' class='" + A.prefix + "checkboxs' cellspacing='0' cellspadding='0' border='0'>" + "<tr><td colspan='3'><div class='" + A.prefix + "copyto_top'><label class='" + A.prefix + "copyto_txt' id='" + A.id + "_copyTo_txt'>复制到...</label><span class='" + A.prefix + "copyto_checkall'><input id='" + A.id + "_checkall' type='checkbox' class='" + A.prefix + "checkbox' /><label id='" + A.id + "_selAll'>全选</label></span></div></td></tr>" + "<tr><td><input type='checkbox' class='" + A.prefix + "checkbox' day='0' /><label id='" + A.id + "_monDay1'>星期一</label></td><td><input type='checkbox' class='" + A.prefix + "checkbox' day='1' /><label id='" + A.id + "_tueDay1'>星期二</label></td><td><input type='checkbox' class='" + A.prefix + "checkbox' day='2' /><label id='" + A.id + "_wedDay1'>星期三</label></td></tr>" + "<tr><td><input type='checkbox' class='" + A.prefix + "checkbox' day='3' /><label id='" + A.id + "_thuDay1'>星期四</label></td><td><input type='checkbox' class='" + A.prefix + "checkbox' day='4' /><label id='" + A.id + "_friDay1'>星期五</label></td><td><input type='checkbox' class='" + A.prefix + "checkbox' day='5' /><label id='" + A.id + "_satDay1'>星期六</label></td></tr>" + "<tr><td><input type='checkbox' class='" + A.prefix + "checkbox' day='6' /><label id='" + A.id + "_sunDay1'>星期日</label></td><td>"
        t += i.holiday ? "<input type='checkbox' class='" + A.prefix + "checkbox' day='7' /><label id='" + A.id + "_holDay1'>假日</label></td>" : "&nbsp;</td>",
        t += "<td>&nbsp;</td></tr>",
        t += "<tr><td class='" + A.prefix + "copyto_bottom' colspan='3'><button type='button' class='btn btn-browser' id='" + A.id + "_ok'>确定</button><button type='button' class='btn btn-browser' id='" + A.id + "_cancel'>取消</button></td></tr></table>",
        e("#" + A.id + "_checkboxs").length > 0 && e("#" + A.id + "_checkboxs").unbind().remove(),
        F = e(t),
        e(A).append(F),
        e("#" + A.id + "_checkall").click(function() {
          e("#" + A.id + "_checkboxs ." + A.prefix + "checkbox").not(":first").not(":disabled").prop("checked", e(this).prop("checked"))
        }),
        e("#" + A.id + "_checkboxs ." + A.prefix + "checkbox").not(":first").click(function(t) {
          e(this).prop("disabled") && t.preventDefault(),
          e("#" + A.id + "_checkboxs ." + A.prefix + "checkbox").not(":first").not(":checked").length > 0 ? e("#" + A.id + "_checkall").prop("checked", !1) : e("#" + A.id + "_checkall").prop("checked", !0)
        }),
        e("#" + A.id + "_ok").click(function() {
          F.hide(),
          I()
        }),
        e("#" + A.id + "_cancel").click(function() {
          F.hide()
        })
      }

      function I() {
        var t, n = -1,
          a = e.extend(!0, [], N[q]),
          o = []
        e("#" + A.id + "_checkboxs ." + A.prefix + "checkbox").not(":first").each(function() {
          e(this).prop("checked") && !e(this).prop("disabled") && (n = e(this).attr("day"),
            o.push(n),
            N[n] = [],
            e.extend(!0, N[n], a),
            R[n] = [],
            e.each(a, function(i) {
              t = R[q][i].scenePatrol,
              angular.isDefined(t) && (t = e.extend(!0, [], t)),
              R[n][i] = {
                type: this.type,
                sTime: R[q][i].sTime,
                eTime: R[q][i].eTime,
                number: this.number,
                scenePatrol: t
              }
            }))
        }),
        s(),
        i.onScenceCfg && i.onScenceCfg("copyto", q, o)
      }

      function y() {
        if (i.lan != null) {
          var t = i.lan
          if (M != null && M.length > 0) {
            var n, a = e("#" + A.id + "_drawTypeSel option"),
              o = e("#" + A.id + "_drawTypeShow .txt"),
              r = 0
            e.each(M, function(t) {
              n = T("" + this),
              a.eq(t).text(n), e.inArray("" + this, k) == -1 && o.eq(r++).text(n)
            })
          }
          e("#" + A.id + "_delete_txt").text(t["delete"]),
          e("#" + A.id + "_deleteAll_txt").text(t.deleteAll),
          e("#" + A.id + "_advanced").text(t.advancedParam),
          e("#" + A.id + "_selAll").text(t.selectAll).attr("title", t.selectAll),
          e("#" + A.id + "_ok").text(t.ok),
          e("#" + A.id + "_cancel").text(t.cancel),
          e("#" + A.id + "_copyTo_txt").text(t.copyTo),
          e("#" + A.id + "_monDay, #" + A.id + "_monDay1").text(t.monday).attr("title", t.monday),
          e("#" + A.id + "_tueDay, #" + A.id + "_tueDay1").text(t.tuesday).attr("title", t.tuesday),
          e("#" + A.id + "_wedDay, #" + A.id + "_wedDay1").text(t.wednesday).attr("title", t.wednesday),
          e("#" + A.id + "_thuDay, #" + A.id + "_thuDay1").text(t.thursday).attr("title", t.thursday),
          e("#" + A.id + "_friDay, #" + A.id + "_friDay1").text(t.friday).attr("title", t.friday),
          e("#" + A.id + "_satDay, #" + A.id + "_satDay1").text(t.saturday).attr("title", t.saturday),
          e("#" + A.id + "_sunDay, #" + A.id + "_sunDay1").text(t.sunday).attr("title", t.sunday),
          e("#" + A.id + "_holDay, #" + A.id + "_holDay1").text(t.holiday).attr("title", t.holiday)
        }
      }

      function T(e) {
        if (i.lan == null) { return "" }
        var t = i.lan,
          n = {
            CMR: t.continuous,
            MOTION: t.motion,
            ALARM: t.alarm,
            EDR: t.motionOrAlarm,
            ALARMANDMOTION: t.motionAndAlarm,
            COMMAND: t.command,
            SMART: "Smart",
            AllEvent: t.event,
            SCENE1: t.SceneDefault + "1",
            SCENE2: t.SceneDefault + "2",
            SCENE3: t.SceneDefault + "3",
            SCENE4: t.SceneDefault + "4",
            disable: t.off,
            autoscan: t.autoScan,
            framescan: t.frameScan,
            randomscan: t.randomScan,
            patrol: t.patrolScan,
            pattern: t.pattern,
            preset: t.preset,
            panoramascan: t.panoramaScan,
            tiltscan: t.tiltScan,
            periodreboot: t.domeReboot,
            periodadjust: t.domeAdjust,
            auxoutput: t.auxOutput,
            LineDetection: t.lineCrossDetect,
            FieldDetection: t.fieldDetectionType,
            AudioDetection: t.audioDetection,
            facedetection: t.faceDetection,
            regionEntrance: t.regionEntranceDetect,
            regionExiting: t.regionExitDetect,
            loitering: t.loiterDetect,
            group: t.peopleGatherDetect,
            rapidMove: t.fastMoveDetect,
            parking: t.parkDetect,
            unattendedBaggage: t.unattendedBaggageDetect,
            attendedBaggage: t.objectRemovalDetect,
            scenechangedetection: t.sceneChangeDetection,
            pir: t.pir,
            wlsensor: t.wlsensor,
            callhelp: t.callhelp,
            INTELLIGENT: t.intelligent,
            vandalProofDetection: t.vandalProofAlarm,
            illegalParkingDetection: t.illegalParking
          }
        return n[e]
      }

      function D() {
        var t = z.find(".txt")
        e.each(t, function() {
          e.trim(e(this).val()) == "" && e(this).val("00"),
          parseInt(e(this).val(), 10) < 10 && e(this).val("0" + parseInt(e(this).val(), 10))
        })
        var i = 60 * Number(t.eq(0).val()) + Number(t.eq(1).val()),
          n = 60 * Number(t.eq(2).val()) + Number(t.eq(3).val())
        return i >= n ? !1 : !0
      }

      function L() {
        for (var e = [], t = ["mon", "tue", "wed", "thu", "fri", "sat", "sun", "hol"], i = 0; i < 8; i++) {
          i == 7 ? e.push('<div class="' + A.prefix + 'day" day="' + i + '" id="' + A.id + '_holDayDiv" style="display:none;">') : e.push('<div class="' + A.prefix + 'day" day="' + i + '">'),
          e.push('<div class="' + A.prefix + 'dayname" day="' + i + '"><label id="' + A.id + "_" + t[i] + 'Day"></label></div>'),
          e.push('<div class="' + A.prefix + 'daydraw">'),
          e.push('<div id="' + A.id + "_dayTimePlan" + i + '" day="' + i + '" class="' + A.prefix + 'daytimeplan"></div>'),
          e.push("</div>"),
          e.push('<div class="' + A.prefix + 'copyto" day="' + i + '"></div>'),
          e.push("</div>")
        }
        return e.join("")
      }

      function x() {
        var t = e(A).find(".timeplan_days").eq(0).outerWidth(),
          n = e(A).height()
        i.editable ? e("#" + A.id + "_mask").hide() : e("#" + A.id + "_mask").css({
          width: t,
          height: n
        }).show()
      }
      i = e.extend({
        sectionNum: 8,
        data: null,
        mode: 0,
        holiday: !1,
        types: null,
        lan: null,
        editable: !0,
        onAdvanced: null,
        onScenceCfg: null,
        oAlarmOutNum: {
          patrol: 8,
          pattern: 4,
          preset: 8,
          auxoutput: 2
        }
      }, i),
      e.extend(this, {
        id: e(this).attr("id"),
        prefix: "timeplan_",
        minuteWidth: 0.4,
        minClientX: 0,
        maxClientX: 0,
        drawSection: null,
        drawStartClientX: 0,
        drawEndClientX: 0,
        dayTimePlans: [],
        setType: function(e) {
          M = e,
          o()
        },
        setData: function(e) {
          R = e,
          r()
        },
        setSectionNum: function(e) {
          i.sectionNum = e
        },
        setAlarmOutNum: function(e) {
          i.oAlarmOutNum = e
        },
        setEditable: function(e) {
          i.editable = e,
          x()
        },
        setMode: function(t) {
          i.mode = t,
          e("#" + A.id + "_advanced").toggle(t === 1)
        }
      })
      var A = this,
        V = {
          CMR: "#637DEC",
          MOTION: "#74B557",
          ALARM: "#B83F42",
          EDR: "#E58805",
          ALARMANDMOTION: "#B9E2FE",
          COMMAND: "#15B89B",
          SMART: "#F66D72",
          AllEvent: "#AA6FFE",
          SCENE1: "#637DEC",
          SCENE2: "#74B557",
          SCENE3: "#B83F42",
          SCENE4: "#E58805",
          disable: "#808080",
          autoscan: "#637DEC",
          framescan: "#74B557",
          randomscan: "#E58805",
          patrol: "#B9E2FE",
          pattern: "#15B89B",
          preset: "#F66D72",
          panoramascan: "#8C97CB",
          tiltscan: "#5F52A0",
          periodreboot: "#EC6941",
          periodadjust: "#419923",
          auxoutput: "#16A1E0"
        },
        k = ["LineDetection", "FieldDetection", "AudioDetection", "facedetection", "regionEntrance", "regionExiting", "loitering", "group", "rapidMove", "parking", "unattendedBaggage", "attendedBaggage", "scenechangedetection", "pir", "wlsensor", "callhelp", "INTELLIGENT", "vandalProofDetection"],
        M = null,
        R = null,
        N = [],
        w = null,
        z = null,
        E = "CMR",
        O = !1,
        W = -1,
        q = -1,
        F = null,
        H = null,
        K = null,
        B = {},
        j = null,
        X = "",
        $ = '<div class="' + this.prefix + 'btns">' + '<div class="' + this.prefix + 'btn"><select id="' + this.id + '_drawTypeSel" style="display:none;"></select></div>' + '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_delete"><span class="delete">&nbsp;</span><span id="' + this.id + '_delete_txt">删除</span></button></div>' + '<div class="' + this.prefix + 'btn"><button type="button" class="btn noBorder" id="' + this.id + '_deleteAll"><span class="deleteAll">&nbsp;</span><span id="' + this.id + '_deleteAll_txt">删除全部</span></button></div>' + '<div class="' + this.prefix + 'btn" style="float:right;"><button type="button" class="btn" id="' + this.id + '_advanced" style="display:none;">高级参数</button></div>' + "</div>" + '<div class="' + this.prefix + 'days" onselectstart="return false;" style="-moz-user-select:none;">' + L() + "</div>" + '<div id="' + this.id + '_drawTypeShow" class="' + this.prefix + 'drawtypes"></div>' + '<div style="clear: both;"></div>'
      $ += '<div id="' + this.id + '_timeTipHover" class="' + this.prefix + 'timetip_hover"><div class="' + this.prefix + 'timetip_hover_top"></div><div class="' + this.prefix + 'timetip_hover_bottom"></div></div>',
      $ += '<div id="' + this.id + '_tipsLeft" class="' + this.prefix + 'tipsleft"></div>',
      $ += '<div id="' + this.id + '_tipsRight" class="' + this.prefix + 'tipsright"></div>',
      $ += '<div id="' + this.id + '_mask" class="' + this.prefix + 'mask"></div>',
      this.html($),
      this.css("position", "relative"),
      i.types && (M = i.types),
      i.data && (R = i.data),
      e("#" + A.id + "_advanced").click(function() {
        i.onAdvanced && i.onAdvanced()
      }),
      i.mode == 1 && e("#" + A.id + "_advanced").show(),
      i.holiday && e("#" + A.id + "_holDayDiv").show(),
      e("#" + A.id + "_drawTypeSel").change(function() {
        E = e(this).val()
      }),
      e("#" + A.id + "_delete").click(function() {
        if (w != null) {
          w.unbind().remove(),
          z.hide()
          for (var t = null, i = 0, n = N[w.day].length; n > i; i++) {
            if (t = N[w.day][i],
              t.start == w.start && t.end == w.end) {
              N[w.day].splice(i, 1),
              R[w.day].splice(i, 1)
              break
            }
          }
          w = null,
          e("#" + A.id + "_delete").prop("disabled", !0)
        }
      }).prop("disabled", !0),
      e("#" + this.id + "_deleteAll").click(function() {
        e("#" + A.id + " ." + A.prefix + "section").unbind().remove(),
        z.hide(),
        e.each(N, function(e) {
          N[e] = [],
          R[e] = []
        }),
        w = null,
        e("#" + A.id + "_delete").prop("disabled", !0)
      }),
      e("#" + A.id + " ." + A.prefix + "day").each(function() {
        e(this).bind({
          mouseover: function() {
            X == "" && e("." + A.prefix + "copyto", this).eq(0).show()
          },
          mouseout: function() {
            X == "" && e("." + A.prefix + "copyto", this).eq(0).hide()
          }
        })
      }),
      e("#" + A.id + " ." + A.prefix + "copyto").each(function() {
        e(this).bind({
          mouseout: function() {},
          click: function(t) {
            t.stopPropagation(),
            q = parseInt(e(this).attr("day"), 10),
            F.css({
              left: e(this).position().left - F.outerWidth(),
              top: e(this).position().top - F.outerHeight() / 2 + 25
            }).show()
            var i = e("#" + A.id + "_checkboxs")
            i.find("." + A.prefix + "checkbox:disabled").prop("disabled", !1),
            i.find("." + A.prefix + "checkbox:checked").prop("checked", !1),
            i.find("." + A.prefix + "checkbox[day='" + q + "']").prop("disabled", !0).prop("checked", !0),
            w != null && (w.css({
              height: 16,
              border: 0
            }),
              e("." + A.prefix + "resizeLeft", w).eq(0).hide(),
              e("." + A.prefix + "resizeRight", w).eq(0).hide(),
              z.hide(),
              w = null,
              e("#" + A.id + "_delete").prop("disabled", !0))
          }
        })
      })
      for (var U = 0; U < 8; U++) { A.dayTimePlans.push(e("#" + A.id + "_dayTimePlan" + U)) }
      return e.each(A.dayTimePlans, function(t) {
        e(this).bind({
          mousedown: function(i) {
            if (A.minClientX = Math.floor(A.offset().left) + 60,
              A.maxClientX = Math.floor(A.offset().left) + 636,
              W = i.clientX - A.minClientX,
              A.drawStartClientX = W,
              h(t, W)) {
              if (w != null) {
                for (var o = 0, r = N[w.day].length; r > o; o++) {
                  if (H = N[w.day][o],
                    H.start == w.start && H.end == w.end) {
                    K = R[w.day][o],
                    B.min = o - 1 >= 0 ? N[w.day][o - 1].end : 0,
                    B.max = r > o + 1 ? N[w.day][o + 1].start : 576
                    break
                  }
                }
              }
            } else if (!v(t)) { return }
            e(document).bind("mousemove", function(e) {
              n(e)
            }),
            e(document).bind("mouseup", function(e) {
              a(e)
            }),
            O = !0
          },
          mousemove: function() {
            if (O && A.drawSection == null && H == null) {
              var i = A.drawStartClientX
              A.drawSection = d(t, E, i),
              A.drawSection.day = t,
              e(this).append(A.drawSection)
            }
          }
        })
      }),
      _(),
      o(),
      r(),
      y(),
      P(),
      this
    }
  })(e)
})
