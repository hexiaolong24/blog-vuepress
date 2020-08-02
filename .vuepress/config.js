module.exports = {
  "title": "8_KOBE_24",
  "description": "愿你走出半生 归来仍是少年",
  "dest": "public",
  // "base": "/kobe/",
  "head": [
    // 网页标识
    [
      "link",
      {
        "rel": "icon",
        "href": "/logo.jpeg"
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
  "theme": "reco",
  "themeConfig": {
    // valine评论
    valineConfig: {
      appId: 'NvNLcDsFp4OekaohkeVwbIbm-gzGzoHsz',
      appKey: 'puFhsoRl62xe8dRVGTTx5Wlt',
      showComment: false,
      placeholder: '雁过留痕，大佬来唠两块钱的啊~'
    },
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
            "text": "Kobe Bryant",
            "link": "/docs/kobe/",
            "items": [
              {
                "text": "辉煌生涯",
                "link": "/docs/kobe/record/"
              },
              {
                "text": "球鞋",
                "link": "/docs/kobe/shoes/"
              }
            ]
          },
          {
            "text": "2020的幸福生活",
            "link": "/docs/2020life/",
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
    "sidebar": {
      "/docs/kobe/record/": [
        ['生涯记录', '生涯记录'],
        "职业荣誉",
      ],
      "/docs/kobe/shoes/": [
        '',
        "大师之路",
        "Fade to Black",
        "undefeated x kobe4"
      ]
    },
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
    "logo": "https://coolcdn.igetcool.com/p/2020/7/4702368ebda7baa5239e6fd8ad0fb3e3.jpeg?_690x690.jpeg",
    "search": true,
    "searchMaxSuggestions": 10,
    "lastUpdated": "Last Updated",
    "author": "hexiaolong",
    "authorAvatar": "https://coolcdn.igetcool.com/p/2020/7/706f0ce8fd421471429b7a5a0d66e3f5.png?_294x270.png",
    // 备案信息
    "record": "冀ICP备20017673号",
    'recordLink': 'http://beian.miit.gov.cn',
    // 'cyberSecurityRecord': '公安备20017673号',
    // 'cyberSecurityLink': '公安部备案指向链接',
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  }
}