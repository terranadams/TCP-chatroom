const net = require('net')
const fs = require('fs')

let password = 'skatelife'
let chatLog = ''
let clients = []
let newClientId = 1
let server = net.createServer(client => {
    client.name = client.remoteAddress + client.remoteAddress // This refers to each clients address
    client.id = `Client-${newClientId}` // We use this to prevent new clients from having the name of old clients
    newClientId++ // We use this to prevent new clients from having the name of old clients
    clients.push(client) // We increment the number so that regardless of how many clients are still in the chat, they'll never have the same name
    chatLog += `${client.id} has joined the chat. \n`
    fs.writeFile('./chat.log', chatLog, () => {})
    console.log('\n' + 'A new client has arrived.')
    console.log(`Number of clients: ${clients.length}` + '\n')

    broadcast(`${client.id} has joined the chat! \n`, client)
    
    client.write('\n' + 'You are connected as ' + client.id + '\n' + 'Welcome to the chatroom!' + '\n') 
 
    client.on('data', data => {
        let dataString = data.toString().replace(/\r?\n|\r/, '')
        let dataArray = dataString.split(' ')
        if (dataArray[0] == '/username' && dataArray[1]) {
            if (dataArray[2]) client.write(`You passed in too many arguments, try again.`)
            else if (client.id == dataArray[1]) client.write(`You're already using that username.`)
            else if (clients.filter(x => x.id == dataArray[1]).length > 0) client.write(`Someone else is using that username.`)
            else {
                client.write(`\nYour new username is ${dataArray[1]}. \n`)
                broadcast(`${client.id}'s new username is ${dataArray[1]}. \n`, client)
                chatLog += `${client.id}'s new username is ${dataArray[1]}. \n`
                client.id = dataArray[1]
                fs.writeFile('./chat.log', chatLog, () => {})
            }
        } else if (dataArray[0] == '/clientlist') {
            if (dataArray[1]) {
                client.write('Too many arguments. Try again.')
            } else {
                clientList = clients.map(x => x.id).join(' ')
                client.write(clientList)
            }
        } else if (dataArray[0] == '/kick') {
            if (!dataArray[2]) {
                client.write('Not enough arguments. Try again.')
            } else if (dataArray[3]) {
                client.write('Too many arguments. Try again.')
            } else {
                let kicked = clients.filter(x => x.id == dataArray[1])[0]
                if (!kicked) {
                    client.write(`That username is not present in the chatroom.`)
                } else if (client.id == kicked.id) {
                    client.write(`If you want to leave the chat, just disconnect yourself.`)
                } else if (kicked && dataArray[2] !== password) {
                    client.write(`The password is incorrect. Try again.`)
                } else {
                    kicked.write(`\nYou've been kicked out of the chat, sorry... \n`)
                    kickedOut(kicked)
                }
            }
        } else {
            broadcast(`\n${client.id}: ${dataString}\n`, client)
            chatLog += `${client.id}: ${dataString}\n`
            fs.writeFile('./chat.log', chatLog, () => {})
        }
        
    })

    client.on('end', () => {
        broadcast(`${client.id} has left the chat. \n`, client) // This is a custom function that informs the other clients of this client's disconnection
        clients.splice(clients.indexOf(client), 1); // This removes this specific client's spot in the array of clients
        console.log(`Number of clients: ${clients.length}` + '\n')
        chatLog += `${client.id} has left the chat. \n`
        fs.writeFile('./chat.log', chatLog, () => {})
    })

    function broadcast(message, sender) { // We prevent resending the client's message being sent back to itself by capturing its index
        clients.forEach(x => {
            // Don't want to send it to sender
            if (x === sender) return;
            x.write(message)
        })
        console.log(message)
    }

    function kickedOut(kicked) {
        clients.forEach(x => {
            if (x.id == kicked.id) return
            x.write(`\nServer: ${kicked.id} has been kicked out of the chat. \n`)
        })
        chatLog += `Server: ${kicked.id} has been kicked out of the chat. \n`
        fs.writeFile('./chat.log', chatLog, () => {})
        console.log(`${kicked.id} has been kicked out of the chat. \n`)
    }
})

// We capture the server message outside of the main client function
process.stdin.on('data', data => { // This must be outside of the createServer callback
    clients.forEach(x => {
        x.write(`Server: ${data}`)
    })
    chatLog += `Server: ${data}`
    fs.writeFile('./chat.log', chatLog, () => {})
})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})
