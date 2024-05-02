package com.ssafy.api.service;

import com.ssafy.api.request.TryOnVerifyReq;
import com.ssafy.common.util.JwtTokenUtil;
import org.json.simple.JSONObject;
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
        emitter.onCompletion(() -> emitters.remove(sessionId));
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
    public Boolean sendUserInfoToMobile(TryOnVerifyReq info, SseEmitter emitter) {
        try {
            JSONObject data = new JSONObject();

            data.put("sessionId", info.getSessionId());
            data.put("token", info.getToken());
            data.put("id", info.getId());
            data.put("profilePk", info.getProfilePk());

            emitter.send(SseEmitter.event()
                    .name("getUserInfo")
                    .data(data.toJSONString()));
            emitter.complete();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            //throw new RuntimeException(e);
            return false;
        }
    }

    @Override
    public Boolean isYourToken(String token, String id) {
        String decodedUserId = JwtTokenUtil.getDecodedUserId(token);
        return decodedUserId.equals(id);
    }
}
