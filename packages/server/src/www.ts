import app from './app'
import {createServer} from 'http'

const port = process.env.PORT || 8000

const server = createServer(app)

server.listen(port)
server.on('error',onError)
server.on('listening',onListening)

function onError(error:any){
    console.error(error)
}
function onListening(){
    console.error(`istening on ${port} `)

}
