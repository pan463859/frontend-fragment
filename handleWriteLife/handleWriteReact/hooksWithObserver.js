// hook 细粒度更新写法
function useState(value) {
    const getter = () => {
        return value
    }
    const setter = (newValue) => {
        value = newValue
        return value
    }
    return [getter, setter]
}
const [count, setCount] = useState(0)
