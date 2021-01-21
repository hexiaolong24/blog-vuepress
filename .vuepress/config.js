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
        "text": "逝水流年",
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
            "text": "此心安处是吾乡",
            "link": "/docs/home/",
          },
          {
            "text": "愿我如星君如月",
            "link": "/docs/chaoliu/",
          },
          {
            "text": "夜夜流光相皎洁",
            "link": "/docs/offwhite/",
          },
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
        '',
        "职业荣誉",
      ],
      "/docs/kobe/shoes/": [
        '',
        "大师之路_上",
        "大师之路_下",
        "Fade to Black",
        "undefeated x kobe4"
      ],
      "/docs/home/": [
        '',
        ['2020-08-09', '2020-08-09']
      ],
      "/docs/offwhite/": [
        '',
        // 文件名, 标题
        ['reactEcharts', '乔二'],
        ['vueEcharts', '乔三'],
        ['年度报告', '乔四']
      ],
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
    'cyberSecurityRecord': '冀公网安备 13072602000042号',
    // 'cyberSecurityLink': '公安部备案指向链接',
    "startYear": "2020"
  },
  "markdown": {
    "lineNumbers": true
  }
}