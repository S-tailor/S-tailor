package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Account;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class EmotionAlbumDetailRes extends BaseResponseBody {
    String memo;

    public static EmotionAlbumDetailRes of(int statusCode, String message, String memo) {
        EmotionAlbumDetailRes res = new EmotionAlbumDetailRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);

        res.setMemo(memo);

        return res;
    }
}
