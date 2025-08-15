---
title: audio
date: 2020-10-09
sidebar: 'auto'
categories:
 - 常见坑
tags:
 - 常见坑 audio
---


```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>音频测试页面</title>
    <style>
        .audio-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .audio-title {
            margin-bottom: 20px;
            color: #333;
        }
        .custom-audio {
            width: 100%;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="audio-container">
        <h1 class="audio-title">音频测试</h1>
        
        <!-- 使用HTML5原生audio标签 -->
        <audio class="custom-audio" controls>
            <source src="./0421.aac" type="audio/aac">
            您的浏览器不支持 audio 元素。
        </audio>
         <!-- 添加错误信息显示区域 -->
         <div id="errorMessage" style="color: red; margin-top: 10px;"></div>

</body>
<script>
    const audio = document.querySelector('audio');
    const errorMessage = document.getElementById('errorMessage');

    // 错误处理函数
    audio.addEventListener('error', function(e) {
        const error = e.target.error;
        switch (error.code) {
            // 1
            case MediaError.MEDIA_ERR_ABORTED:
                errorMessage.textContent = '播放被中止';
                break;
            // 2
            case MediaError.MEDIA_ERR_NETWORK:
                errorMessage.textContent = '网络错误导致音频下载失败';
                break;
            // 3
            case MediaError.MEDIA_ERR_DECODE:
                errorMessage.textContent = '音频解码失败';
                break;
            // 4
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMessage.textContent = '不支持的音频格式或音频地址无效';
                break;
            default:
                errorMessage.textContent = '发生未知错误';
                break;
        }
        console.error('音频错误:', error);
    });
// 其他音频事件处理
        audio.addEventListener('loadstart', () => {
            console.log('开始加载音频');
        });

        audio.addEventListener('canplay', () => {
            console.log('可以开始播放');
            errorMessage.textContent = '';  // 清除错误信息
        });

        audio.addEventListener('ended', () => {
            console.log('播放结束');
        });

        audio.addEventListener('stalled', () => {
            errorMessage.textContent = '音频数据加载停滞';
        });

        audio.addEventListener('waiting', () => {
            errorMessage.textContent = '等待数据缓冲中...';
        });
    </script>
</html>
```