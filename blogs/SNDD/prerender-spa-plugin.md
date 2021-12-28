---
title: 预渲染
date: 2021-11-18
sidebar: 'auto'
categories:
 - SNDD
isShowComments: false
keys:
 - '1360d01f3f0d562dc30b433a62443dcd'
---

##  prerender-spa-plugin
```js
// prerender.js
// 引入prerender-spa-plugin
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const { PuppeteerRenderer: Renderer } = PrerenderSPAPlugin;
// 同步读取文件
const { readFileSync } = require('fs');
const glob = require('glob');
const { resolvePath } = require('./utils');

/**
 * 预渲染插件后续处理
 * 静态资源替换为cdn
 * https://jps04.cdnpalfish.com/international-activity/
 */

class HtmlFixPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    const compilerFS = compiler.outputFileSystem;

    compiler.hooks.done.tapAsync('HtmlFixPlugin', (compilation, done) => {
      glob.sync(resolvePath('build/**/*.{html,js}')).forEach(path => {
        const content = readFileSync(path).toString();
        let fixContent = content.replace(
          /http:\/\/localhost:8006\//g,
          'https://jps04.cdnpalfish.com/international-activity/',
        );

        // 1v1-7-th 测试静态资源放nginx
        // if (path.split('/').slice(-2, -1)[0] === '1v1-7-th') {
        //   fixContent = fixContent.replace(/https:\/\/jps04\.cdnpalfish\.com\/international-activity\//g, '../');
        // }

        compilerFS.writeFile(path, fixContent, err => err && console.log(`[html-fix-plugin] ${path}\n ${err}`));
      });
      done();
    });
  }
}

// 预渲染任务
module.exports = function (config, preRenderPages = []) {
  /**
   * preRenderPages: 需要预渲染的页面
      [
        {
          name: 'singaporemath',
          lang: ['zh-cn'],
        },
      ]
   */

  const prerenderPlugins = preRenderPages.map(
    ({ name, lang }) =>
      new PrerenderSPAPlugin({
        // 必填 不写报错
        indexPath: resolvePath(`build/${name}/index.html`),
        // 必填 指定输出根目录下的文件夹名字，这个只能有一级目录，如果不是一级，不会有任何报错信息，只有卡着不动
        staticDir: resolvePath('build'),
        // 可选 默认值
        outputDir: resolvePath(`build/${name}/`),
        // 必填 ['/zh-cn.html?lang=zh-cn', '/en.html?lang=en']
        routes: lang.map(_lang => `/${_lang}.html?lang=${_lang}`),
        postProcess(ctx) {
          // 修改输出路径
          if (ctx.route.endsWith('.html')) {
            ctx.outputPath = resolvePath(`build/${name}/${ctx.route}`);
          }

          // 优化编译结果
          ctx.html = ctx.html.replace('</noscript><div', '</noscript><div id="app"').replace(/<!---->/g, '');

          // css内联到html
          ctx.html = ctx.html.replace(new RegExp(`<link[^>]+(${name}[^"]+|page-style[^"]+)[^>]+>`, 'g'), (_, find) => {
            const css = readFileSync(resolvePath(`build/static/css/${find}`))
              .toString()
              .replace(/url\(\.\.\/\.\.\/static\//g, 'url(https://jps04.cdnpalfish.com/international-activity/static/');
            return ['<style>', css, '</style>'].join('');
          });

          // 移除预渲染已执行资源
          ctx.html = ctx.html.replace(/<script[^>]+page-style[^>]+><\/script>/, '');

          // CDN-CSS放到底部
          const styles = ctx.html.match(/<link[^>]+\.css[^>]*>/g) || [];
          styles.forEach(st => {
            ctx.html = ctx.html.replace(st, '');
            ctx.html = ctx.html.replace('</div><script', `</div>${st}<script`);
          });

          return ctx;
        },
        renderer: new Renderer({
          injectProperty: '__BSS_PRERENDER__',
          inject: { isPrerender: true },
          renderAfterDocumentEvent: 'render-event',
        }),
        server: { port: 8006 },
      }),
  );

  config.plugins.push(...prerenderPlugins);

  // 替换静态资源地址
  config.plugins.push(new HtmlFixPlugin());
};
```