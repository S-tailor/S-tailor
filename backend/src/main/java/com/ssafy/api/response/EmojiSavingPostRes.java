package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmojiSavingPostRes extends BaseResponseBody {
    int emotionAccountPk;

    public static EmojiSavingPostRes of(int statusCode, String message, int emotionAccountPk){
        EmojiSavingPostRes res = new EmojiSavingPostRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setEmotionAccountPk(emotionAccountPk);

        return res;
    }
}
