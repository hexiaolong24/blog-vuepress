Promise.resolve().then(() => console.log(4));
process.nextTick(() => console.log(3));
