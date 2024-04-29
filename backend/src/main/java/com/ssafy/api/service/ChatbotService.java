package com.ssafy.api.service;

import com.ssafy.api.request.ChatSendReq;
import com.ssafy.api.response.ChatResultDTO;

public interface ChatbotService {
    ChatResultDTO chatSend(ChatSendReq body);
}
