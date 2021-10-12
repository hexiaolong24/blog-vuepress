---
title: EventBus
date: 2019-04-18
sidebar: 'auto'
categories:
 - Vue.js
tags:
 - Vue
 - 前端
 - 框架
---

```js
/**
 * events = {
        test: [{
            event: func,
            once: false
        }]
    }
 * 
*/
class EventBus {
    events = {}
    on(msg, func) {
        if(typeof func !== 'function') {
            return
        }
        if(!this.events[msg]) {
            this.events[msg] = []
        }
        this.events[msg].push({
            event: func,
            once: false
        })
    }
    emit(msg, data) {
        if(!this.events[msg]) return
        this.events[msg].forEach((item, index) => {
            item.event(data)
            if(item.once) {
                this.events[msg].splice(index, 1)
            }
        })
    }
    once(msg, func) {
        if(typeof func !== 'function') {
            return
        }
        if(!this.events[msg]) {
            this.events[msg] = []
        }
        this.events[msg].push({
            event: func,
            once: true
        })
    }
    off(msg, func) {
        if(arguments.length === 0) {
            this.events = {}
        }else if(this.events.hasOwnProperty(msg) && !func) {
            delete this.events[msg]
        }else if(this.events.hasOwnProperty(msg) && func) {
            this.events[msg].forEach((item, index) => {
                if(item.event === func) {
                    this.events[msg].splice(index, 1)
                }
            })
        }
    }
}
```