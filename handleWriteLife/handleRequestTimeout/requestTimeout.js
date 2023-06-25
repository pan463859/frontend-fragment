const wait = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    });
};

const isTimeOut = function (fn, second) {
    let promise1 = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject();
        }, second * 1000);
    });
    return Promise.race([promise1, fn()])
};

const f = () => {
    return wait(8)
};

isTimeOut(f, 4).then(() => {
    console.log("success");
}, () => {
    console.log("fail");
})
