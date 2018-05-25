import fetch from '@/utils/fetch'

// site-kind

// 获取所有
export function getAll(url) {
  return fetch.get(url + 'list')
}

// 添加
export function addItem(url, item) {
  return fetch.post(url + 'add', item)
}

// 删除
export function deleteItem(url, item) {
  return fetch.delete(url + 'delete', {
    params: item
  }
  )
}

// 修改
export function modifyItem(url, item) {
  return fetch.put(url + 'update', item)
}

// get+ 全路径
export function getInfo(url) {
  return fetch.get(url)
}

// get+ 全路径
export function getURL(url) {
  return fetch.get(url)
}

// get修改 rename 区域配置
export function modifyGetItem(url) {
  return fetch.get(url)
}

export function getItem(url, item) {
  return fetch.get(url, { params: item })
}

// 添加
export function postItem(url, item) {
  return fetch.post(url, item)
}

// 更新
export function putItem(url, item) {
  return fetch.put(url, item)
}

// 同步
export function ALL(iterable) {
  return fetch.all(iterable)
}

// 分离结果
export function SPREAD(callback) {
  return fetch.spread(callback)
}
