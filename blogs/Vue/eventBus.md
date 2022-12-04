---
title: EventBus
date: 2019-04-18
sidebar: "auto"
categories:
  - Vue.js
tags:
  - Vue
---

```js
class EventBus {
  constructor() {
    this.events = {};
  }
  on(msg, func) {
    if (typeof func !== "function") {
      return;
    }
    const callback = this.events[msg] || [];
    callback.push(func);
    this.events[msg] = callback;
  }
  emit(msg, data) {
    if (!this.events[msg]) return;
    this.events[msg].forEach((func) => {
      func(data);
    });
  }
  once(msg, func) {
    if (typeof func !== "function") {
      return;
    }
    const once = (...args) => {
      func(...args);
      this.off(msg, once);
    };
    once.initalCallback = func;
    this.on(msg, once);
  }
  off(msg, func) {
    if (arguments.length === 0) {
      this.events = {};
    } else if (this.events.hasOwnProperty(msg) && !func) {
      delete this.events[msg];
    } else if (this.events.hasOwnProperty(msg) && func) {
      const callback = this.events[msg].filter(
        (fn) => fn != func && fn.initalCallback != func
      );
      this.events[msg] = callback;
    }
  }
}

const b1 = (data) => {
  console.log("1", data);
};
const b2 = (data) => {
  console.log("2", data);
};
const b3 = (data) => {
  console.log("3", data);
};
const e = new EventBus();
e.on("age", b1);
e.on("name", b1);
e.on("name", b2);
e.once("name", b3);
e.emit("name", { a: 1 });
e.emit("name", 1);
e.off("name");
e.emit("age", 2);
```
