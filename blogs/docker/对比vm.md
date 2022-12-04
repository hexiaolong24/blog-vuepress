---
title: 对比vm
date: 2018-08-18
sidebar: 'auto'
categories:
  - docker
tags:
  - docker
---

- docker

  - 操作系统 于宿主机共享 OS
  - 存储大小 镜像小，便于存储和传输
  - 运行性能 几乎无额外性能损失
  - 移植性 轻便 灵活 适应于 Linux
  - 硬件亲和性 面向开发者
  - 部署速度 秒级

- VM
  - 操作系统 宿主机 OS 上运行虚拟机 OS
  - 存储大小 镜像庞大（vmdk vdi）
  - 运行性能 操作系统额外的 CPU 内存消耗
  - 移植性 笨重 与虚拟化技术耦合度高
  - 硬件亲和性 面向运维
  - 部署速度 较慢
