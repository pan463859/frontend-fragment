---
theme: orange
---
# 碎碎念
大家好，我是潘小安！一个永远在减肥路上的前端er🐷 ！

看到标题有人会问❓ 了，你手写 Promise 就手写，整个跨年版是什么东西？

emmm。。。大概就是这篇文章会用少部分篇幅写一下自己的新年计划📅（大概率打脸，新年给自己打打鸡血。

今年是 2022 年了，毕竟新年了，🎏flag🎏 该立还是得立，打不打脸以后再说，大不了以后重新再立一个就好。

今年的 🎏flag🎏  有以下几个：
+ 一个月最少出一篇文章，内容题材不限，不少于 800 字，题目自拟。
+ 一年 365 天，坚持早起超过 300 天，并在低调青年群 **（神秘组织）** 里打卡。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d4122ef866941b4befbe0cb8f8ab04b~tplv-k3u1fbpfcp-watermark.image?)

+ 工作日 Forest🌲 专注时间超过四小时每天。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eebba324aa084a468f5b45aec0b1ad71~tplv-k3u1fbpfcp-watermark.image?)

+ 到年底瘦 15 斤左右，以下该计划注意事项：
    
    + 晚上不摄入碳水，只吃菜🥬 不干饭🍚
    + 日常生活只喝水🚰 和茶 🍵 ,不喝饮料🥤（过年吃席可解开封印）
    + 随缘运动🏊，一周至少两小时（羽毛球🏸️ || 跑步🏃‍ || keep 有氧打卡）
    
以上 🎏flag🎏 均用视频或者文字记录，2023 年跨年会做一个打卡视频汇总！

