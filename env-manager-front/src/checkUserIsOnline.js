import { checkUserIsOnline } from '@/api/login';

(function() {
  window.intervalFlag = setInterval(function() {
    if (localStorage.token && localStorage.token.length > 10) {
      checkUserIsOnline().then(resp => {
      // console.log(resp);
        if (resp.status == 200 && resp.data == null) {
        // console.log("正常在线");
        } else if (resp.status == 200 && resp.data == 'REPEAT_LOGIN') {
          localStorage.clear()
          window.router.push('/login')
        }
      })
    }
  }, 1000)
})()

