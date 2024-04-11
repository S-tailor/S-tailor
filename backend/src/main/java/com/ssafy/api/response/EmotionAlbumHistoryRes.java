package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetAlbumHistory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class EmotionAlbumHistoryRes extends BaseResponseBody {
    List<GetAlbumHistory> data;

    public static EmotionAlbumHistoryRes of(int statusCode, String message, List<GetAlbumHistory> data) {
        EmotionAlbumHistoryRes res = new EmotionAlbumHistoryRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setData(data);

        return res;
    }
}