🎏flag🎏 立完了，让我们进入正题。在开始手写 Promise 之前，有一些可能需要提前理解的知识点，弄懂了这些我们才可以在手写 Promise 的过程中少些阻碍，你也可以点击 [这里](#start) 直接开始手写之旅。
# 前置技能点 🔧

   
## 技能点一： this 指向问题 ⬆️
当调用函数时，除了显式传入的参数，`this` 参数也会默认地传递给函数。`this` 代表函数调用相关联的对象。因此，通常称之为函数上下文。`this` 的指向不仅与函数的定义和位置有关，更重要的是和函数的调用方式有关，通常我们把函数调用分为以下四种方式：

**作为函数直接被调用**
 ```js
let name = '张三'
function whoAmI() {
    console.log('call my name' + ' ' + this.name)
}
whoAmI()//call my name 张三
 ```
 ```js
"use strict"
let name = '张三'
function whoAmI() {
    console.log('call my name' + ' ' + this.name)
}
whoAmI()//TypeError: Cannot read properties of undefined (reading 'name')
 ```
这种调用方式称之为 **直接函数调用** 是为了区别于其他的调用方式，如果一个函数没有作为方法、构造函数或者通过 apply 和 call 调用的话，我们就称之为作为 **直接函数调用**。
非严格模式下，this 指向全局对象 window（浏览器执行环境），但是在严格模式下，this 指向为 undefined。

 **作为方法，关联在对象上被调用**
 ```js
 let name = '张三'
const persons = {
    name: '法外狂徒',
    whoAmI: function () {
        console.log('call my name' + ' ' + this.name)
    }
}
persons.whoAmI()//call my name 法外狂徒
 ```
 当函数作为某个对象的方法被调用时，该对象会成为函数的上下文，并且在函数内部可以通过参数访问到
 
**作为构造函数，实例化一个新对象时候被调用**
 ```js
 function Person(name) {
    this.name = name
    console.log('call my name' + ' ' + this.name)
}
let personins = new Person('王二麻子')//call my name 王二麻子
 ```
 当通过 new 关键字调用时会创建一个空的对象实例，并将其作为 this 传递给构造函数。
new 操作内部主要执行了以下几个步骤：
 
 1.创建一个新的空对象。
 
 2.将新对象的 `__proto__` 指向构造函数的 `property`。
 
 3.该对象作为 `this` 参数传递给构造函数，从而成为构造函数的函数上下文，并执行构造函数中的语句。
 
 4.新构造的对象作为 `new` 运算符的返回值，分以下两种情况讨论
 
+ 如果构造函数返回一个对象，则该对象将作为整个表达式的值返回，而传入构造函数的 `this` 将被丢弃。
+ 但是，如果构造函数返回的是非对象类型，则忽略返回值，返回新创建的对象。
对 `new` 操作符的具体实现感兴趣的可以看看大佬的详细解析：[yck：重学 JS 系列：聊聊 new 操作符](https://juejin.cn/post/6844903789070123021)

**通过函数的 apply,bind 调用**
 ```js
 let name = '张三'
const persons = {
    name: '法外狂徒',
    whoAmI: function () {
        console.log('call my name' + ' ' + this.name)
    }
}
function whoAmI() {
    console.log('call my name' + ' ' + this.name)
}
whoAmI.call(persons)//call my name 法外狂徒
 ```
 call 和 apply 方法可以显示的指定 this。不同的是，call 方法的参数使用参数列表形式传参，apply 方法使用数组的形式传参：
 ```
 whoAmI.call(persons,param1,param2)
 whoAmI.apply(persons,[param1,param2])
 ```
 对于 this 的机制我们就暂时了解到这里，有兴趣的同学我推荐下面这个博客大家可以深入了解一下：
 
 👆👆👆
[冴羽-JavaScript 深入之从 ECMAScript 规范解读 this](https://juejin.cn/post/6844903473872371725) 👆👆👆
 
## 技能点二：什么是 class ❓
   我们使用 `es6` 中的 `class` 来写 `Promise` 的构造函数，就用我们常见的 `Person` "类" 来看看 `class` 的真面目:
   ```javascript
class Person {
    constructor(name) {
        this.name = name
    }
    getName() {
        return this.name
    }
    static eat() {
        console.log('lufei:I like to eat meat')
    }
}
   ```
   我们把这段代码输入到 [babel 的在线转换编辑器](https://babeljs.io/repl) 中，来看看 `class` 的真面目:
   ```javascript
   "use strict";
   function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
        let descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
            descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
}

let Person = function () {
    function Person(name) {
        _classCallCheck(this, Person);

        this.name = name;
    }

    _createClass(Person, [{
        key: "getName",
        value: function getName() {
            return this.name;
        }
    }], [{
        key: "eat",
        value: function eat() {
            console.log('lufei:I like to eat meat');
        }
    }]);

    return Person;
}();
   ```
   第一个函数 `_classCallCheck` 为了确保 `Person` 是作为构造函数被调用，否则抛出错误
   
   第二个函数 `_defineProperties` 是一个工具函数，遍历 `props` 变量，赋值到 `target` 上
   
   第三个函数 `_createClass` 有三个参数:
   
   + `constructor` 表示传入的构造函数，在例子中就是 `Person` 方法
   + `protoProps` 表示需要赋值在构造函数原型上的属性集合,在例子中就是 `getName` 方法
   + `staticProps` 表示需要赋值在构造函数（函数也是对象）本身上的属性集合。在例子中就是 `eat` 方法
   总结：
   
   1.`class` 是构造函数的语法糖，在 `constructor` 中的语句相当于是在构造函数中的语句。
   
   2.直接定义的变量相当于定义在**构造函数原型**上的变量
   
   3.使用 `static` 定义的属性相当于定义在**构造函数**本身。
   
   
  
   
## 技能点三：<span id="eventLoop">EventLoop 事件循环 🎉</span>
先摘三段 `MDN` 中和事件循环相关的解释：
>在执行 JavaScript 代码的时候，JavaScript 运行时实际上维护了一组用于执行 JavaScript 代码的**代理（**agents**）**。每个代理由一组执行上下文的集合、执行上下文栈、主线程、一组可能创建用于执行 worker 的额外的线程集合、**一个任务队列以及一个微任务队列构成**。

>每个代理都是由**事件循环**驱动的，事件循环负责收集用事件（包括用户事件以及其他非用户事件等）、对任务进行排队以便在合适的时候执行回调。然后它执行所有处于等待中的 JavaScript 任务（宏任务），然后是微任务，然后在开始下一次循环之前执行一些必要的渲染和绘制操作。

 
>-  当执行来自任务队列中的任务时，在每一次新的事件循环开始迭代的时候运行时都会执行队列中的每个任务。在每次迭代开始之后加入到队列中的任务需要**在下一次迭代开始之后才会被执行**.
>-  每次当一个任务退出且执行上下文为空的时候，微任务队列中的每一个微任务会依次被执行。不同的是它会等到微任务队列为空才会停止执行——即使中途有微任务加入。换句话说，微任务可以添加新的微任务到队列中，并在下一个任务开始执行之前且当前事件循环结束之前执行完所有的微任务。

这三段话其实有点难理解，我们可以大概总结成以下三点：

 + `js` 代码执行的时候维护了一堆代理，代理是由一堆东西构成的，其中包括了我们要将的宏任务队列（任务队列）和微任务队列。
 + 事件循环负责收集事件，并对收集到的事件排队，并在合适的时间执行
 + 第三段说明了宏任务和微任务的执行规则
 
     + 执行宏任务时又遇到宏任务，就把宏任务放到宏任务队列中去，到下次迭代才执行
     + 一个宏任务执行完之后，会去依次执行每个微任务，不同于宏任务执行，它遇到新的微任务会直接加在微任务队尾，然后接着执行，直到微任务队列在当前迭代被清空。

常见的宏任务微任务（如有不懂如何使用的可点击查看对应资料）
| 宏任务 | 微任务 |
| --- | --- |
| [setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout) |[MutationObserver（浏览器环境](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)） |
| [setInterval](https://developer.mozilla.org/zh-CN/docs/Web/API/setInterval) | [process.nextTick（Node环境）](https://nodejs.org/dist/latest-v16.x/docs/api/process.html#processnexttickcallback-args)|
| [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel) | [queueMicrotask](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask) |
| I/O，事件队列 | [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/window/requestAnimationFrame) |
| [setImmediate（非标准）](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setImmediate) |  [Promise.[ then/catch/finally ]](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)|
| script标签 |  |

我们使用 `setTimeout` 和 `queueMicrotask` 来辅助理解一下这个事件循环。

```js
console.log('start')
setTimeout(() => {
    console.log('settimeout')
    queueMicrotask(()=>{
        console.log('enter queueMicrotask in settimeout')
    })
}, 666);
queueMicrotask(()=>{
    console.log('enter queueMicrotask1')
})
queueMicrotask(()=>{
    console.log('enter queueMicrotask2')
    queueMicrotask(()=>{
    console.log('enter queueMicrotask3')
})
})
console.log('end')
```
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1533a1c8ab4130a6809d255d9afbde~tplv-k3u1fbpfcp-watermark.image?)

通过这个例子，我们验证一下事件循环的理论：

1.当遇到宏任务 **（setTimeout）** 的时候，把宏任务放在宏任务队列中，遇到微任务时 **（queueMicrotask1，queueMicrotask2）**，把微任务放在微任务队列中。

2.宏任务执行之前要清空微任务队列，第一次迭代的时候，发现了 **queueMicrotask1** 和 **queueMicrotask2**。

3.执行宏任务之前，先清空微任务队列，所以先执行 **queueMicrotask1**，**queueMicrotask2**，**在执行queueMicrotask2** 的时候遇到 **queueMicrotask3**，按照理论来说，微任务遇到微任务会直接添加到微任务队列尾部，并在当前迭代继续执行，所以 **queueMicrotask3** 紧接着执行了。

4.微任务队列清空后，我们开始执行宏任务队列，执行 **setTimeout**，向微队列中添加一个微任务，在宏任务执行后，清空微任务队列，打印出 **enter queueMicrotask in settimeout**。



## 技能点四：promise 的基本使用📄
如果有对基本用法不熟悉的同学，这里准备几个很好的学习网站：
+ [MDN YYDS](https://developer.mozilla.org/zhCN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
+ [阮一峰 YYDS](https://es6.ruanyifeng.com/#docs/promise)

前置技能点盘点到这里就差不多了，起身喝个水，让我们开始手写 `Promise` 之旅！

# <span id='start'>开始整活 🔥</span> 
在开始手写 `Promise` 之前，我们先要想一想 在日常开发中 `Promise` 的基本用法，

先抛开 `Promise` 上的静态函数不谈，我们先回想一下 `Promise` 日常的基本使用，写一个可能在我们日常开发中会出现的代码。来给我们手写 `Promise` 的任务先探探路。

```js
let promise1=new Promise((resolve,reject)=>{
    console.log('do something')
    resolve('i')
    reject()
})
promise1.then((res)=>{
    console.log(res+'resolve after do something')
},()=>{
    console.log('reject after do something')
})
console.log(promise1)
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4cf09c6637634fafaf7e0cc9c000c53c~tplv-k3u1fbpfcp-watermark.image?)
可以看到，程序首先打印出了 **do something**，接着打印了 `Promise` 实例，最后打印了 **i resolve after do something**。看到这段输出，我们可能会有以下两个问题：

> **reject 为什么没有执行？**
 
> **resolve after dosomething 为什么会在 promise1 之后才执行**
 
带着这两个问题，结合日常的开发使用和查阅的资料，我们可以得到以下结论：
 
   1.`Promise` 是一个构造函数，可以使用 `new` 操作符调用。
   
   2.创建 `Promise` 实例需要传入一个函数，该函数有 `resolve`、`reject` 两个参数，且在创建实例的时候会立即执行。
   
   3.`Promise` 实例有三个状态，`pending`，`fullfilled` 和 `rejected`，创建时是 `pending` 状态，可以调用 `resolve` 方法从 `pending` 状态变成 `fullfilled`，可以调用 `reject` 方法从 `pending` 状态变成 `rejected` 状态，状态一旦被更改后无法再次变更。
   
   3.`Promise` 实例可以调用 `then` 方法，`then` 方法可以两个参数，第一个回调函数 `onFullfilled` 会在 `Promise` 实例状态变成 `fullfileld` 之后调用,参数为调用 `resolve` 时的值，另外一个回调函数 `onRejected` 会在 `Promise` 实例状态变成 `rejected` 之后被调用，参数为调用 `reject` 时候的值。
   
   4.`then` 方法内的函数，需要异步执行
   
 根据这些现有的思路，我们可以开始尝试去编辑器中敲一敲代码了！
 
     
 ## Promise 状态变更 🤔
 我们可以先尝试着写一下 `Promise` 的构造函数：
 ```js
 class MyPromise {
    constructor(func) {
        func(resolve, reject)
    }
}
```
接下来我们使用常量定义一下 `Promise` 实例的三种状态，定义保存状态的变量并初始化为 `pending`。
```js
+ const PENDING = 'pending';
+ const FULFILLED = 'fulfill';
+ const REJECTED = 'rejected';
class MyPromise {
 constructor(func) {
        + this.promiseStatus = PENDING
        ...
    }
...
}
```
接下来就是 `resolve` 和 `reject` 两个函数了：
+ `resolve` 方法的作用是把 `Promise` 实例的状态从 `pending` 变成 `fullfilled`,并且把 `resolve` 传入的值在 `Promise` 实例内用 `promiseResult` 保存起来。
+ `reject` 的作用是把 `promise` 的状态从 `pending` 变成 `rejected`，并且把 `reject` 传入的值也要用 `promiseResult` 保存起来。
+ **若状态已经改变过，两个函数不进行状态更改。**

```js
class MyPromise {
    constructor(func) {
        ...
        + this.promiseResult = undefined
    }
+    resolve(res) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus=FULLFILLED
            this.promiseResult=res
            console.log('pending=>fullfilled')
         }
    }
+    reject(reason) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus=REJECTED
            this.promiseResult=reason
            console.log('pending=>rejected')
         }
    }
}
```
这里有个小细节，就是我们前置技能点中对 `this` 的介绍。我们把 `this.resolve` 和 `this.reject` 传入  `func` 中后直接执行，当 `resolve` 被执行时，那个时候的 `this` 会是 `undefined`。所以我们需要对传入的 `resolve` 和 `reject` 方法做一个绑定。

```js
+ executor(this.resolve.bind(this), this.reject.bind(this))
```
接下来写啥？ `Promise` 实例除了 `reject` 后状态会变成 `rejected` 之外，也会在抛出异常的情况下变成 `rejected` 状态。于是乎，我们可以给代码加上 `try catch` 语句来捕获异常。
```js
+       try {
+           executor(this.resolve.bind(this), this.reject.bind(this))
+       }
+       catch (e) {
+          this.reject(e.message)
+       }
```
目前为止，我们手写 `Promise` 代码长这样：
```js
class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';
    constructor(func) {
        this.promiseStatus = PENDING
        this.promiseResult = null
        try {
            func(this.resolve.bind(this), this.reject.bind(this))
        }
        catch (erro) {
            this.reject(erro)
        }
    }
    resolve() {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = FULLFILLED
            this.promiseResult = res
            console.log('pending=>fullfilled')
        }
    }
    reject() {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = REJECTED
            this.promiseResult = reason
            console.log('pending=>rejected')
        }
    }
}
```
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50082641122345eb88b82bedae33580d~tplv-k3u1fbpfcp-watermark.image?)

好像有点 `Promise` 的样子了，目前为止一切都按照计划进行，做个眼保健操，继续 `Promise` 的手写旅程吧~

## then 方法实现 🥴
 `Promise` 的状态切换做完之后，接下里就是去处理 `then` 方法了。`then` 方法接收两个参数，第一个是状态变更为 `fullfilled` 时候调用的回调函数 `onFullfilled`，一个是状态变更为 `rejected` 状态时候的回调函数 `onRejected`。在实现 `then` 方法之前，我们先看看 `Promises/A+` 规范中 `then` 方法的相关部分。
### 规范
 > 英文原版：[Promises/A+ ](https://promisesaplus.com/)
 
 > 中文版：[[译]Promise/A+ 规范](https://zhuanlan.zhihu.com/p/143204897)
 
规范中详细的定义了 `then` 方法的逻辑和细节，我们从 **2.2** 开始逐步的去实现这个 `then` 方法。

 - <span id="2_2_1">2.2.1 `onFulfilled` 和 `onRejected` 都是可选的参数

   - 2.2.1.1. 如果 `onFulfilled` 不是一个函数，它必须被忽略
    
   - 2.2.1.2. 如果 `onRejected` 不是一个函数，它必须被忽略
    
 - <span id="2_2_2">2.2.2. 如果 `onFulfilled` 是一个函数
    - 2.2.2.1. 它必须在 `promise` 被解决后调用，`promise` 的值作为它的第一个参数。
    - 2.2.2.2. 它一定不能在 `promise` 被解决前调用。
    - 2.2.2.3. 它一定不能被调用多次。
- 2.2.3. 如果 `onRejected` 是一个函数
    - 2.2.3.1. 它必须在 `promise` 被拒绝之后调用，用 `promise` 的原因作为它的第一个参数。
    - 2.2.3.2. 它一定不能在 **promise** 被拒绝之前调用。
    - 2.2.3.3. 它一定不能被调用多次。
- <span id="2_2_4">2.2.4. 在执行上下文栈中只包含平台代码之前，**onFulfilled** 或 **onRejected** 一定不能被调用。
- 2.2.5. `onFulfilled` 和 `onRejected` 一定被作为函数调用(没有 this 值) 
- 2.2.6 同一个 `promise` 上的 `then` 可能被调用多次。
    - 2.2.6.1. 如果 `promise` 被解决，所有相应的 `onFulfilled` 回调必须按照他们原始调用 `then` 的顺序执行
    - 2.2.6.2. 如果 `promise` 被拒绝，所有相应的 `onRejected` 回调必须按照他们原始调用 `then` 的顺序执行

+ <span id="2_2_7">2.2.7 `then`必须返回一个`promise`。
```
promise2 = promise1.then(onFulfilled,onRejected)
```
-  2.2.7.1. 如果`onFulfilled`或`onRjected`返回一个值`x`，运行`promise`解决程序`[[Resolve]](promise2,x)`
-   2.2.7.2. 如果`onFulfilled`或`onRejected`抛出一个异常`e`，`promise2`必须用`e`作为原因被**拒绝**
-   2.2.7.3. 如果`onFulfilled`不是一个函数并且`promise1`被**解决**，`promise2`必须用与`promise1`相同的值被**解决**
-   2.2.7.4. 如果`onRejected`不是一个函数并且`promise1`被**拒绝**，`promise2`必须用与`promise1`相同的原因被**拒绝**

    
### 规范分析

#### [规范 2.2.1 和 2.2.5](#2_2_1) 
   当 `onFulfilled` 或者 `onRejected` 不是函数的时候，必须被忽略，同时又 `onFulfilled` 和 `onRejected` 一定被作为函数调用，所以我们遇到非函数的类型的 `onFulfilled` 时，直接返回 `promiseResult`，遇到非函数的类型的 `onRejected` 时，直接抛出一个异常，异常信息为 `reason`。
   
 ```js
