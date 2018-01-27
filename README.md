# Object-oriented-module
大话西游记解说面向设计模式

# 基本模式
``` javascript
var people = new Object();
people.name = "悟空";
people.weapon = "金箍棒";
people.run = function() {
    return this.name + "的武器是" + this.weapon\<br>
};
console.log(people.name);
console.log(people.run());
```
## 缺点：
* 如果我需要设置多个对象是不是需要重新new Object()
* 如果有100个是不是需要new 100次？显然不是这样！

# 工厂模式
``` javascript
function creatPeople(name, weapon) {
    var people = new Object();
    people.name = name;>
    people.weapon = weapon;>
    people.run = function() {
        return this.name + "的武器是" + this.weapon\<br>
    };

    return people //返回对象
}
var bajie = creatPeople("八戒", "钉耙");
console.log(bajie.name);
console.log(bajie.run());
```
## 缺点:
* 创建对象没有使用new 关键字，对象和实例没有联系
* 造成资源浪费，每次穿创建对象那个多要增加重复的内容
* 即两个实例的地址是不同的 不同的对象会占用两个地址（堆）空间的内存


# 构造函数模式
``` javascript
var creatPeople2 = function(name, weapon) {
    this.name = name;
    this.weapon = weapon;
    this.run = function() {
        return this.name + "的武器是" + this.weapon
    }
}

var wujing = new creatPeople2("沙悟净", "禅杖");
var bailongma = new creatPeople2("白龙马", "剑");
console.log(wujing.name);
console.log(wujing.run());
console.log(wujing instanceof creatPeople2); //判断实例是不是构造函数创建

//假如我们创建两个对象传入相同的参数
var yudi = new creatPeople2("玉皇大帝", "很厉害");
var zhangyouren = new creatPeople2("玉皇大帝", "很厉害");
console.log(zhangyouren.run(), yudi.run()); //看起来一样哦！下面我们来看看是否相等？
console.log(yudi.run == zhangyouren.run); //呀！false 这里不相等 ，说明两个实例地址不同  
```
### call apply使用介绍
``` javascript
//创建一个新的对象那个
var baigujing = new Object();
var tieshangongzhu = new Object();
//console.log(obj.run());//报错 run is not function 因为我们没有给obj 定义run 方法 
//怎样让他有run方法了 ？ 对象冒充 就是我们让obj 去冒充成creatPeople2创建的对象 也及时借用creatPeople2 的this
//也可以说是将obj 的this 指向creatPeople2 的this

creatPeople2.call(baigujing, "白骨精", "爪子"); //这里call 将this指向creatPeople2的this
creatPeople2.apply(tieshangongzhu, ["铁扇公主", "铁扇"]); //这里apply 将this指向creatPeople2的this 传参方式不同上
console.log(baigujing.run());
console.log(tieshangongzhu.run());
```
## 缺点：
* 构造函数最明显的缺点就是，每个方法都要在每个实例上重新创建一遍。wujing.run和bailongma.run无法共享this
* 如何让实共享this呢？且看下面

# prototype(与构造函数组合) 模式
``` javascript
//陈塘关李家
var chentanguanlijia = function(name, weapon) {
    this.name = name;
    this.weapon = weapon;
}
chentanguanlijia.prototype = {
    zuxian: "李天王爸爸哪吒爷爷",
    run: function() {
        return "生的儿子都姓李"
    }
}
//创建个李天王和他儿子哪吒
var litianwang = new chentanguanlijia("托塔李天王", "宝塔");
var nezha = new chentanguanlijia("哪吒", "风火轮");
//查看一下litianwang（李天王）和nezha(哪吒)的的zuxian(祖先)属性
console.log(litianwang.zuxian);
console.log(nezha.zuxian);
//都是一样的的“李天王爸爸哪吒爷爷” 不行我们需要判断一下
console.log(litianwang.zuxian == nezha.zuxian); //true  哈哈他们共同用了zuxian这个属性 毕竟都是李家人嘛
console.log(litianwang.zuxian === nezha.zuxian); //true  哈哈他们共同用了zuxian这个属性 毕竟都是李家人嘛

//litianwang.zuxian===nezha.zuxian 相等说明构造函数在创建他们两个的时候没有重新创建实例，而是用了同一个，

// 我想知道是谁创建了李天王和他儿子怎么办?当然有办法 constructor
console.log(litianwang.constructor);
//看一看litianwang nezha是不是同一个构造函数创建的
console.log(litianwang.constructor == nezha.constructor); //true
```
## 缺点： 
* 在日常使用中已经是比较好的方法了，但是他的构造函数和原型是分开的看起来不好，不能体现封装性！

# 动态原型模式
``` javascript
//很简单就是把原型写在构造函数里面

//陈塘关李家2——动态原型模式
var chentanguanlijia_dtyx = function(name, weapon) {
    this.name = name;
    this.weapon = weapon;
    //这里把原型写在构造函数里面  
    //typeof chentanguanlijia2 != 'function' 意思是如果没有这个构造函数就创建
    //为甚要判断了？ 因为在new 对象的时候会执行构造函数，有n个new 就会执行n次构造,所以会重复创建 原型里面的方法
    //我们知道实例公用原型里的统一个方法所以我们在执行构造的时候只创建一次就可以了
    //所以我们判断typeof chentanguanlijia2 != 'function' 为true 说明没有就创建 为false 说明有了，就不在去创建
    if (typeof this.run != 'function') {
        chentanguanlijia_dtyx.prototype.run = function() {
            return "生的儿子都姓李——动态原型模式"
        }
        console.log("构造结束");//这里只会执行一次。不管new 多少次  这里证明
    }
}

var litianwang_dtyx = new chentanguanlijia_dtyx("托塔李天王——动态原型模式", "宝塔——动态原型模式");
var nezha_dtyx = new chentanguanlijia_dtyx("哪吒——动态原型模式", "风火轮——动态原型模式");
console.log(litianwang_dtyx.run());//生的儿子都姓李——动态原型模式
console.log(nezha_dtyx.run());//生的儿子都姓李——动态原型模式
```
# 原型链解析

