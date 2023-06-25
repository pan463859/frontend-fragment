const PENDING = 'pending';
const FULFILLED = 'fulfill';
const REJECTED = 'rejected';
class MyPromise {
    constructor(executor) {
        this.promisestatus = PENDING
        this.promiseresult = undefined
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
        if (res !== undefined && typeof res.then === 'function') {
            return res.then((y) => {
                resolve(y);
            }, (r) => {
                reject(r);
            });
        }
        if (this.promisestatus == PENDING) {
            this.promisestatus = FULFILLED
            this.promiseresult = res
            while (this.onFulfilleds.length > 0) {
                this.onFulfilleds.shift()(this.promiseresult)
            }
        }
    }

    reject(reason) {
        if (this.promisestatus == PENDING) {
            this.promisestatus = REJECTED
            this.promiseresult = reason
            while (this.onRejecteds.length > 0) {
                this.onRejecteds.shift()(this.promiseresult)
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
                        const x = onFulfilled(this.promiseresult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            const rejectedcallback = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.promiseresult)
                        this.resolvePromise(then_promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            if (this.promisestatus == FULFILLED) {
                fulfillcallback()
            }
            else if (this.promisestatus == REJECTED) {
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
        //判断x是一个对象或函数
        else if (x !== null && typeof x === 'object' || typeof x === 'function') {
            //定义一个变量判断是否被调用过
            let called = false;
            try {
                //2.3.3.1
                const then = x.then;
                if (typeof then === 'function') {
                    then.call(
                        x,
                        // 2.3.3.3.1 如果resolvePromise用一个值y调用，运行[[Resolve]](promise, y) 如果resolvePromise和rejectPromise都被调用，或者对同一个参数进行多次调用，那么第一次调用优先，以后的调用都会被忽略。
                        y => {
                            if (called) return;
                            called = true;
                            this.resolvePromise(then_promise, y, resolve, reject);
                        },
                        // 2.3.3.3.2 如果rejectPromise用一个原因r调用，用r拒绝promise。 如果resolvePromise和rejectPromise都被调用，或者对同一个参数进行多次调用，那么第一次调用优先，以后的调用都会被忽略。
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
                //2.3.3.2
                if (called) return;
                called = true;
                return reject(e);
            }

        } else {
            //直接用x解决promise
            return resolve(x);
        }
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
    finally(onFinally) {
        return new MyPromise((resolve, reject) => {
            this.then((result) => {
                onFinally();
                resolve(result);
            }, (reason) => {
                onFinally();
                reject(reason);
            });
        });
    }
}
MyPromise.resolve = function (value) {
    // 处理参数为 MyPromise 的情况
    if (value instanceof MyPromise) return value;
    // 处理其他情况
    return new MyPromise((resolve) => {
        resolve(value);
    });
}
MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => {
        reject(reason)
    })
}
MyPromise.all = function (params) {
    if (!(typeof params[Symbol.iterator] === 'function')) {
        throw new TypeError('params is not an iterator')
    }
    return new MyPromise((resolve, reject) => {
        //参数为空的时候，直接返回状态为 fulfilled 的 promise，result 为[]
        const final = []
        let len = args.length;
        if (len === 0) return resolve(final);
        for (let i = 0; i < params.length; i++) {
            const item = params[i];
            //非 promise 的转换成 promise,then 方法可以展开所有的 promise 的嵌套
            MyPromise.resolve(item).then((result) => {
                final[i] = result;
                if (--len === 0) {
                    resolve(final);
                }
            }, (reason) => {
                // 一旦有promise被拒绝就立即拒绝
                reject(reason);
            });
        }
    });
};
MyPromise.allSettled = function (params) {
    if (!(typeof params[Symbol.iterator] === 'function')) {
        throw new TypeError('params is not an iterator')
    }
    const result = [];
    let count = 0;
    for (let i = 0; i < params.length; i++) {
        const item = params[i];
        //MyPromise.resolve 处理迭代器中的非promise 对象，把它们变成 promise
        //then 方法拿到 promise 的 result,并且可以展开循环嵌套
        MyPromise.resolve(item).then((result) => {
            result[i] = { status: 'fulfilled', value: result };
            if (++count === params.length) {
                resolve(result);
            }
        }, (reason) => {
            ++count;
            result[i] = { status: 'rejected', reason };
        });
    }
}

MyPromise.race = function (params) {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < params.length; i++) {
            const item = params[i];
            MyPromise.resolve(item).then(
                (value) => {
                    resolve(value)
                }, (reason) => {
                    reject(reason)
                })
        }
    })
}

MyPromise.any = function (params) {
    if (!(typeof params[Symbol.iterator] === 'function')) {
        throw new TypeError('params is not an iterator')
    }
    return new MyPromise((resolve, reject) => {
        //参数为空的时候，直接返回状态为 fulfilled 的 promise，result 为[]
        const final = []
        let len = args.length;
        if (len === 0) return resolve(final);
        for (let i = 0; i < params.length; i++) {
            const item = params[i];
            //遇到 resolve，直接改变结果 promise 的 promiseresult 和 promisestatus，后续的更改不会生效
            MyPromise.resolve(item).then((result) => {
                resolve(result);
            }, (reason) => {
                // 一旦有promise被拒绝就放入数组，攒满后才会返回
                final[i] = reason;
                if (--len === 0) {
                    reject(final);
                }

            });
        }
    });
};

MyPromise.deferred = function () {
    let result = {};
    result.promise = new MyPromise((resolve, reject) => {
        result.resolve = resolve;
        result.reject = reject;
    });
    return result;
}

module.exports = MyPromise;

MyPromise.resolve().then(() => {
    console.log(0);
    return MyPromise.resolve(4);
}).then((res) => {
    console.log(res)
})

MyPromise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() =>{
    console.log(6);
})
