/**
 * 公共js函数库
 */

$(function() {
  autoFocus()
})
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return null
}
/**
 * js获取字符的宽度,firefox下appendChild()为异步，故获取到宽度值均为0
 */
String.prototype.getWidth = function(fontSize) {
  var span = document.getElementById("__getwidth")
  if (span == null) {
    span = document.createElement("span")
    span.id = "__getwidth"
    document.body.appendChild(span)
    span.style.visibility = "hidden"
    span.style.whiteSpace = "nowrap"
  }
  span.innerText = this
  span.style.fontSize = fontSize + "px"

  return span.offsetWidth
}

Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, // month
    "d+": this.getDate(), // day
    "H+": this.getHours(), // hour
    "m+": this.getMinutes(), // minute
    "s+": this.getSeconds(), // second
    "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
    "S": this.getMilliseconds()
    // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "")
      .substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length))
    }
  }
  return format
}

String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, "")
}

// 格式化化字符串,例如: "My name is {0},I am {1} years old!".format("Tony",22);
String.prototype.format = function(args) {
  var result = this
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeof (args) === "object") {
      for (var key in args) {
        if (args[key] != undefined) {
          var reg = new RegExp("({" + key + "})", "g")
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          var reg = new RegExp("({[" + i + "]})", "g")
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

// 判断是否为空
function isEmpty(str) {
  if (str == null || typeof str === "undefined" || str.trim() == "") {
    return true
  } else {
    return false
  }
}

function isEmail(email) {
  var email_reg = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/)
  if (!email_reg.test(email)) {
    return false
  }
  return true
}
// 去掉所有的html标记
function removeHtml(str) {
  return str.replace(/<[^>]+>/g, "")
}
// 判断命名规则，不包含/\<>?*:"'|
function checkName(name) {
  var reg = /[\\/<>\"\'\,&:*?|]/ig
  return !reg.test(name)
}

// 判断命名规则，不包含中文
function checkZh(name) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g")
  return !reg.test(name)
}

// 自动聚焦，文档加载时自动聚焦到第一个未填的input输入框
function autoFocus() {
  if (document.forms.length > 0) {
		  for (i = 0; i < document.forms[0].elements.length; i++) {
			   var input = document.forms[0].elements[i]
			   if (input.type != "hidden" && input.value.length > 0) {
				   	input.blur()
			     	return
			   } else if (input.type != "hidden") {
				   input.focus(); return
			   }
		  }
  }
}
// 转换本地时区日期字符串（日期对象为参数）
function getLoclDateStrByDate(date, fomartStr) {
  date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000))
  return date.format(fomartStr)
}
// 转换本地时区日期字符串（字符串为参数）
function getLoclDateStr(dateStr, fomartStr) {
  if (typeof dateStr !== "undefined") {
    var date = null
    if (dateStr.indexOf("/") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("/")
        if (strss.length == 3) {
          dateStr = strss[2] + "-" + strss[1] + "-" + strss[0] + " " + strs[1]
        }
      }
    }
    dateStr = dateStr.replace(".0", "")
    date = new Date(Date.parse(dateStr.replace(/-/g, "/")))
    date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000))
    return date.format(fomartStr)
  } else {
    return ""
  }
}
// 转换为UTC日期字符串（字符串为参数）
function getUTCDateStr(dateStr, fomartStr) {
  if (typeof dateStr !== "undefined") {
    if (dateStr.indexOf("/") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("/")
        if (strss.length == 3) {
          dateStr = strss[2] + "-" + strss[1] + "-" + strss[0] + " " + strs[1]
        }
      }
    }
    dateStr = dateStr.replace(".0", "")
    var date = new Date(Date.parse(dateStr.replace(/-/g, "/")))
    date.setTime(date.getTime() + (date.getTimezoneOffset() * 60000))
    return date.format(fomartStr)
  } else {
    return ""
  }
}

