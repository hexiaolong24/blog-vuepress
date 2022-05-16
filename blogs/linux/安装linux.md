---
title: 安装linux
date: 2020-10-15
sidebar: 'auto'
categories:
 - linux
---

##  下载VMware Fusion

##  下载CentOS7镜像文件
- 阿里 http://mirrors.aliyun.com/centos/
- centos/7/isos/x86_64/...DVD-2009.iso

##  打开VMware 新建导入刚刚下载的镜像文件
- 一直下一步 设置root

##  配置ip
- 先查看本机VMware Fusion的网关地址（在本机终端中，不是在虚拟机）
```
cat /Library/Preferences/VMware\ Fusion/vmnet8/nat.conf

// ip=172.16.164.2
// netmask=255.255.255.0
```
- vi打开虚机的/etc/sysconfig/network-scripts/ifcfg-ens33
```
#BOOTPROTO=dhcp
BOOTPROTO=static
#ONBOOT=no
ONBOOT=yes
```
- 设置一个和nat网关同网段的ip地址作为本机的IP，加上掩码和网关、DNS的地址
```
IPADDR=172.16.164.10 与本机ip同网段
NETMASK=255.255.255.0
GATEWAY=172.16.164.2
DNS1=172.16.164.2 配置其他也可以 比如阿里等等
```
- 保存重启network
```
systemctl restart network
```
- ping 测试一下

##  网络连接
- 桥接模式
  - 相当于和本机一样，本机桥接与路由器链接，外网可见
- NAT模式
  - 虚拟机和主机构建一个专用网络，并通过虚拟网络地址转化NAT设备对IP进行转换，虚拟机通过共享主机ip访问外部网络， 外网不可见


##  目录结构
- bin 二进制命令,链接到 usr/bin
- sbin 系统管理员命令 usr/sbin
- lib 系统动态链接库文件 usr/lib
- lib64
- usr 用户所有文件程序
- boot 引导启用的一些文件，单独分区
- dev 设备目录
- etc 系统管理所需的配置文件
- home 每个用户都有一个主目录（普通用户）
- root root用户的主文件夹
- opt 可选目录，第三方软件包的预留文件
- media 媒体目录
- mnt 和media差不多，移动存储的挂载点
- proc 进程信息
- run 运行起来的信息存储目录
- srv 系统服务相关
- sys 系统硬件相关的
- tmp 临时存放
- var 经常变化的，比如logs 

##  hostname
1.  etc/hostname 修改
2.  hostnamectl 查看hostname相关信息
3.  hostnamectl set-hostname newname 修改hostname

##  配置hosts
/etc/hosts

##  远程登录
- ssh root@(hostname|ip) 
- 密码 hxl9822
- exit 登出

