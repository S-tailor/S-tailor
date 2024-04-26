import { api } from './api'

async function chatbot(Info:string) {
    return await api.post('/chatbot/converse', Info)
}

export {chatbot}