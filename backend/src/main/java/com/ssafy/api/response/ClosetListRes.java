package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Closet;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ClosetListRes extends BaseResponseBody {
    List<Closet> result;

    public static ClosetListRes of(int statusCode, String message, List<Closet> data) {
        ClosetListRes res = new ClosetListRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(data);

        return res;
    }
}
