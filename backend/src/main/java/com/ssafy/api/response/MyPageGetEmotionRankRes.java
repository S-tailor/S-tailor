package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.join.GetEmotionRank;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class MyPageGetEmotionRankRes extends BaseResponseBody {
    int fear = 0;
    int surprise = 0;
    int angry = 0;
    int sadness = 0;
    int neutral = 0;
    int happiness = 0;
    int disgust = 0;

    public static MyPageGetEmotionRankRes of(int statusCode, String message, List<GetEmotionRank> data) {
        MyPageGetEmotionRankRes res = new MyPageGetEmotionRankRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        for (GetEmotionRank d : data) {
            switch (d.getEmotionPk()) {
                case 0:
                    res.setFear((int)d.getCount());
                    break;
                case 1:
                    res.setSurprise((int)d.getCount());
                    break;
                case 2:
                    res.setAngry((int)d.getCount());
                    break;
                case 3:
                    res.setSadness((int)d.getCount());
                    break;
                case 4:
                    res.setNeutral((int)d.getCount());
                    break;
                case 5:
                    res.setHappiness((int)d.getCount());
                    break;
                case 6:
                    res.setDisgust((int)d.getCount());
                    break;
            }
        }

        return res;
    }
}
