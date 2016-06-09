package com.jaf.examples.concurrent.part3;

/**
 * TODO
 * 
 * @author liaozhicheng.cn@163.com
 * @since 1.0
 */
public class NoVisibilityTest {
	
	private static boolean ready;
	
	private static int number;
	
	private static class ReaderThread implements Runnable {
		
		@Override
		public void run() {
			while (!ready) {}
			System.out.println(number);
		}
	}
	
	
	public static void main(String[] args) throws Exception {
		// -server 模式下运行，该线程永远无法结束
		new Thread(new ReaderThread()).start();
		
		Thread.sleep(1000);
		
		System.out.println("begin set ...");
		number = 42;
		ready = true;
		
		Thread.sleep(1000);
	}
}