+ then(onFulfilled, onRejected) {
+    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : promiseResult => promiseResult;
+    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
+        throw reason;
+   };
+ }
```  

#### [规范 2.2.2 & 规范2.2.3 & 规范 2.2.6](#2_2_2)
结合规范 **2.2.2** 和 规范 **2.2.3**，我们可以得出下面两点结论：

  1. `onFulfilled` 和 `onRejected` 必须在状态变更后再调用,`onFulfilled` 参数为 `promise` 的值，`onRejected` 参数也为 `promise` 的值。
  2. `onFulfilled` 和 `onRejected` 不能多次被调用。

   ```javascript
    then(){
       ...
      if (this.promiseStatus == FULLFILLED) {
            onFulfilled(this.promiseResult)
        }
      if (this.promiseStatus == MyPromise.RJECTED) {
            onRejected(this.promiseResult)
        }
    }
   ```
**那有没有调用 `then` 的时候，`promise` 的状态还是 `pending` 呢？不仅有而且很常见。**
比如日常使用 `promise` 封装 `ajax` 请求会有以下代码：
```js
function getData() {
    return new Promise((resolve, reject) => {
        someajax((res,message) => {
            if (res.code == '200') {
                resolve(res)
            } else {
                reject('message')
            }
        })
    })
}
getData().then((res) => {
    console.log(res)
})
```
这里 `then` 方法已经执行了，但是 `ajax` 还在异步获取数据，`resolve` 的执行时间在 `then` 方法之后的，那我们要如何处理这种情况？怎样才能让我们写的 Promise 能够符合预期呢？

**答案是：使用变量把 `onFulfilled` 和 `onRejected` 保存起来，等到 `promise` 状态变更的时候再去处理。**

那么新的问题来了，我们要用什么数据类型保存 `onFulfilled` 和 `onRejected`？我们可以把目光向下移，来到规范 **2.2.6**。

分析规范 **2.2.6** 得出结论：
 + 同一个 `Promise` 实例上的 `then` 可能被调用多次，且所有相应的 `onFulfilled` 和 `onRejected` 必须按照他们原始调用 `then` 的顺序执行
综上所述，我们需要一个队列保存所有的 `onFulfilled` 和 `onRejected`，在 `promise` 状态真正改变之后，再根据先入先出的顺序进行调用，于是我们可以写下面的代码：
```js
    constructor(executor) {
        ...
        this.onFulfilleds = []
        this.onRejecteds = []
        ...
    }
    resolve(res) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = FULFILLED
            this.promiseResult = res
     +       while (this.onFulfilleds.length > 0) {
     +          this.onFulfilleds.shift()(this.promiseResult)
     +       }
        }
    }

    reject(reason) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = REJECTED
            this.promiseResult = reason
     +      while (this.onRejecteds.length > 0) {
     +          this.onRejecteds.shift()(this.promiseResult)
     +     }
        }
    }
    then(onFulfilled, onRejected) {
        if (this.promiseStatus == PENDING) {
      +     this.onFulfilleds.push(onFulfilled)
      +     this.onRejecteds.push(onRejected)
        }
        ...
    }
