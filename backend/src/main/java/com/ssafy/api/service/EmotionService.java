package com.ssafy.api.service;

import com.ssafy.db.entity.EmotionResult;
import com.ssafy.db.join.GetAlbumHistory;
import org.json.simple.JSONObject;

import java.util.List;

public interface EmotionService {
    EmotionResult analyzeEmotion(String memo);

    int emojiSaving(String userId, String emoji, Long amount);

    int memoSaving(String userId, String memo, String emoji, Long amount,int emotionResultPk);

    boolean selectAlbum(int emotionAccountPk);

    List<GetAlbumHistory> getAlbumHistory(String userId);

    String getAlbumDetail(int emotionAccountPk);
}
