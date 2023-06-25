---
theme: orange
---
# 碎碎念🤥
　　大家好，我是潘小安！一个永远在减肥路上的前端er 🐷 ！
  
　　我个人是不喜欢做重复工作的，社区中已经有很多深拷贝相关的文章和资料了，为什么我还要写一篇呢？原因在于社区的资料确实很多，但是没有一篇有我自己的思考，其他文章是通过其他作者的逻辑推理出来，我看是可以看懂，但是如果让我当场写一个，我可能无从下笔。所以我需要一个基于自己的理解和逻辑的深拷贝版本。只有这样做，才能在下一次阅读文章的时候看到深拷贝相关知识点，心里才不会犯怵，才不会有类似：”**我好像并没有掌握透，我还要点进去看看**“的想法。
  
  心路历程介绍就到这里，接下来开始我们的深拷贝之旅 🚄。

# 前置知识点
## 深拷贝？浅拷贝？
两者的区别就是如何处理**引用类型**，原始引用类型的值变，拷贝结果跟着变的就是浅拷贝，拷贝结果不会跟着变的就是深拷贝。我们日常项目开发中常见的浅拷贝有：`Object.assign()`,数组的 `concat` 和 `slice` 方法等。

## why not JSON.parse(JSON.stringify())？

-   时间对象会被强制转换成字符串（**如果有在项目中使用 moment 的格式的同学，可以尝试使用 JSON.stringify() 转换一下看看效果，有惊喜**）
-   RegExp 和 Error对象会被转换成空对象
-   对象中的函数和 undefined 会被直接删除
-   对象中的 NaN，Infinity 和 -Infinity，会被转换成 null
-   由自定义构造函数生成的对象会丢失 constructor 引用
-   无法处理循环引用

# 从零开始的深拷贝
深拷贝本身其实蕴含了很多 js 的基础知识，接下来会从如何处理基础数据、如何处理普通对象、如何处理循环引用等各个节点对深拷贝进行逐个突破，在这之前我们先来回顾一下如何准确的判断一个变量到底是什么类型。

## 如何准确的判断一个变量的类型？

我们可以先用 typeof 做第一层过滤。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d566799b96b1423e87163ead58f37d2b~tplv-k3u1fbpfcp-watermark.image?)

```js
function isObject(target){
  const type=typeof target;
  return target!=null&&(type==='object'||type==='function)
}
```

另外我们可以用 Object.prototype.toString() 来返回变量的具体类型，我们根据深拷贝的需求把他们划分成基本数据类型，需要遍历的引用类型以及不需要遍历的引用类型。
+ 基本数据类型
| 基本数据类型                              | 结果               |
| ----------------------------------------- | ------------------ |
| Object.prototype.toString.call(null)      | [Object Null]      |
| Object.prototype.toString.call(undefined) | [Object Undefined] |
| Object.prototype.toString.call(true)      | [Object Boolean]   |
| Object.prototype.toString.call(9527)      | [Object Number]    |
| Object.prototype.toString.call('lufei')   | [Object String]    |
| Object.prototype.toString.call(Symbol())  | [Object Symbol]    |

+ 需要遍历的引用类型
| 需要遍历的引用类型                        | 结果            |
| ----------------------------------------- | --------------- |
| Object.prototype.toString.call({})        | [Object Object] |
| Object.prototype.toString.call([])        | [Object Array]  |
| Object.prototype.toString.call(new Set()) | [Object Set]    |
| Object.prototype.toString.call(new Map()) | [Object Map]    |

+ 不需要遍历的引用类型
| 不需要遍历的引用类型                         | 结果              |
| -------------------------------------------- | ----------------- |
| Object.prototype.toString.call(new Error)    | [Object Error]    |
| Object.prototype.toString.call(new RegExp()) | [Object RegEXP]   |
| Object.prototype.toString.call(window)       | [Object global]   |
| Object.prototype.toString.call(JSON)         | [Object JSON]     |
| Object.prototype.toString.call(Math)         | [Object Math]     |
| Object.prototype.toString.call(fucntion(){}) | [Object Function] |

接下里我们就根据不同的数据类型，来完成深拷贝相关的逻辑。
## 处理基本类型
在上面我们已经知道如何筛选出基本类型了，如果是基本类型，我们直接返回就好。
```js
function isObject(target) {
    const type = typeof target;
    return target != null && (type === 'object' || type === 'function')
}

function clonedeep(target) {
    //处理基本数据类型
    if (!isObject(target)) {
        return target
    }
}
```

