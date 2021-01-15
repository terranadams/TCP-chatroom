const net = require('net')

let clients = []
let server = net.createServer(client => {
    client.name = client.remoteAddress + client.remoteAddress
    client.id = clients.length + 1
    clients.push(client)
    console.log('Number of clients: ' + clients.length)

    client.write('Welcome to the chatroom!')

    client.on('data', data => {

        broadcast(data, client)

    })

    client.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(client.name + " left the chat.\n");
    })


    // all pipe does is forward events to other streams  //
    process.stdin.on('data', data => {
        client.write(`Server: ${data}`)
    })

    function broadcast(message, sender) {
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) { theIndex = index; return }
        })
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write('Client ' + (clients[theIndex].id) + ': ' + message)

        });
        let serverOutput = `Client ${clients[theIndex].id}: ${message}`
        // Log it to the server output too
        process.stdout.write(serverOutput)
    }

})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
