import { api } from './api'

async function chatbot(Info:any) {
    return await api.post('/chatbot/chat', Info, {
        headers: {
            'Content-Type':'multipart/form-data'
        }
    })
}

async function reset(pk:string) {
    
    return await api.post('/chatbot/clear', pk)
}
export {chatbot, reset}