## 处理普通对象（plain object）
遇到普通对象的时候，我们需要遍历其中的每一个键值，然后赋值给新创建的空对象。由于无法确定对象中每一项的值是什么类型，所以这里我们需要递归调用 `clonedeep` 方法。
```js
function clonedeep(target) {
    //处理基本数据类型
   ...
    //处理对象
    if (typeof target === 'object') {
        let result = {}
        for (const key in target) {
            result[key] = clonedeep(target[key]);
        }
        return result;
    }
}
```

## 处理循环引用

在处理对象类型的时候，我们就需要考虑循环引用的问题，如果一个对象中存在对自身的引用，如果和上面这样去写拷贝代码的话，代码会在处理对象的这个逻辑块中一直循环下去，也是是我们说的**死循环**，那如何解决这个问题呢？答案就是如果检测到有循环引用，就不让他循环。那么我们接下来有两个问题 ：

-   **如何检测一个对象中是否存在循环引用？**
    + 我们可以使用一个 Map 记录下所有被拷贝过的对象，若再次命中，则说明循环引用了该对象。由于键值是对象，我们可以使用 Weakmap 利于内存回收。
-   **如果检测到循环引用如何处理来中断循环？**
    + 每次拷贝前检测该对象是否被拷贝过，若被拷贝过，则不走递归，而是直接返回。
```javascript
function clonedeep(target, map = new WeakMap()) {
    //处理基本数据类型
    ...
    //处理对象
    if (typeof target === 'object') {
        let result = {}
+        if (map.get(target)) {
+            return map.get(target)
+        }
        map.set(target, result)
        for (const key in target) {
            result[key] = clonedeep(target[key], map);
        }
+      
        return result;
    }
}
```


## 处理数组

上面我们已经考虑的普通的 object，数组其实也可以使用 for in 循环去遍历，唯一不同点就是数组的 result 初始化的时候是一个数组，于是可以写出下面的代码：

```javascript
function clonedeep(target,map=new WeakMap() {
    //处理基本数据类型
   ...
    //处理对象
    if (typeof target === 'object') {
+       let result = Array.isArray(target)?[]:{}
        if (map.get(target)) {
            return map.get(target)
        }
        map.set(target, result)
        for (const key in target) {
            result[key] = clonedeep(target[key],map);
        }
        return result;
    }
}
```
## 其他可遍历引用类型
我们在之前的判变量类型中已经说过，把其他引用类型分成了需要遍历的和不需要遍历的，除了上面说的 `plainobject` 和 `Array` 之外，我们还有 `Set` 和 `Map` 需要处理。我们先把所有可遍历的类型汇总放在一个地方，方便后续的逻辑处理。
```
const mapType = '[object Map]';
const setType = '[object Set]';
const arrayType = '[object Array]';
const objectType = '[object Object]';
const deepmap=[mapType, setType, arrayType, objectType]
```
可遍历的引用对象原型上都有迭代器 `Iterator`，他们的不同之处在于初始化方式不一样，数据添加的方式不一样，所以我们需要一些辅助函数来帮助我们统一做这件事。
### 不同数据类型的初始化
不同的数据类型，都有一个 constructor 变量指向该对象的构造函数，我们可以从这里入手，去做不同数据类型的初始化。
```js
function getInit(target){
    return new target.constructor()
}
```
根据不同的类型去使用对应数据类型的 api 添加数据进行拷贝。于是我们按照这个逻辑可以得到以下代码：
```js
//判断一个对象的具体类型
const mapType = '[object Map]';
const setType = '[object Set]';
const arrayType = '[object Array]';
const objectType = '[object Object]';
const deepmap = [mapType, setType, arrayType, objectType]

function isObject(target) {
    const type = typeof target;
    return target != null && (type === 'object' || type === 'function')
}
function getType(target) {
    return Object.prototype.toString().call(target)
}
function getInit(target) {
    return new target.constructor()
}
function clonedeep(target, map = new WeakMap()) {
    //处理基本数据类型
    if (!isObject(target)) {
        return target
    }
    //处理引用类型
    else {
        if (map.get(target)) {
            return map.get(target)
        }
        map.set(target, result)
        let result
        const type = getType(target)
        //处理可继续遍历对象
        if (deepmap.includes(type)) {
            result = getInit(target)
            // 处理 Set
            if (type === setType) {
                target.forEach(value => {
                    result.add(deepclone(value, map));
                });
                return result;
            }
            // 处理 Map
            if (type === mapType) {
                target.forEach((value, key) => {
                    result.set(key, deepclone(value, map));
                });
                return result;
            }
            //处理对象或者数组
            for (const key in target) {
                result[key] = clonedeep(target[key], map);
            }
            return result;
        } else {
            //处理其他引用类型
        }

    }
}
```
这次我们主要做了哪些改动呢？
+ 使用 `getType` 获取准确的数据类型。
+ 我们把 `plain Object` 和数组的初始化统一放到了 `getInit` 中，使用构造函数统一创建。
+ 增加了处理 `Set` 和 `Map` 的逻辑，使用数据类型自带的 `forEach` 进行遍历赋值，值得注意的是，所有可遍历的对象的 `value` 都需要递归获取，因为 `value` 的数据类型未知。
## 其他不可遍历引用类型
剩下的就是一些其他的引用类型，其中包括：
+ 基本类型的包装类型
+ Date 时间类型
+ Error 错误类型
+ Symbol 包装器对象（单独拎出来）
+ Regexp 正则
+ 函数类型
+ null （处理剩下的就都是 null）
### 打包带走
有哪些可以打包带走的呢？除 `Symbol 包装器对象`的其他基本类型的包装类型，时间类型，Error 类型，可以直接用相对应的构造器直接创建新实例后返回：
```js
const boolType = '[object Boolean]';
const dateType = '[object Date]';
const numberType = '[object Number]';
const stringType = '[object String]';
const symbolType = '[object Symbol]';
const errorType = '[object Error]';
const regexpType = '[object RegExp]';
const funcType = '[object Function]';
function cloneOtherType(){
    const Ctor = targe.constructor;
    switch (type) {
        case boolType:
        case numberType:
        case stringType:
        case errorType:
        case dateType:
            return new Ctor(targe);
        case funcType:
        
        case regexpType:
           
        case symbolType:
            
        default:
            return null;
    }
}
```
### Symbol 包装器对象
可能会有同学会问，使用 `Symbol()` 创建的对象应该在 `isObject` 中就被过滤掉了，为什么还要在 `cloneOtherType` 去写它的逻辑？我们来看一下下面这个 demo：
```js
let a=Symbol(1)
let b=Object(Symbol(1))
console.log(typeof a)
console.log(typeof b)
console.log(a)
console.log(b)
```
打印结果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90ff15339d614985a73d45f0661e5c8b~tplv-k3u1fbpfcp-watermark.image?)

