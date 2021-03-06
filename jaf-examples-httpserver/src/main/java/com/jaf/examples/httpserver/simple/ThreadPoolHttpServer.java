package com.jaf.examples.httpserver.simple;

import static com.jaf.examples.httpserver.common.Constants.REQUEST_HEAD_FIRST_LINE_PATTERN;
import static com.jaf.examples.httpserver.common.Constants.SERVER_PORT;
import static com.jaf.examples.httpserver.common.Constants.SPLIT;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.jaf.examples.httpserver.Request;
import com.jaf.examples.httpserver.Response;

/**
 * 基于线程池的实现
 * 
 * @author liaozhicheng.cn@163.com
 * @date 2016年10月23日
 * @since 1.0
 */
public class ThreadPoolHttpServer extends SimpleHttpServer {

	@Override
	public void start() throws IOException {
		ExecutorService executorService = Executors.newFixedThreadPool(10);
		
		ServerSocket serverSocket = null;
		try {
			serverSocket = new ServerSocket(SERVER_PORT);
			while(true) {
				Socket socket = serverSocket.accept();
				System.out.println("******* open  " + socket.toString() + " connected. *******");
				
				try (LineNumberReader reader = new LineNumberReader(new InputStreamReader(socket.getInputStream()))) {
					String lineInput;
					StringBuilder requestStr = null;
					while((lineInput = reader.readLine()) != null) {
						System.out.println(lineInput);
						if(lineInput.matches(REQUEST_HEAD_FIRST_LINE_PATTERN)) {
							requestStr = new StringBuilder();
						}
						requestStr.append(lineInput).append(SPLIT);
						
						if(lineInput.isEmpty()) {
							ServiceTask task = new ServiceTask(requestStr.toString(), socket.getOutputStream());
							executorService.execute(task);
						}
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				serverSocket.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	private class ServiceTask implements Runnable {
		
		private final String requestStr;
		private final OutputStream writer;
		
		ServiceTask(String requestStr, OutputStream writer) {
			this.requestStr = requestStr;
			this.writer = writer;
		}

		@Override
		public void run() {
			try {
				Request request = new SimpleRequest(requestStr);
				Response response = doService(request);
				doWrite(writer, response.getResponseBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
	}
	
}
