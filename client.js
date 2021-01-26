const net = require('net')

const client = net.createConnection({port: 5000}, () => {
    // This callback gets invoked when it successfully connects to the server.
    // console.log('\n' + 'Connected to server.')
})
client.on('data', data => {
    if (data.toString() == `\nYou've been kicked out of the chat, sorry... \n`) {
        console.log(data.toString())
        client.end()
    }
    else console.log(data.toString())
})
client.on('end', () => {
    client.end()
})
process.stdin.pipe(client)