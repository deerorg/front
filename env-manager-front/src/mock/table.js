import Mock from 'mockjs'
import { param2Obj } from '../utils/index'

const List = []
const count = 400
for (let i = 1; i <= count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@cname',
    projectName: '@ctitle(10)',
    buinessName: "@ctitle(10)",
    title: '@ctitle(10, 20)',
    address: '@county(true)',
    requestDate: '@date',
    'isCommit|1': [0, 1],
    info: "@cword(10)",
    result: '@cword(3)',
    'isEnd|1': [0, 1],
    optDate: "@date"
  }))
}

export default {
  getList: config => {
    const { pageIndex, pageSize } = param2Obj(config.url)
    const pageList = List.filter((item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1))
    return {
      total: List.length,
      items: pageList
    }
  }
}
