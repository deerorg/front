import Vue from 'vue'

Vue.directive('color', function(el, binding) {
  // 简写方式设置文本及背景颜色
  // el.innerHTML = binding.value.text
  el.style.color = binding.value.color || 'white'
})

// v-color="{color:white}"

Vue.directive('gap', function(el, binding) {
  el.style.marginTop = binding.value.top || '0'
  el.style.marginBottom = binding.value.bottom || '0'
})

// v-gap = "{top:'20px'}"

