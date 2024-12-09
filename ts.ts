function Logger(constructor: Function) {
  const original = constructor;

  const newConstructor: any = function (...args: any[]) {
    console.log(`Creating instance of ${original.name} with arguments:`, args);
    // @ts-ignore
    console.log("============", constructor.aaa);
    // @ts-ignore
    console.log("============", this.aaa);
    // @ts-ignore
    return new original(...args);
  };

  return newConstructor;
}

@Logger
class User {
  aaa = 1;
  constructor(public name: string, public age: number) {}
}

// 实例化时，会触发装饰器的日志记录
const user = new User("Alice", 30);
