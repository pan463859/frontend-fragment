/**
 * 
 * 实现数据监听
 */
/**
* 观察者功能
*/
// 发布者
function Subject() {

    // 订阅者容器
    this.observers = [];

    // 添加一个订阅者
    this.attach = function (callback) {
        this.observers.push(callback);
    };

    // 通过所有的订阅者
    this.notify = function (value) {
        this.observers.forEach(callback => callback(value));
    };
}

// 订阅者：理解为发布者发生变动后的操作
function Observer(queue, key, callback) {
    queue[key].attach(callback);
}

// ====

// 数据手动更新
function setData(data, key, value) {
    data[key] = value;

    // 通知此值的所有订阅者，数据发生了更新
    messageQueue[key].notify(value);
}

// ====

// 发布者队列
const messageQueue = {};

// 数据
const myData = { value: "" };

// 将每个数据属性变成发布者
for (let key in myData) {
    messageQueue[key] = new Subject();
}

// 订阅 value 值的变化
Observer(messageQueue, "value", value => {
    console.warn("value updated:", value);
});

// 更新数据
setData(myData, "value", "hello world.");
setData(myData, "value", 100);
setData(myData, "value", true);

//ES5中新增了Object.definePrototype可以自定义对象属性的getter和setter
//对数据的更新可以直接用表达式做

// 发布者
function Subject() {
    this.observers = [];
    this.attach = function (callback) {
        this.observers.push(callback);
    };
    this.notify = function (value) {
        this.observers.forEach(callback => callback(value));
    };
}

// 订阅者
function Observer(queue, key, callback) {
    queue[key].attach(callback);
}

// 数据拦截器
function Watcher(data, queue) {
    for (let key in data) {
        let value = data[key];
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => value,
            set: newValue => {
                value = newValue;

                // 通知此值的所有订阅者，数据发生了更新
                queue[key].notify(value);
            }
        });
    }
    return data;
}


// 消息队列
const messageQueue = {};
// 将每个数据属性都添加到观察者的消息队列中
for (let key in myData) {
    messageQueue[key] = new Subject();
}
// 数据
const myData = Watcher({ value: "" }, messageQueue);

// 订阅 value 值的变化
Observer(messageQueue, "value", value => {
    console.warn("value updated:", value);
});

// 更新数据
myData.value = "hello world.";
myData.value = 100;
myData.value = true;



//之后添加了Proxy可以在原对象外面包装一层Proxy，更方便的做数据过滤和逻辑处理

// 发布者
function Subject() {
    this.observers = [];
    this.attach = function (callback) {
        this.observers.push(callback);
    };
    this.notify = function (value) {
        this.observers.forEach(callback => callback(value));
    };
}

// 订阅者
function Observer(queue, key, callback) {
    queue[key].attach(callback);
}

// ====

// 数据拦截器 - 代理方式
function ProxyWatcher(data, queue) {
    return new Proxy(data, {
        get: (target, key) => target[key],
        set(target, key, value) {
            target[key] = value;

            // 通知此值的所有订阅者，数据发生了更新
            queue[key].notify(value);
        }
    });
}

// ====

// 消息队列
const messageQueue = {};

// 数据
const myData = ProxyWatcher({ value: "" }, messageQueue);

// 将每个数据属性都添加到观察者的消息队列中
for (let key in myData) {
    messageQueue[key] = new Subject();
}

// 订阅 value 值的变化
Observer(messageQueue, "value", value => {
    console.warn("value updated:", value);
});

// 更新数据
myData.value = "hello world.";
myData.value = 100;
myData.value = true;


/**
* 
* 实现模板解析（视图到数据的绑定）
*/
<div id="app">
    <input v-model="value" />
    <p v-text="value"></p>
</div>
// 模板解析
function Compile(el, data) {

    // 关联自定义特性
    if (el.attributes) {
        [].forEach.call(el.attributes, attribute => {
            if (attribute.name.includes('v-')) {
                Update[attribute.name](el, data, attribute.value);
            }
        });
    }

    // 递归解析所有DOM
    [].forEach.call(el.childNodes, child => Compile(child, data));
}

// 自定义特性对应的事件
const Update = {
    "v-text"(el, data, key) {

        // 初始化DOM内容
        el.innerText = data[key];
    },
    "v-model"(input, data, key) {

        // 初始化Input默认值
        input.value = data[key];

        // 监听控件的输入事件，并更新数据
        input.addEventListener("keyup", e => {
            data[key] = e.target.value;
        });
    }
};

// ====

// 数据
const myData = { value: "hello world." };

// 解析
Compile(document.querySelector("#app"), myData);

/**
 * 
 * 完整的双向绑定
 */
// 发布者
function Subject() {
    this.observers = [];
    this.attach = function (callback) {
        this.observers.push(callback);
    };
    this.notify = function (value) {
        this.observers.forEach(callback => callback(value));
    };
}

// 订阅者
function Observer(queue, key, callback) {
    queue[key].attach(callback);
}

// ====

// 数据拦截器 - 代理方式
function ProxyWatcher(data, queue) {
    return new Proxy(data, {
        get: (target, key) => target[key],
        set(target, key, value) {
            target[key] = value;

            // 通知此值的所有订阅者，数据发生了更新
            queue[key].notify(value);
        }
    });
}

// ====

// 模板解析
function Compile(el, data) {

    // 关联自定义特性
    if (el.attributes) {
        [].forEach.call(el.attributes, attribute => {
            if (attribute.name.includes('v-')) {
                Update[attribute.name](el, data, attribute.value);
            }
        });
    }

    // 递归解析所有DOM
    [].forEach.call(el.childNodes, child => Compile(child, data));
}

// 自定义特性对应的事件
const Update = {
    "v-text"(el, data, key) {

        // 初始化DOM内容
        el.innerText = data[key];

        // 创建一个数据的订阅，数据变化后更新展示内容
        Observer(messageQueue, key, value => {
            el.innerText = value;
        });
    },
    "v-model"(input, data, key) {

        // 初始化Input默认值
        input.value = data[key];

        // 监听控件的输入事件，并更新数据
        input.addEventListener("keyup", e => {
            data[key] = e.target.value;
        });

        // 创建一个订阅
        Observer(messageQueue, key, value => {
            input.value = value;
        });
    }
};

// ====

// 消息队列
const messageQueue = {};

// 数据
const myData = ProxyWatcher({ value: "hello world." }, messageQueue);

// 将每个数据属性都添加到观察者的消息队列中
for (let key in myData) {
    messageQueue[key] = new Subject();
}

// ====

// 解析+关联
Compile(document.querySelector("#app"), myData);
