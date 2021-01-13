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

    process.stdin.pipe(client)

    function broadcast(message, sender) {
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) {theIndex = index + 1; return}
        })
        clients.forEach(function (client, index) {
          // Don't want to send it to sender
          if (client === sender) return;
          client.write('Client ' + (theIndex) + ' says: ' + message)

        });
        let serverOutput = `Client ${theIndex}  says: ${message}`
        // Log it to the server output too
        process.stdout.write(serverOutput)
      }

})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