也就是说在 `cloneOtherType` 中要处理的是 `Symbol` 的包装类型，也就是 demo 代码中的 `Object(Symbol(1))`。

js 标准有意淡化创建所有基本类型的包装类型，Symbol 也好，bigInt 也好，在使用 new 去做实例创建的时候都会报错，其意图在鼓励广大开发者利用好 js 的隐式包装。所以在拷贝 Symbol 的包装对象的时候，首先要获取到 Symbol 本身的值，然后再用 Object() 包裹后返回。
```
function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}
```

### Regexp 正则

```
function cloneRegExp(regexp) {
    const result = new RegExp(regexp.source, reFlags.exec(regexp))
    result.lastIndex = regexp.lastIndex
    return result
}
```
正则实例的创建有两点细节，以常见的`/w+/g`正则为例：
+ 创建的时候不仅需要正则的 `source` 部分，还需要后面的修饰符(flags)部分。
+ 拷贝正则的时候需要考虑正则中的 lastIndex 值，这个值是在使用正则对象的 test 和 exec 方法，当修饰符为 g 或者 y 的时候，会改变的一个值。具体细节和 demo 这里强烈推荐大家看看[姚老师的文章](https://juejin.cn/post/6844903775384125448)。
### 函数类型
个人认为：因为函数本身在哪里定义并不重要，重要的是函数在哪里调用，所以函数类型可以直接返回函数本身，不需要多余操作。如果硬要进行拷贝一份，可以参考[抖音前端安全组的这篇文章](https://blog.csdn.net/weixin_46100406/article/details/105562088)

# 完整代码
# 参考资料
[JSON.parse(JSON.stringify(obj)) 实现深拷贝的弊端](https://blog.csdn.net/weixin_46100406/article/details/105562088)

[抖音前端安全-如何写出一个惊艳面试官的深拷贝](https://juejin.cn/post/6844903929705136141#heading-10)

[姚老师-如何 clone 一个正则](https://juejin.cn/post/6844903775384125448)

[紫云飞-symbol 为什么没有包装类型](https://www.zhihu.com/question/316717095) 
