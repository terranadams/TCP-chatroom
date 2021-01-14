const net = require('net')

let clients = []
let server = net.createServer(client => {
    client.name = client.remoteAddress + client.remoteAddress

    clients.push(client)

    client.write('Client ' + (clients.length) + ' has entered the chat, welcome!')

    client.on('data', data => {

        broadcast(data, client)

    })

    client.on('end', client.end)
    // all pipe does is forward events to other streams  //
    process.stdin.on('data', data => {
        client.write(`Server: ${data}`)
    })
    
    function broadcast(message, sender) {
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) { theIndex = index + 1; return }
        })
        clients.forEach(function (client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write('Client ' + (theIndex) + ': ' + message)

        });
        let serverOutput = `Client ${theIndex}: ${message}`
        // Log it to the server output too
        process.stdout.write(serverOutput)
    }

})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