// 转换为UTC毫秒值(参数为UTC日期字符串）
function getUTCTimeByStr(dateStr, fomartStr) {
  if (typeof dateStr !== "undefined") {
    if (dateStr.indexOf("/") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("/")
        if (strss.length == 3) {
          dateStr = strss[2] + "-" + strss[1] + "-" + strss[0] + " " + strs[1]
        }
      }
    }
    dateStr = dateStr.replace(".0", "")
    var date = new Date(Date.parse(dateStr.replace(/-/g, "/")))
    return date.getTime()
  } else {
    return ""
  }
}
// //转换为UTC日期字符串（日期对象为参数）
function getUTCDateStrByDate(date, fomartStr) {
  date.setTime(date.getTime() + (date.getTimezoneOffset() * 60000))
  return date.format(fomartStr)
}
// 用日期获取UTC字符串，
function getUTCDateByDate(date) {
  date.setTime(date.getTime() + (date.getTimezoneOffset() * 60000))
  return date
}
// 获取日期
function getDateByStr(dateStr) {
  if (typeof dateStr !== "undefined") {
    if (dateStr.indexOf("/") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("/")
        if (strss.length == 3) {
          dateStr = strss[2] + "-" + strss[1] + "-" + strss[0] + " " + strs[1]
        }
      }
    }
    dateStr = dateStr.replace(".0", "")
    return new Date(Date.parse(dateStr.replace(/-/g, "/")))
  } else {
    return ""
  }
}
/* 自动补全日期格式*/
function formatDate(dateStr, fomartStr) {
  if (typeof dateStr !== "undefined") {
    if (dateStr.indexOf("/") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("/")
        if (strss.length == 3) {
          dateStr = strss[2] + "-" + strss[1] + "-" + strss[0] + " "
        } else if (strss.length == 2) {
          dateStr = strss[1] + "-" + strss[0] + "-01 "
        } else if (strss.length == 1) {
          dateStr = strss[0] + "-01-01 "
        }
        if (strs.length > 1) {
          dateStr += strs[1]
        } else {
          dateStr += "00:00:00"
        }
      }
    } else if (dateStr.indexOf("-") >= 0) {
      var strs = dateStr.split(" ")
      if (strs.length > 0) {
        var strss = strs[0].split("-")
        if (strss.length == 3) {
          dateStr = strss[0] + "-" + strss[1] + "-" + strss[2] + " "
        } else if (strss.length == 2) {
          dateStr = strss[0] + "-" + strss[1] + "-01 "
        } else if (strss.length == 1) {
          dateStr = strss[0] + "-01-01 "
        }
        if (strs.length > 1) {
          dateStr += strs[1]
        } else {
          dateStr += "00:00:00"
        }
      }
    }
    dateStr = dateStr.replace(".0", "")
    var date = new Date(Date.parse(dateStr.replace(/-/g, "/")))
    return date.format(fomartStr)
  } else {
    return ""
  }
}
function isName(someName) {
  var flag = true
  var regStr = /^[a-zA-Z0-9][a-zA-Z0-9\-\.\_]{0,40}$/
  if (!regStr.test(someName)) {
    flag = false
  }
  return flag
}

function formatNumber(value, point) {
  var ret = value != 0 && (value == "" || value == null) ? "" : parseFloat(Number(value).toFixed(point))
  return ret
}

// 持续时间显示类型转换,转换成： 1 23:01:09
function durationFormatter(seconds) {
  var day = 0
  var hour = 0
  var min = 0
  var sec = 0

  day = Math.floor(seconds / (3600 * 24))
  hour = Math.floor((seconds - day * (3600 * 24)) / 3600)
  min = Math.floor((seconds - day * (3600 * 24) - hour * 3600) / 60)
  sec = seconds - day * (3600 * 24) - hour * 3600 - min * 60

  hour = hour >= 10 ? hour : "0" + hour
  min = min >= 10 ? min : "0" + min
  sec = sec >= 10 ? sec : "0" + sec

  if (day > 0) {
    return day + " " + hour + ":" + min + ":" + sec
  } else {
    return hour + ":" + min + ":" + sec
  }
}
/**
 * 把秒数转换成 d hh:mm:ss 格式
 *
 * @param second 秒数
 */
function secondToTime(second) {
  var timeStr = ""
  if (second >= 24 * 60 * 60) {
    timeStr += parseInt(second / (24 * 60 * 60)) + "d  "
    second = second % (24 * 60 * 60)
  }
  if (second >= 60 * 60) {
    var h = parseInt(second / (60 * 60))
    if (h < 10) {
      h = "0" + h
    }
    timeStr += h + " : "
    second = second % (60 * 60)
  } else {
    timeStr += "00 : "
  }
  if (second >= 60) {
    var m = parseInt(second / 60)
    if (m < 10) {
      m = "0" + m
    }
    timeStr += m + " : "
    second = second % 60
  } else {
    timeStr += "00 : "
  }
  var s = parseInt(second)
  if (s < 10) {
    s = "0" + s
  }
  timeStr += s
  return timeStr
}

/* 数组去重复*/
function arrayDistinct(al) {
  for (var i = 0; i < al.length; i++) {
    var n = al[i]
    al.splice(i, 1, null)
    if (al.indexOf(n) < 0) {
      al.splice(i, 1, n)// 不存在重复
    } else {
      al.splice(i, 1)// 存在重复
      i--
    }
  }
  return al
}

/**
 * 对齐输入框/选择框与错误信息span
 *
 * @param errorSpanClass 错误显示信息的样式
 */
function alignInputAndErrorSpan(errorSpanClass) {
  $("." + errorSpanClass).each(function() {
    var inputName = $(this).attr("id")
    if (inputName && inputName != '') {
      inputName = inputName.replace("_error", "")
      var inputObj = $(":input[name='" + inputName + "']")
      if (inputObj && inputObj.length > 0) {
        $(this).css("padding-left", inputObj.offset().left)
      }
    }
  })
}

// 判断整数
function isInteger(val) {
  var reg = new RegExp(/^-?\d+$/)
  return reg.test(val)
}

// 判断正整数或正浮点数
function isPositiveNum(val) {
  var reg = /^(?:[1-9][0-9]*(?:\.[0-9]+)?|0\.(?!0+$)[0-9]+)$/
  var regExp = new RegExp(reg)
  return regExp.test(val)
}

// 判断实数
function isRealNumber(val) {
  var reg = /^[-+]?\d+(\.\d+)?$/
  var regExp = new RegExp(reg)
  return regExp.test(val)
}
