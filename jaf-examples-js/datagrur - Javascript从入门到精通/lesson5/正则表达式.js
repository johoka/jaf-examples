/*
 正则表达式是一门简单语言的语法规范，它应用在一些方法中，对字符串的信息实现查找、替换和提取操作
 
 用过正则表达式，相信多数人，学了一遍又一遍，看到它也会是一脸懵圈
 正则表达式不仅难以阅读，而且修改时充满了危险，到处是陷阱
 
 只有对正则表达式的整个复杂性有相当透彻的理解，才有可能正确的阅读它
*/

//先来一个例子，这个例子来匹配URL

var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;

var url = 'http://www.dataguru.com:80/lession?q#fragment';

var result = parse_url.exec(url);//["http://www.dataguru.com:80/lession?q#fragment", "http", "//", "www.dataguru.com", "80", "lession", "q", "fragment"]

//
//前面说过，javascript集合所有数据都是对象，正则表达式也是一个对象，所以它可以拥有方法
//exec方法如果成功匹配regexp和字符串string，会返回一个数组，数组中下标为0的将包含正则表达式regexp匹配的子字符串
//下标1的元素是分组1捕获的文本，下标2是分组2捕获的文本，以此类推。捕获失败返回nul
//像上面的exec，如果能够成功匹配传给正则表达是的字符串，则返回一个数组，这个数组包含了从这个url中提取出来的片段

//看到这个开头，简直要晕了，这么复杂的表达式，怎么破？现在我们一个个来分解上面这个例子

//首先，我们使用/../定义一个正则表达式
//正则表达式字面量
/regexp choice/[|g|i|m]
//比如
var reg = /a/; //这样就定义了一个正则表达式
var reg1=/a/g;
var reg2=/a/i; //A 或者a
var reg3=/a/m;

//g,i,m是三个标识，字面量的末尾，可以不要，也可以单独，也可以混合使用
/*
  g: 表示全局的,global,匹配多次；但不同的方法对g标识的处理各不相同
  i : 表示大小写不敏感（忽略字符大小写）
  m :多行（^和$能匹配行结束符）
*/

//另外一种，构建正则表达式的方式是使用RegExp构造器

var my_regexp = new RegExp("\"a\"",'g');//如果使用反斜杠，引号等则需要转义

/*

  RegExp对象有如下属性
  
*/
my_regexp.global; //如果设置了g则为true
my_regexp.ignoreCase;//如果设置了i，则为true
my_regexp.lastIndex;//下一次exec匹配开始的索引，初始值为0
my_regexp.multiline ;//如果设置了m,则为true
my_regexp.source; //正则表达式源码文本

//继续看上面的例子
var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
/*
  ^表示字符串的开始，它是一个锚，指引exec不要跳过那些不像URL的前缀
  只匹配那些开头像URL一样的字符串，表示匹配以xxx开始的字符串
  上面这个例子呢，表示开始跟下面这个因子相匹配的字符串
*/
(?:([A-Za-z]+):)?
/*
  这个因子匹配一个协议名，但仅当它后面跟着一个冒号才会匹配
  
 (?:) 表示一个非捕获型分组，非捕获分组只做简单的匹配，并不会捕获所匹配的文本
 后缀?表示这个分组是可选的，表示重复0次或者1次
 (...)表示一个捕获型分组，任何匹配这个分组的的字符都会被捕获，每个捕获型分组都被指定一个数字。
  在正则表达式中第一个捕获 (的是分组1，第二个捕获(的是分组2，以此类推。这个例子中，被匹配到的会放到result数组里
  
  [...]表示一个字符类，A-Za-z这个字符类包含26个大写字母和26个小写字母，-连字符表示范围从A到Z
   后缀+表示这个字符类会被匹配一次或多次
   
   分组后面跟着:，会按这个字面进行匹配
*/
var reg1 = /(([A-Za-z]+):)?/; 
var reg2 = /(?:([A-Za-z]+):)?/;
reg1.exec('http:xxx:'); //["http:", "http:", "http"]
reg2.exec('http:xxx:'); //["http:", "http"]

var reg3 = /(?:([A-Za-z]+):)+/;
reg3.exec('http:xxx:');//结果是什么呢？

var reg4 = /^(?:([A-Za-z]+):)?/;
reg4.exec('http:xxx:');//结果是什么呢？

//parse_url接下来跟着
(\/{0,3})
//现在这是个捕获型分组，在这个例子里是捕获型分组2
/*
   \/表示匹配斜杠/，用\进行转义，这样就不会被误解为这个正则表达式的结束符
   后缀{0,3}表示/或被匹配0次或者1-3次
*/
var reg5 = /(\/{0,3})/;
reg5.exec('////ss');

//接下来一个分组，大家应该看得懂了把
([0-9.\-A-Za-z]+)
//匹配一个或多个数字、字母以及.或-组成的字符，注意-被转义，防止与表示范围的连字符相混淆

//接下来一个分组
(?::(\d+))?
//这是一个可选的分组，匹配有一个冒号和一个或多个数字组成的序列，\d表示一个数字字符
var reg6 = /(?::(\d+))?/;
reg6.exec(':23');

var reg7 = /(?::([0-9]+))?/;
reg7.exec(':23');

//reg6和reg7是否一样?

