const net = require('net')

let clients = []
let newClientId = 1
let server = net.createServer(client => {
    client.name = client.remoteAddress + client.remoteAddress
    client.id = newClientId
    newClientId++
    clients.push(client)
    console.log('\n' + 'A new client has arrived.')
    console.log(`Number of clients: ${clients.length}` + '\n')

    informClientAddition(client)

    client.write('\n' + 'You are connected as Client ' + client.id + '\n' + 'Welcome to the chatroom!' + '\n') 
 
    client.on('data', data => {
        broadcast(data, client)

    })

    client.on('end', () => {
        informClientRemoval(client)
        clients.splice(clients.indexOf(client), 1);
        console.log(`Number of clients: ${clients.length}` + '\n')
    })

    

    function broadcast(message, sender) {
        sender.write('')
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) { theIndex = index; return }
        })
        clients.forEach(x => {
            // Don't want to send it to sender
            if (x === sender) return;
            x.write('\n' + 'Client ' + (clients[theIndex].id) + ': ' + message)
        })
        let serverOutput = '\n' + `Client ${clients[theIndex].id}: ${message}` + '\n'
        // Log it to the server output too
        process.stdout.write(serverOutput)
    }

    function informClientRemoval(sender) {
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) { theIndex = index; return }
        })
        clients.forEach(x => {
            // Don't want to send it to sender
            if (x === sender) return;
            x.write(`Client ${clients[theIndex].id} has left the chat.` + '\n')
        })
        let serverOutput = `Client ${clients[theIndex].id} has left the chat.` + '\n'
        // Log it to the server output too
        process.stdout.write(serverOutput)
    }

    function informClientAddition(sender) {
        let theIndex
        clients.forEach((client, index) => {
            if (client === sender) { theIndex = index; return }
        })
        clients.forEach(x => {
            // Don't want to send it to sender
            if (x === sender) return;
            x.write(`Client ${clients[theIndex].id} has joined the chat.` + '\n')
        })
        process.stdout.write('')
    }

})

process.stdin.on('data', data => { // This must be outside of the createServer callback
    clients.forEach(x => {
        x.write(`Server: ${data}`)
    })
})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
