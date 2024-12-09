## 使用 URLSearchParams

```js
const url = new URL("https://example.com/page?name=John&age=30");
const params = new URLSearchParams(url.search);
// 获取参数
const name = params.get("name"); // 'John'
const age = params.get("age"); // '30'
// 获取所有参数的键值对
for (const [key, value] of params.entries()) {
  console.log(`${key}: ${value}`);
}
// 如果当前页面的 URL 直接是需要的地址
const currentParams = new URLSearchParams(window.location.search);
```

## 使用正则表达式解析查询参数

```js
function getQueryParam(url, key) {
  const regex = new RegExp(`[?&]${key}=([^&#]*)`, "i");
  const match = url.match(regex);
  return match ? decodeURIComponent(match[1]) : null;
}
const url = "https://example.com/page?name=John&age=30";
console.log(getQueryParam(url, "name")); // 'John'
console.log(getQueryParam(url, "age")); // '30'
```

## 通过 window.location 手动解析

```js
function parseQueryString() {
  const query = window.location.search.substring(1);
  const pairs = query.split("&");
  const params = {};
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  });

  return params;
}

const params = parseQueryString();
console.log(params.name); // 获取name参数
console.log(params.age); // 获取age参数
```
