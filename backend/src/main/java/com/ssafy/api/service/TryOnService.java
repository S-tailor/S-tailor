package com.ssafy.api.service;

import com.ssafy.api.request.TryOnVerifyReq;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

public interface TryOnService {
    UUID generateSessionId();
    SseEmitter getEmitterByTimeOut(Long timeout);
    SseEmitter sendSessionIdToFlip(UUID sessionId, SseEmitter emitter);
    SseEmitter getEmitterBySessionId(UUID sessionId);
    Boolean sendUserInfoToMobile(TryOnVerifyReq info, SseEmitter emitter);
    Boolean isYourToken(String token, String id);
}
