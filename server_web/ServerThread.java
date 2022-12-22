import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.File;
import java.io.PrintWriter;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.zip.GZIPOutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;

class ServerThread extends Thread{


        public class CountingOutputStream extends OutputStream {
    
            OutputStream stream;
            int bytes = 0;
            
            public CountingOutputStream(OutputStream stream) {
                this.stream = stream;
            }
            
            public void close() throws IOException {
                stream.close();
            }
            public void flush() throws IOException {
                stream.flush();
            }
            public void write(byte[] b) throws IOException {
                stream.write(b);
                bytes += b.length;
            }
            public void write(byte[] b, int offset, int len) throws IOException {
                stream.write(b, offset, len);
                bytes += len;
            }
            public void write(int b) throws IOException {
                stream.write(b);
                bytes += 1;
            }
            public int getBytesWritten() {
                return bytes;
            }
    
    }

    Socket clientSocket=null;

    public ServerThread(Socket s){
        this.clientSocket=s;
    }

    public void run() {
        FileInputStream fis = null;
        try{
            PrintWriter socketWriter = new PrintWriter(clientSocket.getOutputStream(), true);
            BufferedReader socketReader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream(), "utf-8"));
            
            String linieDeStart = socketReader.readLine();
            if (linieDeStart == null) {
                clientSocket.close();
                System.out.println("S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.");
            }
            
            String numeResursaCeruta = linieDeStart.split(" ")[1];

            if (numeResursaCeruta.equals("/api/utilizatori")) {
                String msg = "Datele au fost trimise catre server.";

                System.out.println(msg);
                socketWriter.print("HTTP/1.1 200 Ok\r\n");
                socketWriter.print("Content-Length: " + msg.getBytes("UTF-8").length + "\r\n");
                socketWriter.print("Content-Type: text/plain; charset=utf-8\r\n");
                socketWriter.print("\r\n");
                socketWriter.print(msg);
                socketWriter.flush();

                int n=22;
                String line="";
                while(n>0)
                {
                    line = socketReader.readLine();
                    n-=1;
                }
                String[] payload = line.split("&");
                for(int i=0;i<payload.length;i++)
                {
                    String[] pair = payload[i].split("=");
                    String key = pair[0];

                    String value = "";

                    if(pair.length > 1)
                        value = pair[1];
                
                    System.out.println(key+" = "+value); 
                }

                FileInputStream json = new FileInputStream("../continut/resurse/utilizatori.json");
                byte[] buffer = new byte[10];
                StringBuilder sb = new StringBuilder();
                while (json.read(buffer) != -1) {
                    sb.append(new String(buffer));
                    buffer = new byte[10];
                }
                json.close();

                String content = sb.toString();
                System.out.println(content);

            }
            else
            {
                if (numeResursaCeruta.equals("/")) {
                    numeResursaCeruta = "/index.html";
                }

                String numeFisier =  "../continut" + numeResursaCeruta;

                File f = new File(numeFisier);
                if (f.exists()) {
                    String numeExtensie = numeFisier.substring(numeFisier.lastIndexOf(".") + 1);
                    String tipMedia;
                    switch(numeExtensie) {
                        case "html": tipMedia = "text/html; charset=utf-8"; break;
                        case "css": tipMedia = "text/css; charset=utf-8"; break;
                        case "js": tipMedia = "text/javascript; charset=utf-8"; break;
                        case "png": tipMedia = "image/png"; break;
                        case "jpg": tipMedia = "image/jpeg"; break;
                        case "jpeg": tipMedia = "image/jpeg"; break;
                        case "gif": tipMedia = "image/gif"; break;
                        case "ico": tipMedia = "image/x-icon"; break;

                        case "xml": tipMedia = " application/xml"; break;
                        case "json": tipMedia = " application/json"; break;

                        default: tipMedia = "text/plain; charset=utf-8";
                    }

                    /*
                    Path source = Paths.get(numeFisier);
                    Path target = Paths.get("../continut/output.gz");
                    GZIPOutputStream gos = new GZIPOutputStream(new FileOutputStream(target.toFile()));
                    FileInputStream fiso = new FileInputStream(source.toFile());

                    // compress file
                    byte[] buffer = new byte[1024];
                    int len;
                    while ((len = fiso.read(buffer)) > 0) {
                        gos.write(buffer, 0, len);
                    }
                    
                    f = new File("../continut/output.gz");
                    */



                    byte[] fileContent = Files.readAllBytes(f.toPath());

                    socketWriter.print("HTTP/1.1 200 OK\r\n");
                    socketWriter.print("Content-Length: " + f.length() + "\r\n");
                    socketWriter.print("Content-Type: " + tipMedia +"\r\n");
                    //socketWriter.print("Content-Encoding: gzip\r\n");
                    socketWriter.print("\r\n");
                    socketWriter.flush();

                    clientSocket.getOutputStream().write(fileContent, 0, fileContent.length);
                    clientSocket.getOutputStream().flush();
                    //fis.close();

                } else {
                    String msg = "Eroare! Resursa ceruta " + numeResursaCeruta + " nu a putut fi gasita!";

                    System.out.println(msg);
                    socketWriter.print("HTTP/1.1 404 Not Found\r\n");
                    socketWriter.print("Content-Length: " + msg.getBytes("UTF-8").length + "\r\n");
                    socketWriter.print("Content-Type: text/plain; charset=utf-8\r\n");
                    socketWriter.print("\r\n");
                    socketWriter.print(msg);
                    socketWriter.flush();
                }
                //Thread.sleep(2000);
                clientSocket.close();
                System.out.println("S-a terminat comunicarea cu clientul.");
            }

        }catch(IOException e){
            System.out.println("IO error in server thread");
        } finally {
            if (fis != null) {
                try {
                    fis.close();
                } catch(Exception e) {}
            }
            if (clientSocket != null) {
                try {
                    clientSocket.close();
                } catch(Exception e) {}
            }
        }
    }
}