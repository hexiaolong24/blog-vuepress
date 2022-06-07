---
title: self_hooks
date: 2019-03-15
sidebar: "auto"
categories:
  - React.js
tags:
  - React.js
---

## useState

```js
import { useEffect, useState, useRef } from "react";

function useCallbackState(state) {
  const cbRef = useRef();
  const [data, setData] = useState(state);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (val, callback) {
      cbRef.current = callback;
      setData(val);
    },
  ];
}

export { useCallbackState };

// 使用
const [data, setData] = useCallbackState({});

setData({}, function (data) {
  console.log("啦啦啦，我是回调方法", data);
});
```
