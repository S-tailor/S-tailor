package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.EmotionResult;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.List;

@Getter
@Setter
@ToString
public class EmotionAnalysisPostRes extends BaseResponseBody {
    int emotionResultPk;
    String fear;
    String surprise;
    String angry;
    String sadness;
    String neutral;
    String happiness;
    String disgust;

    public static EmotionAnalysisPostRes of(int statusCode, String message, EmotionResult emotions){
        EmotionAnalysisPostRes res = new EmotionAnalysisPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);

        res.setFear(emotions.getFear());
        res.setSurprise(emotions.getSurprise());
        res.setAngry(emotions.getAngry());
        res.setSadness(emotions.getSadness());
        res.setNeutral(emotions.getNeutral());
        res.setHappiness(emotions.getHappiness());
        res.setDisgust(emotions.getDisgust());
        res.setEmotionResultPk(emotions.getEmotionResultPk());

        return res;
    }
}
