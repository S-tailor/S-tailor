package com.ssafy.api.service;

import com.ssafy.api.request.ChatSendReq;
import com.ssafy.api.response.ChatResultDTO;

import java.util.List;

public interface ChatbotService {
    ChatResultDTO chatSend(ChatSendReq body, List<String>urls);
    List<String> saveImage(ChatSendReq body);
}
