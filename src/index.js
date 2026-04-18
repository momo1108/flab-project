const arrowFunction = () => {
    return "Hello, Babel!";
};

const promiseExample = new Promise((res, rej) => {
    setTimeout(() => {
        res("Promise Resolved!");
    }, 1000);
})

promiseExample.then(console.log);

console.log(arrowFunction());