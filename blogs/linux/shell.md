## shell 概述

命令行解释器，接受用户命令，调用操作系统内核

## 指定解析器

```bash
#!/bin/sh
```

## 执行

- 使用子 shell
  - bash + 绝对路径、相对路径
  - sh + 绝对路径、相对路径
  - 直接输入绝对路径、相对路径（需要加可执行权限 x），如果是当前目录下不能直接输入文件名，需要加相对路径 ./xx.sh
- 在当前 shell 直接执行
  - source + 绝对路径、相对路径
  - . + 绝对路径、相对路径

## 变量

- 全局变量、局部变量
- 系统变量、用户变量

- 常用系统变量

  - $HOME 系统主目录
  - $PWD 当前工作目录
  - $SHELL 当前 shell 解释器
  - $USER 当前用户

- 定义变量 =前后不能有空格，如果是一句话（有符号）使用引号或者单引号
  a=1
- 导出变量，在子 shell 中也能访问到  
  export a
- 只读变量 不能 unset
  readonly b=1
- unset a 撤销变量 a

- 特殊变量
  - $0 脚本的名称（如果是输入的相对路径或者绝对路径，那$0 就是路径+文件名）
  - $1 $2 $3 ${10} ${11} 第 1 个参数
  - $# 当前参数的个数
  - $* 所有参数的整体 123 456 ,for 循环时（"$*"）打印出来是一个整体
  - $@ 所有参数的数组 [123, 456],但是打印出来也是 123 456 ,for 循环时（"$@"）是依次打印出来
  - $? 当前执行脚本的返回值 0 成功 xxx 未成功执行(1)

##  运算符
- expr 1 + 2  必须有空格，其实就是参数传递
- a=$(expr 1 + 2)  赋值操作
- echo $[1+2]
- echo $((1+2)) 

##  条件判断
- test 条件判断 
test $a = hello 
echo $? 返回上一命令执行结果
- [] 前后一定要有空格
[ $a = hello ]

- 常用比较 
  - -eq 等于 
  - -lt 小于
  - -gt 大于
  - -ne 不等于
  - -le 小于等于
  - -ge 大于等于
  - = != 字符串
  - -r  可读
  - -w  可写
  - -x  可执行 [ -x xx.sh ]
  - -e 文件是否存在
  - -f 是不是普通文件
  - -d 是不是一个目录

- 多条件判断
  - && 
  - ||
  - [ a ] && echo ok || echo not 三元运算符

##  流程控制
- if判断
```shell
if [ tioajian ];then
xx
fi
# 如果是（（））可以直接使用 <=
if(( $a <= 3 ))

if [ tioajian ]
then
xx
fi

if [ tiaojian ]
then
xx 
elif [ tiaojian ]
then 
xx
else
xx
fi

if [ tioajian ] && [ tiaojian ]; then
xx
fi

# -a and
# -o or
if [ tiaojian -a tiaojian ]; then
xx
fi 

if [ "$1"x = "aa"x ]
then
xx
fi
```

- case
case行尾必须有 in
每个模式以）结尾
;;单分支结束 相当于break
*）表示默认 相当于default 
```shell
case $bianlaing in
"值1")
xx
;;
"值1")
xx
;;
*)
xx
;;
esac
```

- for 循环
```shell
for (( i=1; i <= $1; i++ ))
do
  sum=$[$sum+$i]
done

for aa in linux windows macos; 
do
  xx
done

for i in {1..100};
do 
  sum=$[$sum + $i]
done
```

- while
```shell
a=1
while [ $a -le $1]
do
  #sum2=$[$sum2 + $a]
  #a=$[$a + 1]
  let sum2+=a
  let a++
done
```

##  read读取控制台输入
read (选项) (参数)
- 选项
  - -p 指定读取时的提示符
  - -t 指定读取时的等待时间 秒 ,如果不加表示一直等待
- 参数
  变量： 指定读取值的变量名
```shell
read -t 10 -p "请输入名字： " name
echo "hello, $name"
```




