package com.jaf.examples.jdk8.lambda;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.Test;

/**
 * 1、lambda 表达式传递方法引用 (::)
 * :: 操作符将方法名和对象或者类名分隔开来，以下三种是主要的使用情况
 * a) 对象::实例方法
 * b) 类::静态方法
 * c) 类::实例方法
 * 2、方法引用中使用 this/super 关键词
 * 3、lambda 表达式调用构造函数
 * 
 * @author liaozhicheng.cn@163.com
 * @date 2016年7月16日
 * @since 1.0
 */
public class LambdaTests2 {
	
	@Test
	public void orderStringWithLambda() {
		List<String> strs = Arrays.asList("hell", "world", "Hi");
		
		// String::compareToIgnoreCase 类::实例方法，属于第三种情况
		// 这个时候第一个参数会成为执行方法的对象，此示例中等同 (x, y) -> x.compareToIgnoreCase(y);
		Collections.sort(strs, String::compareToIgnoreCase);
		
		// System.out::println 对象::实例方法，属于第一种情况
		// 此时等价于 System.out.println(x);
		strs.forEach(System.out::println);
	}
	
	@Test
	public void thisWithLambda() {
		// this::equals 等同于 x -> this.equals(x);
		// 下面的示例演示使用 super::实例方法
	}
	
	class Greeter {
		public void greet() {
			System.out.println("hello world!");
		}
	}
	
	class ConcurrentGreeter extends Greeter {
		@Override
		public void greet() {
			// 当线程启动时，会调用它的 Runnable 方法，并调用父类的 greet 方法
			// 等价于 () -> super.greet()
			Thread t = new Thread(super::greet);
			t.start();
		}
	}
	
	/**
	 * 使用 lambda 调用构造函数
	 * Person::new 虽然这里没有指定参数，但是可以自动推导出调用的是 Person(String name) 构造方法
	 */
	@Test
	public void constructorWithLambda() {
		List<String> names = Arrays.asList("zhangsan", "lis", "wangwu");
		// 构造函数 Person::new
		Stream<Person> stream = names.stream().map(Person::new);
		List<Person> persons = stream.collect(Collectors.toList());
		persons.forEach(System.out::println);
	}
	
	
	class Person {
		
		String name;
		
		Person() {
		}
		
		Person(String name) {
			this.name = name;
		}
		
		@Override
		public String toString() {
			return "person : " + name;
		}
		
	}
	
	
}