```

#### [规范 2.2.4](#2_2_4)
>当执行上下文栈只包含[**平台代码**](#platcode)，onFulfilled 和 onRejected 才能被执行。

规范中用一段话来解释了**平台代码**：
>Here “platform code” means engine, environment, and promise implementation code. In practice, this requirement ensures that `onFulfilled` and `onRejected` execute asynchronously, after the event loop turn in which `then` is called, and with a fresh stack. This can be implemented with either a “macro-task” mechanism such as [`setTimeout`](https://html.spec.whatwg.org/multipage/webappapis.html#timers) or [`setImmediate`](https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html#processingmodel), or with a “micro-task” mechanism such as [`MutationObserver`](https://dom.spec.whatwg.org/#interface-mutationobserver) or [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback). Since the promise implementation is considered platform code, it may itself contain a task-scheduling queue or “trampoline” in which the handlers are called.

> <span id='platcode'>这里“平台代码”意味着引擎、环境以及`promise`的实现代码。在实践中，这需要确保`onFulfilled`和`onRejected`异步地执行，并且应该在`then`方法被调用的那一轮事件循环之后用新的执行栈执行。这可以用如`setTimeout`或`setImmediate`这样的“宏任务”机制实现，或者用如`MutationObserver`或`process.nextTick`这样的“微任务”机制实现。由于`promise`的实现被考虑为“平台代码”，因此在自身处理程序被调用时可能已经包含一个任务调度队列</span>

结合前置技能点中讲到的[事件循环](#eventLoop)，我们可以理解为:

**`onFulfilled` 和 `onRejected` 需要在 `then` 方法被调用的那轮事件循环的末尾执行。为了达到这个效果，`onFulfilled` 和 `onRejected` 可以使用宏任务实现，也可以用微任务实现。**

我们可以结合原生 `Promise` 的 `demo` 加深一下理解：

```js
//onFulfilled 方法在 then 方法那轮事件循环之后的新循环中执行
let promiseins = new Promise((resolve, reject) => {
    resolve('fullfilled');
})
console.log('event loop turn in which `then` is called start')
promiseins.then(() => {
    console.log('onFulfilled called')
})
setTimeout(() => {
    console.log('timeout called')
})
console.log('event loop turn in which `then` is called end ')
// event loop turn in which `then` is called start
// event loop turn in which `then` is called end   
// onFulfilled called
// timeout called
```
这里为了能更好的和原生 `Promise` 实现接近，我们用微任务来实现 `onFulfilled` 和 `onRejected` 的异步调用。别忘记在状态为 `PENDING` 的时候，把**函数放入待执行队列的 onFulfilled 和 onRejected也需要加上异步处理**。

```js 
then(){
...
+if (this.promiseStatus == MyPromise.PENDING) {
+    this.onFulfilleds.push(() => {
+        q(() => {
+            onFulfilled(this.promiseResult)
+        });
+    })
+    this.onRejecteds.push(() => {
+        queueMicrotask(() => {
+            onRejected(this.promiseResult)
+       });
+    })
+}
if (this.promiseStatus == FULLFILLED) {
+    queueMicrotask(() => {
        onFulfilled(this.promiseResult)
+    })
}
if (this.promiseStatus == MyPromise.RJECTED) {
+    queueMicrotask(() => {
        onRejected(this.promiseResult)
+    })
}}
```

#### [规范 2.2.7 ](#2_2_7)
在展开说说之前，我们先看看 `then` 现在的完全体，因为一旦开始动工规范 **2.2.7**，之前已经施工完毕的 `then` 方法可能会被改的面目全非。
```js
then(onFulfilled, onRejected) {
    ...
    if (this.promiseStatus == MyPromise.PENDING) {
        this.onFulfilleds.push(() => {
            queueMicrotask(() => {
                onFulfilled(this.promiseResult)
            });
        })
        this.onRejecteds.push(() => {
            queueMicrotask(() => {
                onRejected(this.promiseResult)
            });
        })
    }
    if (this.promiseStatus == MyPromise.FULLFILLED) {
        queueMicrotask(() => {
            onFulfilled(this.promiseResult)
        })
    }
    if (this.promiseStatus == MyPromise.RJECTED) {
        queueMicrotask(() => {
            onRejected(this.promiseResult)
        })
    }
}
```
最后一个规范是实现 `Promise` 的链式调用的关键，同时也是整个手写 `Promise` 的旅程中，个人认为最陡峭的山。难点在于返回的这个新的 `Promise`实例（本文使用 **`then_promise`** 表示）需要根据 `onFullfilled` 和 `onRejected` 的执行结果 `x` 来决定状态和返回值。规范 **2.2.7.1** 到 **2.2.7.4 **描述了不同情况的处理方式，其中提到一个 `promise 解决程序[[Resolve]](then_promise,x)`后续称之为 **`resolvePromise`**，我们稍后会单独拎出来展开说说 🤌。


逐条阅读 [规范 2.2.7 ](#2_2_7)，我们有以下分析：

+ 首先要新建一个 `Promise` 实例用于返回

```js
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
+        const then_promise = new MyPromise((resolve, reject) => {
+       })
+        return then_promise
    }