//接下来这个因子，匹配一个以/开始，之后的字符类[^?#]以一个^开始，表示这个类包含除?和#之外的所有字符。*表示这个字符类或被匹配0次或多次
(?:\/([^?#]*))?

//以下这个因子，仿照上面的解释，大家应该可以直到怎么回事了吧，注意这里是的?是被\转义了的
(?:\?([^#]*))?

//最后一个因子，以#开始,(.*)其中.会匹配除行结束符以外的所有字符
(?:#(.*))?

var reg8 = /(?:#(.*))?/;
reg8.exec('#tt');
reg8.exec('#\n');
//最后的$表示字符串的结束，保证这个URL的尾部不会有其它更多的内容

//接下来我们再来看一个例子
var parse_n = /^\-?(\d)+(?:\.\d+)?(?:e[+\-]?\d+)?$/i;

//能看出来这个正则表达式是干嘛的吗？可以按照上面的分析逐个因子去分析
var test = function(num){
	console.log(parse_n.test(num));
};
test('-23e2');
test('12.3.3.3');

/*
   这其实是一个判断数字的正则表达式
  使用^和$来框定正则表达式，表示这个表达式对文本中所有字符都进行匹配。
  如果省略这两个标识，那么只要一个字符串包含一个数字，这个表达式就能进行匹配
  有了这个标识，只有当一个字符串的内容仅为一个数字，它才会告诉我们
*/


/*
 通过上面例子的解析，大家应该对正在表达式有了一个初步的了解，最起码应该能够看懂或者写出一些简单的正则表达式
 
 接下来，我们进一步来了解下构成正则表达式的元素
 
*/

//正则表达式分支
//一个正则表达式分支包含一个或多个正则表达式序列，这些序列被|字符分隔
//如果这些序列的任何一项符合匹配条件，那么这个选择就会被匹配。它尝试者按顺序依次匹配这些序列项
var reg9 = /in|int/;
'into'.match(reg9);
//如果前面一项匹配成功了，后面一项不会再去匹配
var parse_n = /^\-?(\d)+(?:\.\d+)?(?:(?:e|E)[+\-]?\d+)?$/;

//正则表达式序列
/*
  一个正则表达式序列包含一个或多个正则表达式因子，每个因子能选择是否跟随一个量词
  这个量词决定着这个因子被允许出现的次数，如果没有指定这个量词，该因子只会被匹配一次
  
*/

//正则表达式因子
/*
 一个正则表达式因子可以是一个字符，一个由圆括号包围的组，一个字符类，或者是一个转义序列
 除了控制字符和特殊字符以外，所有的字符都会被按照字面处理
 
*/
\ / [ ] () {} ? + * | . ^ $

//上面这些字符，如果希望按照字面去处理，则必须使用一个\前缀来进行转义
//注意\前缀不能使字母或数字字面化
//未被转义的.会匹配除行结束符以外任何字符

//正则表达式转义
//反斜杠在正则表达式因子中与在字符串中一样均表示转义，但在这里，略有不同
/*
   \f 换页符
   \n 换行符
   \r 回车
   \t 制表符
   \b 不是退格符  \b 被指定一个字边界，方便用于对文本字边界进行匹配
   \d 表示数字，等同于[0-9] \D表示相反 [^0-9]
   \s  等同于[\f\n\r\t\u000B\u0020\u00A0\u2028\u2029] 这是Unicode空白符的一个不完全子集。\S 则表示与其相反：[^\f\n\r\t\u000B\u0020\u00A0\u2028\u2029]
   \w [0-9A-Z_a-z]  \W相反 [^0-9A-Z_a-z]
    [A-Za-z\u00C0-\u1FFF\u2800-\uFFFD],包括了所有的Unicode字母，但也包括成千上万非字母的字符
  
   \1 是指向分组1所捕获到的文本的一个引用，所以能再次被匹配，\2指向分组2的引用，,\3以此类推
   
   
*/

var reg10 = /([A-Za-z\u00C0-\u1FFF\u2800-\uFFFD]+)\s+\1/g;
'helo helo'.match(reg10);
reg10.exec('helo helo');

var reg11 = /([A-Za-z\u00C0-\u1FFF\u2800-\uFFFD]+)\s+/g;
'helo helo'.match(reg11);
reg11.exec('helo helo');


/*
  正则表达式分组，分组有四种
  捕获型,非捕获型
  向前正向匹配：这个分组有一个(?= 前缀，它类似于非捕获型分组，但在这个组匹配后文本会倒回到它开始的地方
  实际上并不匹配任何东西。
  
  向前负向匹配：这个分组有一个(?!前缀，类似于向前正向匹配，但只有匹配失败时它才继续向前进行匹配

*/
var reg12 = /<(?=br>\b)/  ;
'<div>ddd </div> <br>d '.match(reg12);

var reg = /\b[\w]+(?=ing\b)/g;
var con = "coming soon,going gogogo";
con.match(reg);

/*
 正则表达式量词
 正则表达式量词因子可以用一个正则表达式量词后缀来决定这个因子应该被匹配的次数。
 包围在一对花括号中的一个数字表示这个因子应该被匹配的次数。
 {3,6}会匹配3、4、5或6次，{3,}会匹配3次或更多次
 
 ?等同于{0,1} *等同于{0,},+等同于{1,}
 
 如果只有一个量词，表示趋向于进行贪婪性匹配，即匹配尽可能多的副本直至达到上限。
 如果这个量词附加一个后缀?则表示趋向于进行非贪婪匹配，即只匹配必要的副本就好
 
*/


/*
  正则表达式的方法
  regexp.exec(string)
  exec方法如果成功匹配regexp和字符串string，会返回一个数组，数组中下标为0的将包含正则表达式regexp匹配的子字符串
  下标1的元素是分组1捕获的文本，下标2是分组2捕获的文本，以此类推。捕获失败返回null
  regexp.test(string)
  如果regexp匹配string,返回true，否则返回false。不要对这个方法使用g标识
  
*/