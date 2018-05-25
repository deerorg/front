export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 颜色转换  rgba(19, 206, 102, 1)
export function parseColor2Int(rgbaStr) {
  let result = 0
  if (rgbaStr && rgbaStr.indexOf('rgba') > -1) {
    const str = rgbaStr
    const value = str.substring(str.indexOf("(") + 1, str.length - 1)
    const arr = value.split(",")
    if (arr && arr.length == 4) {
      arr[0] = Number(arr[0])
      arr[1] = Number(arr[1])
      arr[2] = Number(arr[2])
      arr[3] = Number(1)
      result = arr[0] << 16 | arr[1] << 8 | arr[2]
      console.log(`${rgbaStr} => ${result}`)
    }
  } else {
    console.error("错误的rgba值", rgbaStr)
  }
  return result
}

// z
export function parseInt2Rgba(number) {
  // debugger;
  let c1 = Number(number).toString(2)
  c1 = c1.padStart(24, "0")
  const r1 = c1.substring(0, 8)
  const g1 = c1.substring(8, 16)
  const b1 = c1.substring(16, 24)

  const r2 = parseInt(r1, 2)
  const g2 = parseInt(g1, 2)
  const b2 = parseInt(b1, 2)

  const result = `rgba(${r2},${g2},${b2},1)`
  console.log(`${number} => ${result}`)
  return result
}

export function deepClone(obj) {
  var copy
  if (obj == null || typeof obj !== "object") return obj

  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }
  if (obj instanceof Array) {
    copy = []
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i])
    }
    return copy
  }
  if (obj instanceof Object) {
    copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

