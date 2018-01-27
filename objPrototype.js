/**
 *原型链
 */

/*我们已经知道面对向的设计模式，但是是否知道为什么能这样？
JavaScript 不是面向对象语言，为何能用面向对象方式？
其实这是根据JavaScript的原型继承来实现的！
*/
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

//上面我们创建了一个creatPeople2构造函数
//它有两个实例 wujin bailongma  他们都有name weapon 属性 
// 但是他们还有一个隐藏的属性 consttructor 我们可以测试一下！
console.log(wujing.constructor); //[Function: creatPeople2]
console.log(bailongma.constructor); //[Function: creatPeople2]
//看到了吧他们是存在的我们还发现上面两个实例的consturctor 熟悉的值都是[Function: creatPeople2]
//那么！ 实例（对象）的constuctor 都指向的两的构造函数 我们再来来测试一下！
console.log(wujing.constructor == bailongma.constructor); //true

//哪然后了！！！
/*
我们知道，函数对象（构造函数也是函数对象）都有都有一个protopyte 原型对象属性 ，creatPeople2.prototype就是原型对象
*/
console.log(creatPeople2.prototype); //creatPeople2 { run: [Function] }  看这就是
/*
我们把属性或方法挂载到
构造函数的prototype 上的时候，它的实例会共享这个属性或者方法，protopyte 原型对象属性 也是对象（划重点）
对象都会有constructor 构造函数属性，我们试试
*/




console.log(creatPeople2.prototype.constructor); //[Function: creatPeople2]
//creatPeople2.prototype.constructor也是[Function: creatPeople2]
//所以我们得出结论 creatPeople2.prototype 的constructor指向prototype所在的构造函数
//也就是creatPeople2.prototype是creatPeople2的一个实例！！！

var wujing = new creatPeople2();
creatPeople2.prototype = wujing;

//那么wujing 里面的this creatPeople2.prototype 的this 这样就达到继承了 我们还是测试一下
var creatPeople3 = function() {
    this.name = "唐僧";
    this.weapon = "袈裟";
}
creatPeople3.prototype.run = function() {
    console.log(this.name);
}
var tangseng = new creatPeople3()
tangseng.run() //唐僧

//__proto__(划重点)
//JS 在创建对象（不论是普通对象还是函数对象）的时候，
//都有一个叫做__proto__ 的内置属性，用于指向创建它的构造函数的原型对象。就是

tangseng.constructor == creatPeople3;

tangseng.__proto__ == creatPeople3.prototype;

creatPeople3.prototype.constructor == creatPeople3;

//测试走一波
console.log(tangseng.constructor == creatPeople3); //true

console.log(tangseng.__proto__ == creatPeople3.prototype); //true

console.log(creatPeople3.prototype.constructor == creatPeople3); //true

//tangseng.constructor指向creatPeople3，tangseng.__proto__指向creatPeople3.prototype，
//creatPeople3.prototype.constructor指向creatPeople3 形成一个链条这就叫做原型链
//那么creatPeople3.prototype 原型对象的__proto__指向哪里了？测试走一波
console.log(creatPeople3.prototype.__proto__); //{}
console.log(typeof creatPeople3.prototype.__proto__); //object

//creatPeople3.prototype.__proto__指向object，一切皆对象哈哈 object 继续
console.log(Object.prototype.constructor); //[Function: Object]
console.log(Object.__proto__); //Function
console.log(Object.prototype.__proto__); //null 已经到顶层
//梳理一下

//tangseng.constructor指向creatPeople3，
//tangseng.__proto__指向creatPeople3.prototype(是creatPeople3实例就有constructor属性)，
//creatPeople3.prototype.constructor指向creatPeople3 ，
//creatPeople3.prototype.__proto__指向object ,
//Object.prototype.__proto__指向null

//继续梳理
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
