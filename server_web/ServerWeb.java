import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.io.File;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class ServerWeb {
	public static void main(String[] args) throws IOException {
		System.out.println("#########################################################################");
		System.out.println("Serverul asculta potentiali clienti.");
		ServerSocket serverSocket = new ServerSocket(5678);
		FileInputStream fis = null;
		Socket clientSocket = null;
		while(true) {
			try {
				fis = null;
				clientSocket = serverSocket.accept();
                System.out.println("S-a conectat un client." + clientSocket.toString());
                ServerThread st=new ServerThread(clientSocket);
                st.start();
			} catch(Exception e) {
				e.printStackTrace();
            }
		}
		//serverSocket.close();
	}
}