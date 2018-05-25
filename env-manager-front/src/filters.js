// // 格式化时间
import { parseTime } from '@/utils/index'

// 首页时间格式化
export function DateFilter(stringDate) {
  return stringDate.substr(0, stringDate.length - 3)
}

// 时间日期格式化
// 提供如下形式
// 0  xxxx年xx月xx日
// 1  xxxx年xx月
// 2  xx月xx日
// 3  xxxx年xx月xx日 xx:xx
// 4  xx月xx日 xx:xx:xx

export function DateTimeFilter(time, type = 3, cFormat = '') {
  const map = {
    0: '{y}年{m}月{d}日',
    1: '{y}年{m}月',
    2: '{m}月{d}日',
    3: '{y}年{m}月{d}日 {h}:{i}',
    4: '{m}月{d}日 {h}:{i}'
  }
  const typeFormat = map[type]
  const format = typeFormat || format
  const result = parseTime(time, format)
  // console.log(result);
  return result
}

export function YesNoFilter(value) {
  let result = "否"
  if (value && value == 1) {
    result = "是"
  }
  return result
}

// IPC状态.notConn:未连接;paramErr:已连接参数错误;conn:已连接;allotSuccess:分配成功;recording:正在录制
export function IPCStatusFilter(value) {
  const map = {
    notConn: '未连接',
    paramErr: '已连接参数错误',
    conn: '已连接',
    // allotSuccess recording
    allotSuccess: '分配成功',
    recording: '正在录制'
  }
  return map[value]
}
