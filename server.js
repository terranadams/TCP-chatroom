const net = require('net')

let server = net.createServer(client => {
    client.write('Welcome to the chat room!')
    client.on('data', data => {
        console.log('Message from client: ' + data.toString())
    })
    client.on('end', client.end)
    process.stdin.pipe(client)

})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
