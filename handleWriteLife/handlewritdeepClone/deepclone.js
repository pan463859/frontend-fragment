//判断一个对象的具体类型
const mapType = '[object Map]';
const setType = '[object Set]';
const arrayType = '[object Array]';
const objectType = '[object Object]';
const deepmap = [mapType, setType, arrayType, objectType]

const boolType = '[object Boolean]';
const dateType = '[object Date]';
const numberType = '[object Number]';
const stringType = '[object String]';
const symbolType = '[object Symbol]';
const errorType = '[object Error]';
const regexpType = '[object RegExp]';
const funcType = '[object Function]';

//先考虑是否是对象
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
function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}
function cloneRegExp(regexp) {
    const result = new RegExp(regexp.source, reFlags.exec(regexp))
    result.lastIndex = regexp.lastIndex
    return result
}

function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolType:
        case numberType:
        case stringType:
        case errorType:
        case dateType:
            return new Ctor(targe);
        case regexpType:
            return cloneRegExp(targe);
        case symbolType:
            return cloneSymbol(targe);
        case funcType:
            return target;
        default:
            return null;
    }
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
            cloneOtherType(targe, type)
        }
    }
}

