const net = require('net')

let clients = []
let newClientId = 1
let server = net.createServer(client => {
    client.name = client.remoteAddress + client.remoteAddress // This refers to each clients address
    client.id = newClientId // We use this to prevent new clients from having the name of old clients
    newClientId++ // We use this to prevent new clients from having the name of old clients
    clients.push(client) // We increment the number so that regardless of how many clients are still in the chat, they'll never have the same name
    
    
    console.log('\n' + 'A new client has arrived.')
    console.log(`Number of clients: ${clients.length}` + '\n')

    informClientAddition(client) // This is a function I made that informs the other clients of a new client that joined the chat

    client.write('\n' + 'You are connected as Client ' + client.id + '\n' + 'Welcome to the chatroom!' + '\n') 
 
    client.on('data', data => {
        broadcast(data, client) // This is a custom function that rebroadcasts client messages to the other clients without resending it back to the sender
    })

    client.on('end', () => {
        informClientRemoval(client) // This is a custom function that informs the other clients of this client's disconnection
        clients.splice(clients.indexOf(client), 1); // This removes this specific client's spot in the array of clients
        console.log(`Number of clients: ${clients.length}` + '\n')
    })

    

    function broadcast(message, sender) { // We prevent resending the client's message being sent back to itself by capturing its index
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

    function informClientRemoval(sender) { // We loop through the array of clients and message them about which client left the chat
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

    function informClientAddition(sender) { // We prevent resending the message about a new client joining by capturing its index
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

// We capture the server message outside of the main client function
process.stdin.on('data', data => { // This must be outside of the createServer callback
    clients.forEach(x => {
        x.write(`Server: ${data}`)
    })
})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
