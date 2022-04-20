---
title: lazyimage
date: 2019-08-11
sidebar: 'auto'
categories:
 - Happy
---

```html
<img class="lazy demo" data-src="https://coolcdn.igetcool.com/p/2020/7/35a74ca331619e28fd80c22cf06b7a5b.jpeg?_2200x732.jpeg" alt>
```
```js
function isView(ele) {
  const top = ele.getBoundingClientRect().top <= window.innerHeight ? true : false;
  const bottom = ele.getBoundingClientRect().bottom >= 0 ? true : false;
  const visable = getComputedStyle(ele).display !== 'none' ? true : false;
  return top && bottom && visable
}
function Lazyload() {
  let flag = null
  if(!flag) {
    flag = setTimeout(() => {
      flag = null
      let lazyImgs = [].slice.call(document.querySelectorAll('img.lazy'))
      lazyImgs.forEach(img => {
        if(isView(img)) {
          img.src = img.dataset.src
          img.classList.remove('lazy')
        }
      });
      if(!lazyImgs.length) {
        window.removeEventListener('scroll', Lazyload)
        window.removeEventListener("resize", Lazyload)
          window.removeEventListener("orientationchange", Lazyload)
      }
    }, 200)
  }
}
window.addEventListener('scroll', Lazyload)
document.addEventListener("resize", Lazyload);
document.addEventListener("orientationchange", Lazyload);
```