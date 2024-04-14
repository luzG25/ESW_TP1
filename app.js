const express = require('express')
const fs = require('fs')

const app = express()
const port = 3001

// Responde com 'hello world' quando uma requisição é feita à homepage
app.get('/', (req, res) => {
    console.log(req.socket.remoteAddress)

    res.write('<html>');
    res.write('<head><title>Digite Messagem</title></head>');
    res.write('<body>');
    res.write('<form action="/mensagem" method="POST">');
    res.write('<input type="text" name="message">');
    res.write('<button type="submit">Enviar</button>');
    res.write('</form>');
    res.write('</body>');
    res.write('</html>');

    // 4 - Enviando resposta HTTP e retornando para não executar o restante do código
    return res.end();
})



app.post('/mensagem', (req, res, next) => {
    const body = []
    
    req.on('data', (parteDados) => {
        console.log(parteDados);
        body.push(parteDados)
    })

    return req.on('end', () => {
        const parsedBody = Buffer.concat(body).toString();
        console.log(parsedBody);
        const mensagem = parsedBody.split('=')[1];
        // 4e - a função writeFileSync vai bloquear a execução do código até que o arquivo seja escrito.Este é o funcionamento padrão do node.
        // que é em modo sincrono. Isso significa que o node vai esperar até que o arquivo seja escrito e só depois vai continuar a executar o código.
  
        fs.writeFile('message.txt', mensagem,(erro) => {
          // 4f - A função writeFile é não bloqueante. Isso significa que o node não vai esperar até que o arquivo seja escrito. 
          // Em vez disso ele vai continuar a executar o código e vai executar a função que for passada como segundo argumento quando o arquivo for escrito.
          // Isso é muito melhor porque se tivermos muitos usuários escrevendo arquivos ao mesmo tempo, o node não vai ter que esperar até que o arquivo seja escrito.        
            next()
        });
          
      });
})

app.use('/mensagem', (req, res) => {
    res.statusCode = 302;
    res.setHeader('Location', '/welcome');
    
    return res.end()
});

app.use('/welcome', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    
    return res.end()
})

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`)
})
