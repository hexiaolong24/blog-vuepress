var a = 10;
function func1() {
  console.log(a); // undefined
  // 主要局部作用域通过预解析变量提升，就不会影响全局作用域
  a = 5;
  console.log(window.a); // 10
  var a = 20;
  console.log(a); // 20
}
func1();
