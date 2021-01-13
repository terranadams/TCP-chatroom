const net = require('net')

const client = net.createConnection({port: 5000}, () => {
    // This callback gets invoked when it successfully connects to the server.
    console.log('Connected to server.')
})
client.on('data', data => {
    console.log('Message from server: ' + data.toString())
})
client.on('end', () => {
    client.end()
})
process.stdin.pipe(client)