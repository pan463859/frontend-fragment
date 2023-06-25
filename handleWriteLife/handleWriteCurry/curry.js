const curry = (fn) => {
    // 获取这个采纳数一共需要几个参数，以add 为例，就是需要两个
    const fnlen = fn.length;
    const partial = (fn, argsList, argslen) => {
        // 参数达到预期，执行函数
        if (argsList.length >= argslen) {
            return fn(...argsList)
        }
        return (...args) => {
            return partial(fn, [...argsList, ...args], argslen)
        }
        // 否则返回函数
    }
    return partial(fn, [], fnlen)
}
const add = (x, y) => {
    return x + y
}
const curryAdd10 = curry(add)(10)
const result = curryAdd10(2)
console.log(result)