```
+ 因为返回的 `then_promise` 的结果需要根据 `onFullfilled` 和 `onRejected` 的执行结果 `x` 来走不同的逻辑，所以我们之前写的逻辑需要放进 `then_promise` 初始化的语句中去。
+ 规范 [2.2.7.2](#2_2_7) 中要求对`onFulfilled`和`onRejected`进行异常捕获，在有错误的时候抛出异常，并作为 `then_promise` 的 `reject` 参数。

+ 规范 [2.2.7.3]((#2_2_7)) 和 [规范 2.2.7.4]((#2_2_7))描述的 `onFullfilled` 和 `onRejected` 不为函数的情况我们在 `then` 方法的开头已经处理了，所以可以并入 规范 **2.2.7.1** 中处理，也就是 `resolvePromise` 中一起处理。
根据上面三条分析，可以写出如下代码：

```javascript
then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : promiseResult => promiseResult;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason;
    };
    const then_promise = new MyPromise((resolve, reject) => {
        if (this.promiseStatus == MyPromise.PENDING) {
            this.onFulfilleds.push(() => {
                queueMicrotask(() => {
                    try {
                        let x = onFulfilled(this.promiseResult)
                        this.promiseresolve(then_promise, x，resolve，reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            })
            this.onRejecteds.push(() => {
                queueMicrotask(() => {
                    try {
                        let x = onrejected(this.promiseResult)
                       this.promiseresolve(then_promise, x，resolve，reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            })
        }
        if (this.promiseStatus == MyPromise.FULLFILLED) {
            queueMicrotask(() => {
                try {
                    let x = onFulfilled(this.promiseResult)
                    this.promiseresolve(then_promise, x，resolve，reject)
                } catch (e) {
                    reject(e)
                }
            });

        }
        if (this.promiseStatus == MyPromise.RJECTED) {
            queueMicrotask(() => {
                try {
                    let x = onrejected(this.promiseResult)
                    this.promiseresolve(then_promise, x，resolve，reject)
                } catch (e) {
                    reject(e)
                }
            });
        }
    })
    return then_promise
}
}
 promiseresolve(then_promise, x, resolve, reject) {

}
```
看着挺多的，细分一下整个 `then` 方法可以拆成几个小逻辑来理解：
+ `onFulfilled` 和 `onRejected` 不是函数的时候改成函数。
+ `PENDING` 状态下 `onFulfilled` 放到队列中，但是放进去之前要用 `try catc`h 捕捉异常，`queueMicrotask` 实现异步，剩下的交给 `promiseresolve` 去处理，`onRejected` 处理逻辑也类似。
于是我们可以整理一下代码，变成下面这个样子：
```js
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        const then_promise = new MyPromise((resolve, reject) => {
+            const fulfillcallback = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.promiseResult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
+            const rejectedcallback = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.promiseResult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            if (this.promiseStatus == FULFILLED) {
                fulfillcallback()
            }
            else if (this.promiseStatus == REJECTED) {
                rejectedcallback()
            }
            else {
                this.onFulfilleds.push(fulfillcallback)
                this.onRejecteds.push(rejectedcallback)
            }
        })


        return then_promise
    }
```
接下来就是最后一个关卡，`promiseresolve` 函数如何去写？别急，有规范！
## promiseresolve 的实现 🤢
### 规范
-   <span id="2_3_1">[2.3.1](#2_3_1_e) 如果`promise`和`x`引用同一个对象，用一个`TypeError`作为原因来拒绝`promise`
-   [2.3.2](#2_3_2_e). 如果`x`是一个`promise`，采用它的状态：[3.4]
    -   2.3.2.1. 如果`x`是**等待**态，`promise`必须保持等待状态，直到`x`被**解决**或**拒绝**
    -   2.3.2.2. 如果`x`是**解决**态，用相同的值**解决**`promise`
    -   2.3.2.3. 如果`x`是**拒绝**态，用相同的原因**拒绝**`promise`
-   [2.3.3](#2_3_3_e). 否则，如果`x`是一个对象或函数
    -   2.3.3.1 让`then`成为`x.then`。
    -   2.3.3.2. 如果检索属性`x.then`导致抛出了一个异常`e`，用`e`作为原因拒绝`promise`
    -   2.3.3.3. 如果`then`是一个函数，用`x`作为`this`调用它。`then`方法的参数为俩个回调函数，第一个参数叫做`resolvePromise`，第二个参数叫做`rejectPromise`：
        -   2.3.3.3.1. 如果`resolvePromise`用一个值`y`调用，运行`[[Resolve]](promise, y)`。译者注：这里再次调用`[[Resolve]](promise,y)`，因为`y`可能还是`promise`
        -   2.3.3.3.2.  如果`rejectPromise`用一个原因`r`调用，用`r`拒绝`promise`。译者注：这里如果`r`为`promise`的话，依旧会直接`reject`，**拒绝**的原因就是`promise`。并不会等到`promise`被**解决**或**拒绝**
        -   2.3.3.3.3. 如果`resolvePromise`和`rejectPromise`都被调用，或者对同一个参数进行多次调用，那么第一次调用优先，以后的调用都会被忽略。译者注：这里主要针对`thenable`，`promise`的状态一旦更改就不会再改变。
        -   2.3.3.3.4如果调用`then`抛出了一个异常`e`,
            -   2.3.3.4.1. 如果`resolvePromise`或`rejectPromise`已经被调用，忽略它
            -   2.3.3.4.2. 否则，用`e`作为原因拒绝`promise`

     -   2.3.3.4. 如果`then`不是一个函数，用`x`**解决**`promise`
  -   [2.3.4](#2_3_4_e). 如果`x`不是一个对象或函数，用`x`解决`promise`

### 规范分析
首先我们知道 `promiseresolve` 函数是为了更好的得到在不同的 `x` 情况下，`then_promise` 的结果。整个 `promiseresolve` 函数的规范非常的长，但是概括起来就是讨论 `x` 的多种情况：
#### [<span id="2_3_1_e">x 是和 then_promise 是同一个对象](#2_3_1)
即 `x` 返回了 `then_promise` 本身，会造成循环引用（如下图），所以不能让它等于它自己。

![循环引用.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/11375810d3164992a861fb32d9231ac1~tplv-k3u1fbpfcp-watermark.image?)
于是乎，我们可以在 `resolvepromise` 中写下规范 [2.3.1](#2_3_1) 的实现
```js
    resolvePromise(then_promise, x, resolve, reject) {
        if (then_promise === x) {
            return reject(new TypeError('不要循环引用'));
        }
    }
```
#### [<span id="2_3_2_e">x 是一个 promise ](#2_3_1)

   + 如果 `x` 是等待态，`then_promise` 就要等待 `x` 被解决或者拒绝；
   + `x` 如果是解决态，则 `then_promise` 用相同的值解决
   + `x` 是拒绝态，则 `then_promise` 用相同的值去拒绝
  
其中比较难理解的是 `x` 为等待态的时候，`then_promise` 如何等待 `x` 被解决或拒绝？如何拿到 `x` 这个 `promise` 的 `promiseResult`如何使用相同的值去解决？答案是调用 `x` 的 `then` 方法，然后把 `then_promise` 和 `then_promise` 本身的 `resolve` 和 `reject` 作为参数传入，好在后续代码中，确保 `x` 的 `promiseResult`（规范中用 `y` 表示）可以和 `then_promise` 保持联系，可以随时改变 `then_promise` 的状态。
    
    另外两种情况貌似容易理解，使用 `then_promise` 的 `resolve` 和 `reject` 分别处理 `x` 的 `promiseResult` 即可，于是我们可以尝试写下如下代码：
```js
    resolvePromise(then_promise, x, resolve, reject) {
        if (then_promise === x) {
            return reject(new TypeError('不要循环引用'));
        }
+        //x 是一个 promise
+        else if (x instanceof MyPromise) {
+            if (x.promiseStatus == FULFILLED) {
+                resolve(x.promiseResult)
+                return
+            }
+            if (x.promiseStatus == REJECTED) {
+                reject(x.promiseResult)
+                return
+            }
+            x.then((y) => {
+                this.resolvePromise(then_promise, y, resolve, reject)
+            }, r => reject(r))
+        }
}
```
这样写看起来是符合规范了，但是有一个问题。就是 `x` 的 `promiseResult` 的类型是未知的，它有可能还是一个 `promise`，比如下面这种情况，我们可以使用原生的 `demo` 和我们已经写好的手写代码部分去 `demo` 去测试，查看打印结果：
```js
let p1 = new Promise((resolve, reject) => {
    resolve('我是原生套娃一号🪆!')
})
let p2 = p1.then(() => {
    return new Promise((resolve,reject)=>{
        resolve(new Promise((resolve,reject)=>{
            resolve('我是原生套娃二号🪆!')
        }))
    })
})
console.log(p2)
/*
promise{
    promiseStatus:fulfilled,
    promiseResult:我是原生套娃二号🪆!
}
*/



let p1 = new MyPromise((resolve, reject) => {
    resolve('我是平替套娃一号🪆!')
})
let p2 = p1.then(() => {
    return new MyPromise((resolve,reject)=>{
        resolve(new MyPromise((resolve,reject)=>{
            resolve('我是平替套娃二号🪆!')
        }))
    })
})
console.log(p2)
/*
    mypromise:{
        promiseStatus:fulfilled,
        promiseResult:{
            promiseResult:'我是平替套娃二号🪆!',
            promiseStatus:fulfilled
        }
    }
*/
```

所以结论就是：无论 `promise（x）` 的状态如何，我们都要调用 `x` 的 `then` 方法，让 `x` 的 `promiseResult` 作为新的 `x` 来递归调用 `resolvePromise`，直到走出 `x instanceof MyPromise` 的循环条件。
```js
    resolvePromise(then_promise, x, resolve, reject) {
         ...
+        //x 是一个 promise
+        else if (x instanceof MyPromise) {
             ...
+            x.then((y) => {
+                this.resolvePromise(then_promise, y, resolve, reject)
+            }, r => reject(r))
+        }
}
```

#### [<span id="2_3_3_e">x 是一个对象或者函数（函数也是对象）,这里要排除掉 null，null 要归为第四种情况](#2_3_1)
  + **2.3.3.1** 和 **2.3.3.2** 合并一下，尝试获取 `x.then` 并检索异常，如果异常就用 `e` 作为原因拒绝 `then_promise`，如果成功获取就把 `x.then` 赋值给 `then`，这个操作在规范中注释 **3.5** 中做了解释，大概意思就是先把 `x.then` 的引用拿到，防止之后 `x.then` 发生变化，先赋值可以确保 `then` 变量一直拿到的是一致的。
```js
 else if (x !== null && typeof x === 'object' || typeof x === 'function') {
            try {
                const then = x.then;
            } catch (e) {
                return reject(e);
            }
        } 
```
+ `then` 是一个方法，用 `x` 作为 `this` 调用 `then`，有两个参数，分别是 `resolvePromise` 和 `rejectPromise`,`resolvePromise` 用新的 `x` 作为参数调用，`rejectPromise` 用原因 `r` 作为参数，内部调用 `reject` 拒绝。

+ 合并理解规范 **2.3.3.3.3** 和 **2.3.3.3.4**，我们还需要加一个参数来判断 `resolvePromise` 和 `rejectPromise` 是否被调用，如果已经被调用，需要以第一次调用为准，后续的调用要被忽略。

+ `then` 如果不是一个方法，用 `x` 解决 `then_promise`。

 ```javascript
 else if (x !== null && typeof x === 'object' || typeof x === 'function') {
            let hascalled=false
            try {
                const then = x.then;
               if (typeof then === 'function') {
                    then.call(
                        x,
                        y => {
                            if(hascalled)return;
                            hascalled=true
                            this.resolvePromise(then_promise, y, resolve, reject);
                        },
                        r => {
                            if(hascalled)return;
                            hascalled=true
                            reject(r);
                        }
                    )
                } else {
                    if(hascalled)return;
                    hascalled=true
                    resolve(x);
                }                
            } catch (e) {
                if(hascalled)return;
                hascalled=true
                return reject(e);
            }
        } 
  ```
  
#### [<span id="2_3_4_e">x 是一个平平无奇的其他东西](#2_3_1)
```js
resolvePromise(then_promise, x, resolve, reject) {
        ...
        else {
            //直接用x解决promise
            return resolve(x);
        }
    }
```
## 完整代码 ✅
写到这里，手写 `Promise` 的旅程就基本结束了，下面我们来看看这份手写 `Promise` 的完整代码：
```js
const PENDING = 'pending';
const FULFILLED = 'fulfill';
const REJECTED = 'rejected';
class MyPromise {
    constructor(executor) {
        this.promiseStatus = PENDING
        this.promiseResult = undefined
        this.onFulfilleds = []
        this.onRejecteds = []
        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        }
        catch (e) {
            this.reject(e.message)
        }
    }
    resolve(res) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = FULFILLED
            this.promiseResult = res
            while (this.onFulfilleds.length > 0) {
                this.onFulfilleds.shift()(this.promiseResult)
            }
        }
    }

    reject(reason) {
        if (this.promiseStatus == PENDING) {
            this.promiseStatus = REJECTED
            this.promiseResult = reason
            while (this.onRejecteds.length > 0) {
                this.onRejecteds.shift()(this.promiseResult)
            }
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        const then_promise = new MyPromise((resolve, reject) => {
            const fulfillcallback = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.promiseResult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            const rejectedcallback = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.promiseResult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            if (this.promiseStatus == FULFILLED) {
                fulfillcallback()
            }
            else if (this.promiseStatus == REJECTED) {
                rejectedcallback()
            }
            else {
                this.onFulfilleds.push(fulfillcallback)
                this.onRejecteds.push(rejectedcallback)
            }
        })
        return then_promise
    }
    resolvePromise(then_promise, x, resolve, reject) {
        if (then_promise === x) {
            return reject(new TypeError('不要循环引用'));
        }
        else if (x instanceof MyPromise) {
            x.then((y) => {
                this.resolvePromise(then_promise, y, resolve, reject)
            }, r => reject(r))
        }
        else if (x !== null && typeof x === 'object' || typeof x === 'function') {
            let called = false;
            try {
                const then = x.then;
                if (typeof then === 'function') {
                    then.call(
                        x,
                        y => {
                            if (called) return;
                            called = true;
                            this.resolvePromise(then_promise, y, resolve, reject);
                        },
                        r => {
                            if (called) return;
                            called = true;
                            reject(r);
                        }
                    )

                } else {
                    if (called) return;
                    called = true;
                    resolve(x);
                }
            } catch (e) {
                if (called) return;
                called = true;
                return reject(e);
            }

        } else {
            return resolve(x);
        }
    }
}
```
# PromiseA+ 测试 📜
既然是根据 A+ 规范来的，肯定要看看能不能通过测试。我们从在 `npm` 中下载一下 `promiseA+` 的测试库**promises-aplus-tests**，查找该库的使用方法如下：


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d66c5f7e69684bd0ac2044296ff53fc2~tplv-k3u1fbpfcp-watermark.image?)

然后在手写的 `js` 文件中写下符合要求的 `Adapter`
```js
MyPromise.deferred = function () {
    let result = {};
    result.promise = new MyPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
}

module.exports = MyPromise;
```
之后在当前文件夹执行 `npx promises-aplus-tests MyPromise`（MyPromise 为文件名），可以得到如下结果图（为了这个图专门去学了一下 OBS 的使用方法 🧐 ）：

![2022-01-25-17-33-00.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd3e3b38eb0e41d8b25e5b1864cf0db6~tplv-k3u1fbpfcp-watermark.image?)
 ## 关于文章选题的讨论 🗣
  一个月前，看到 [rock](https://juejin.cn/user/1468603266772264/posts) 同学的手写 `Promise` 文章后，就如何写文章，是否应该刻意避开同类文章以及文章中 `resolve` 中是否要加定时器等问题，双方使用微信语音友好深入交流了半个多小时，最后我用从 **rock** 同学文章中学到的知识点，加上自己的理解和资料的搜集，耗时将近三周的时间，得出了这篇文章。虽说耗费心神，但是也收获良多。

 ## 真香？🤤
  也是上个月左右，偶然在[哪吒同学](https://juejin.cn/user/1451011081249175)的粉丝群中吹水聊天，聊到 **mac** 开发还是 **windows** 开发。本着没有使用就没有发言权的精神内核，加上年关将近，在老家办公（虽然最后回不去了）已成刚需，痛下狠心入了 **mac pro**。
  
![WechatIMG40.jpeg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b9fe287330c3439498d72a31beb2c8eb~tplv-k3u1fbpfcp-watermark.image?)
**结论：初期使用会有点不适应，稍微习惯之后，会觉得 mac 在操作和性能上都比较丝滑，许多功能尚待开发，目前为止感觉良好。**
 ## 大佬给出的建议 🥂
  写文章之前也咨询了多个掘金大佬关于学习和写作的问题。包括输入法配置中英文空格，贴大段规范的必要性等等问题和思路，大佬们都非常热心的帮忙解答了问题。这一个月来和大家聊天的过程中，对之前的学习和生活做了写总结和反思，也学习了很多有效的学习方法和良好的学习习惯，为了避免蹭热度的嫌疑，就不一一点名，总而言之言而总之，**感谢！**
  
  对文章中的**措辞表达**、**知识点**、**文章格式**等方面有任何疑问或者建议，都可以在评论区告诉我，非常乐意和社区里的大家交朋友聊聊天。
  
🎉🎉  **最后祝大家新年快乐！在新的一年身体健康，工资 up up!** 🎉🎉

## 感谢七酱的建议

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1cf1bc0f3c4f4f7b9abfb90ea3d570a5~tplv-k3u1fbpfcp-watermark.image?)
正月初一， 感谢低调青年群友 **七酱** 在阅读文章后给出的中肯建议，文章已经在7：35 的时候根据修改意见进行了修改。特在此进行记录，希望以后可以跟大家一起进步。
# 参考文章 📄

[javascript 忍者秘籍(第二版)](https://weread.qq.com/web/reader/a9f32eb0715a41a9a9f7812kc81322c012c81e728d9d180)

[A+规范](https://promisesaplus.com/)

[A+规范中文翻译](https://zhuanlan.zhihu.com/p/143204897)

[9k字 | Promise/async/Generator实现原理解析](https://juejin.cn/post/6844904096525189128#heading-15)

[手把手一行一行代码教你“手写Promise“，完美通过 Promises/A+ 官方872个测试用例](https://juejin.cn/post/7043758954496655397#heading-10)

[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469)

[PromiseA+规范之手写Promise](https://blog.csdn.net/weixin_56650035/article/details/121070438)
[深入：微任务与Javascript运行时环境](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)



