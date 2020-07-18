module.exports = {
  "title": "8_KOBE_24",
  "description": "愿你走出半生 归来仍是少年",
  "dest": "public",
  "head": [
    // 网页标识
    [
      "link",
      {
        "rel": "icon",
        "href": "/blog/logo.jpeg"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "base": "/blog/",
  "theme": "reco",
  "themeConfig": {
    "huawei": "true",
    "nav": [
      {
        "text": "KOBE",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时间轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "解忧杂货铺",
        "icon": "reco-coding",
        "items": [
          {
            "text": "vuepress-reco",
            "link": "/docs/theme-reco/"
          }
        ]
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/hexiaolong24",
            "icon": "reco-github"
          }
        ]
      }
    ],
    // 侧边栏
    // "sidebar": {
    //   "/docs/theme-reco/": [
    //     "",
    //     "theme",
    //     "plugin",
    //     "api"
    //   ]
    // },
    "type": "blog",
    "blogConfig": {
    // 分类
      "category": {
        "location": 2,
        "text": "前端总结"
      },
    // 标签
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    // 友情链接
    "friendLink": [
      {
        "title": "午后南杂",
        "desc": "Enjoy when you can, and endure when you must.",
        "email": "1156743527@qq.com",
        "link": "https://www.recoluan.com"
      },
      {
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      }
    ],
    // 左侧头像
    "logo": "/logo.jpeg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "hexiaolong",
    "authorAvatar": "/hxl.png",
    // 备案信息
    // "record": "xxxx",
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  }
}