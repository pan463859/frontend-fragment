var a = 1
function b(c) {
    debugger
    console.log('c1', c)
    var c
    console.log('c2', c)
    function c() {
        console.log(1)
    };
    c = 2
    console.log('c3', c)
}
b(a)



var a = function () {
    console.log(1)
};
function b(c) {
    console.log('c1', c)
    var c
    console.log('c2', c)
    c = 1
    console.log('c3', c)
}
b(a)



//函数声明优先级更高，而且不会被变量声明覆盖，但是会被复制操作覆盖