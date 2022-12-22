import os
import socket
import threading
import gzip
import json


def communication_thread(clientSocket,address):
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientSocket.recv(4096)
        if not data: 
            break 


        cerere = cerere + data.decode()
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1 and linieDeStart == ''):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
            break
    print('S-a terminat cititrea.')

    if linieDeStart == '':
        clientSocket.close()
        print ('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
        return


    linieDeStart = linieDeStart.split()
    metoda=linieDeStart[0]

    if metoda=='GET':
        resursaCeruta = linieDeStart[1]
        if resursaCeruta == '/' or resursaCeruta=='':
            resursaCeruta = '/index.html'

        caleFisier = '../continut' + resursaCeruta
        fisier = None

        # trimite raspuns pt fiecare tip de fisier
        tipResursa = resursaCeruta[resursaCeruta.rfind('.') + 1:]

        try:

            status = b"HTTP/1.1 200 OK\r\n"
            contentLength = str(os.stat(caleFisier).st_size).encode()

            fisier = open(caleFisier, 'rb')
            mesaj=fisier.read()

            mesaj=gzip.compress(mesaj)
            contentLength=str(len(mesaj)).encode()

            if (tipResursa == 'html'):
                contentType = b"text/html; charset=utf-8"
            elif (tipResursa == 'css'):
                contentType = b"text/css; charset=utf-8"
            elif (tipResursa == 'js'):
                contentType = b"application/js; charset=utf-8"
            elif (tipResursa == 'png'):
                contentType = b"text/png"
            elif (tipResursa == 'jpg' or tipResursa == 'jpeg'):
                contentType = b"text/jpeg"
            elif (tipResursa == 'gif'):
                contentType = b"text/gif"
            elif (tipResursa == 'ico'):
                contentType = b"image/x-icon"
            elif (tipResursa == 'json'):
                contentType = b"application/json; charset=utf-8"
            elif (tipResursa == 'xml'):
                contentType = b"application/xml; charset=utf-8"
            else:
                contentType = b"text/plain; charset=utf-8"


            clientSocket.sendall(status)
            clientSocket.sendall(b"Content-Length: " + contentLength + b"\r\n")
            clientSocket.sendall(b"Content-Type: " + contentType + b"\r\n")
            clientSocket.sendall(b"Access-Control-Allow-Origin: *"+ b"\r\n")
            clientSocket.sendall(b"Server: WebServer\r\n")
            clientSocket.sendall(b"Content-Encoding: gzip"+ b"\r\n")
            clientSocket.sendall(b"\r\n")

            clientSocket.sendall(mesaj)

        except:
            status2 = b"HTTP/1.1 404 Not Found\r\n"
            mesaj = b"Resource not found"
            mesaj=gzip.compress(mesaj)
            contentLength = str(len(mesaj)).encode()
            contentType=b"text/plain; charset=utf-8"

            clientSocket.sendall(status2)
            clientSocket.sendall(b"Content-Length:" + contentLength + b"\r\n")
            clientSocket.sendall(b"Content-Type:" + contentType + b"\r\n")
            clientSocket.sendall(b"Content-Encoding:" + b"gzip" + b"\r\n")
            clientSocket.sendall(b"Server : WebServer\r\n")
            clientSocket.sendall(b"\r\n")
            clientSocket.sendall(mesaj)

        finally:
            if fisier is not None:
                fisier.close()
            clientSocket.close()
            print('S-a terminat comunicarea cu clientul ',address)
    
    elif metoda=='POST':
        try:
            if linieDeStart[1]=='/api/utilizatori':      
                payload= cerere.split('\r\n\r\n')[1]
                form_fields = payload.split('&')
                print('FIELDS : '+str(form_fields))

                user={}

                for field in form_fields:
                    if field.find('utilizator')>-1:
                        username = field.split('=')[1]
                        if username != "":
                            user['utilizator']=username
                    if field.find('parola')>-1:
                        parola = field.split('=')[1]
                        if parola != "":
                            user['parola']=parola
                    if field.find('nume')>-1:
                        nume = field.split('=')[1]
                        if nume != "":
                            user['nume']=nume
                    if field.find('prenume')>-1:
                        prenume = field.split('=')[1]
                        if prenume != "":
                            user['prenume']=prenume
                    if field.find('email')>-1:
                        email = field.split('=')[1]
                        if email != "":
                            user['email']=email
                    if field.find('telefon')>-1:
                        telefon = field.split('=')[1]
                        if telefon != "":
                            user['telefon']=telefon
                    if field.find('data_nasterii')>-1:
                        data_nasterii = field.split('=')[1]
                        if data_nasterii != "":
                            user['data_nasterii']=data_nasterii
                    if field.find('sexul')>-1:
                        sexul = field.split('=')[1]
                        if sexul != "":
                            user['sexul']=sexul
                    if field.find('preferinte')>-1:
                        jucator = field.split('=')[1]
                        if jucator != "":
                            user['preferinte']=jucator
                    if field.find('culoare')>-1:
                        culoare = field.split('=')[1]
                        if culoare != "":
                            user['culoare']=culoare
                    if field.find('ora')>-1:
                        ora_nasterii = field.split('=')[1]
                        if ora_nasterii != "":
                            user['ora']=ora_nasterii
                    if field.find('experienta')>-1:
                        varsta = field.split('=')[1]
                        if varsta != "":
                            user['experienta']=varsta
                    if field.find('url')>-1:
                        pagina_personala = field.split('=')[1]
                        if pagina_personala != "":
                            user['url']=pagina_personala
                    if field.find('observatii')>-1:
                        descriere = field.split('=')[1]
                        if descriere != "":
                            user['observatii']=descriere


                if(username!='' and parola!=''):
                    with open('../continut/resurse/utilizatori.json') as json_file:
                        utilizatori = json.load(json_file) 
                        print(utilizatori)
                        utilizatorExistent=False 
                        for utilizator in utilizatori:
                            if utilizator['utilizator'] == username:
                                mesaj=b"Utilizatorul dat exista deja"
                                utilizatorExistent = True
                                break 
                        if not utilizatorExistent:
                            mesaj=b"Utilizatorul a fost adaugat"        
                            utilizatori.append(user)
                            with open('../continut/resurse/utilizatori.json', 'w') as json_file:
                                json_file.write(json.dumps(utilizatori))
                else:                
                    mesaj=b"Parola si numele de utilizator sunt campuri obligatorii."

                status = b"HTTP/1.1 200 OK\r\n"
        
        except Exception as e:
            print(str(e))
            status = b"HTTP/1.1 404 Not Found\r\n"
            mesaj = b"Pagina ceruta nu exista."

        finally:
            mesaj=gzip.compress(mesaj)
            contentLength = str(len(mesaj)).encode()
            contentType=b"text/plain; charset=utf-8"

            clientSocket.sendall(status)
            clientSocket.sendall(b"Content-Length:" + contentLength + b"\r\n")
            clientSocket.sendall(b"Content-Type:" + contentType + b"\r\n")
            clientSocket.sendall(b"Content-Encoding:" + b"gzip" + b"\r\n")
            clientSocket.sendall(b"Server : WebServer\r\n")
            clientSocket.sendall(b"\r\n")
            clientSocket.sendall(mesaj)
            clientSocket.close()
            print('S-a terminat comunicarea cu clientul ',address)




if __name__ == '__main__':
    # creeaza un server socket
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
    serversocket.bind(('', 5678))

    # serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
    serversocket.listen(5)
    #threads=[]
        
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')

    while True:

        # asteapta conectarea unui client la server
        # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
        try:
            (clientsocket, address) = serversocket.accept()
        except KeyboardInterrupt:
            break
        
        print('S-a conectat clientul : ',address)
        try:
            threading.Thread(target=communication_thread,args=(clientsocket,address)).start()
        except:
            print("Eroare la pornirea thread-ului")
            


            



