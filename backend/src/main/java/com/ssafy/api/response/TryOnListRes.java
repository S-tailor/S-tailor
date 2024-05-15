package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Closet;
import com.ssafy.db.entity.Tryon;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@ToString
public class TryOnListRes extends BaseResponseBody {
    List<Tryon> tryonList;
    List<Closet> closetList;
    public static TryOnListRes of(int statusCode, String message, Map<String, Object> result) {
        TryOnListRes res = new TryOnListRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setTryonList((List<Tryon>) result.get("tryonList"));
        res.setClosetList((List<Closet>) result.get("closetList"));
        return res;
    }
}
