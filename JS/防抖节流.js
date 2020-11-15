/**
 * 防抖：触发事件后N秒内只会执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间。比如上拉加载中，可以防止多次调用接口造成数据重复
    在n秒内如果时间再次被触发，则重新计算时间
 * 
 */
function debounce(fn) {
    let timer = null;
    return function () {
        console.log('enterdebounce')
        clearTimeout(timer)
        timer = setTimeout(() => {
            //确保fn的this指向被绑定的元素本身而不是window
            fn.apply(this, arguments);
        }, 1000);
    }
}
function clicked() {
    console.log('i was clicked and debonced')
}
let debounceele = document.createElement('div')
debounceele.style.height = '100px'
debounceele.style.background = 'blue'
debounceele.innerText = 'debounce'
debounceele.addEventListener('click', debounce(clicked))
document.body.append(debounceele)


/**
 * 节流：连续触发事件但是在 n 秒中只执行一次函数。节流会稀释函数的执行频率。比如对resize事件的监听
 *
 */
function throttle(fn) {
    let canrun = true
    return function () {
        if (!canrun) return false
        canrun = false
        setTimeout(() => {
            fn.apply(this, arguments);
            canrun = true
        }, 1000);
    }
}
let throttleele = document.createElement('div')
throttleele.style.height = '100px'
throttleele.style.background = 'yellow'
throttleele.innerText = 'throttle'
throttleele.addEventListener('click', debounce(clicked))
document.body.append(throttleele)

