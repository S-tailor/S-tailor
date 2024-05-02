package com.ssafy.api.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

public interface TryOnService {
    UUID generateSessionId();
    SseEmitter getEmitterByTimeOut(Long timeout);
    SseEmitter sendSessionIdToFlip(UUID sessionId, SseEmitter emitter);
    SseEmitter getEmitterBySessionId(UUID sessionId);
    Boolean sendUserInfoToFlip(String sessionId, String token, String id, int profilePk, SseEmitter emitter);
    Boolean verifyRealUser(String token, String id);
}
