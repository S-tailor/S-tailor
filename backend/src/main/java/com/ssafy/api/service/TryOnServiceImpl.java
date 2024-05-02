package com.ssafy.api.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TryOnServiceImpl implements TryOnService{
    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();


    @Override
    public UUID generateSessionId() {
        return UUID.randomUUID();
    }

    @Override
    public SseEmitter getEmitterByTimeOut(Long timeout) {
        return new SseEmitter(timeout);
    }

    @Override
    public SseEmitter sendSessionIdToFlip(UUID sessionId, SseEmitter emitter) {
        emitter.onCompletion(() -> {
            emitters.remove(sessionId);
        });
        emitter.onError ((ex) -> {
            emitters.remove(sessionId);
            emitter.complete();
        });
        emitter.onTimeout (emitter::complete);

        emitters.put(sessionId, emitter);
        try {
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data(sessionId));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return emitter;
    }

    @Override
    public SseEmitter getEmitterBySessionId(UUID sessionId) {
        return emitters.get(sessionId);
    }

    @Override
    public Boolean sendUserInfoToFlip(String sessionId, String token, String id, int profilePk, SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event()
                    .name("getToken")
                    .data(token));
            emitter.complete();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            //throw new RuntimeException(e);
            return false;
        }
    }

    @Override
    public Boolean verifyRealUser(String token, String id) {
        return null;
    }
}