我们已经知道面对向的设计模式，但是是否知道为什么能这样？
JavaScript 不是面向对象语言，为何能用面向对象方式？
其实这是根据JavaScript的原型继承来实现的！

``` javaScript
var creatPeople2 = function(name, weapon) {
    this.name = name;
    this.weapon = weapon;
}
creatPeople2.prototype.run = function() {
    return this.run + "的武器是" + this.weapon
}

var wujing = new creatPeople2("沙悟净", "禅杖");
var bailongma = new creatPeople2("白龙马", "剑");
console.log(bailongma.run());
console.log(wujing.run());
```
上面我们创建了一个creatPeople2构造函数</br>
它有两个实例 wujin bailongma  他们都有name weapon 属性 </br>
但是他们还有一个隐藏的属性 consttructor 我们可以测试一下！</br>

```jacvaScript
console.log(wujing.constructor); //[Function: creatPeople2]
console.log(bailongma.constructor); //[Function: creatPeople2]
```
看到了吧他们是存在的我们还发现上面两个实例的consturctor 实例的值都是[Function: creatPeople2]</br>
那么！ 实例（对象）的constuctor 都指向的两的构造函数 我们再来来测试一下！</br>
```javascript
console.log(wujing.constructor == bailongma.constructor);
```
## 哪然后了！！！
我们知道，函数对象（构造函数也是函数对象）都有都有一个protopyte 原型对象属性 ，creatPeople2.prototype就是原型对象
```javascript
console.log(creatPeople2.prototype); //creatPeople2 { run: [Function] }  看这就是
```
我们把属性或方法挂载到构造函数的prototype 上的时候，</br>
它的实例会共享这个属性或者方法，protopyte 原型对象属性 也是对象（划重点）</br>
对象都会有constructor 构造函数属性，我们试试</br>
```javascript
console.log(creatPeople2.prototype.constructor); //[Function: creatPeople2]
```
creatPeople2.prototype.constructor也是[Function: creatPeople2]</br>
所以我们得出结论 creatPeople2.prototype 的constructor指向prototype所在的构造函数</br>
也就是creatPeople2.prototype是creatPeople2的一个实例！！！</br>

```javascript
var wujing = new creatPeople2();
creatPeople2.prototype = wujing;
```
#### 那么wujing 里面的this creatPeople2.prototype 的this 这样就达到继承了 我们还是测试一下
```javascript
var creatPeople3 = function() {
    this.name = "唐僧";
    this.weapon = "袈裟";
}
creatPeople3.prototype.run = function() {
    console.log(this.name);
}
var tangseng = new creatPeople3()
tangseng.run() //唐僧
```
####__proto__(划重点)

JS 在创建对象（不论是普通对象还是函数对象）的时候，都有一个叫做__proto__ 的内置属性，用于指向创建它的构造函数的原型对象。就是如下
```javascript
tangseng.constructor == creatPeople3;
tangseng.__proto__ == creatPeople3.prototype;
creatPeople3.prototype.constructor == creatPeople3;
```
### 测试走一波
```javascript
console.log(tangseng.constructor == creatPeople3); //true
console.log(tangseng.__proto__ == creatPeople3.prototype); //true
console.log(creatPeople3.prototype.constructor == creatPeople3); //true
```
tangseng.constructor指向creatPeople3，tangseng.__proto__指向creatPeople3.prototype，</br>
creatPeople3.prototype.constructor指向creatPeople3 形成一个链条这就叫做原型链</br>
那么creatPeople3.prototype 原型对象的__proto__指向哪里了？</br>
### 测试走一波
```javascript
onsole.log(creatPeople3.prototype.__proto__); //{}
console.log(typeof creatPeople3.prototype.__proto__); //object

//creatPeople3.prototype.__proto__指向object，一切皆对象哈哈 object 继续
console.log(Object.prototype.constructor); //[Function: Object]
console.log(Object.__proto__); //Function;
console.log(Object.prototype.__proto__); //null 已经到顶层
```
### 梳理一下

tangseng.constructor指向creatPeople3，</br>
tangseng.__proto__指向creatPeople3.prototype(是creatPeople3实例就有constructor属性)，</br>
creatPeople3.prototype.constructor指向creatPeople3 ，creatPeople3.prototype.__proto__指向object ,</br>
Object.prototype.__proto__指向null</br>

### 继续梳理

```javascript
console.log("1");
console.log(tangseng.__proto__);//creatPeople3 { run: [Function] }创建它的构造函数的原型对象
console.log(tangseng.constructor );//[Function: creatPeople3]
console.log(creatPeople3.prototype.constructor);//[Function: creatPeople3]

console.log(creatPeople3.prototype.__proto__);//Object

console.log(Object.__proto__);//[Function]
console.log(Object.prototype.constructor);//[Function: Object]
console.log(Object.prototype.__proto__);//null

console.log(Function.__proto__);//[Function] 妈妈的妈妈生妈妈
console.log(Function.prototype.constructor);//[Function: Function]
console.log(Function.prototype.__proto__);//Object
```

