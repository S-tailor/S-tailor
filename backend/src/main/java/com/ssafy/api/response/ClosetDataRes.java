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
public class ClosetDataRes extends BaseResponseBody {
    Closet result;

    public static ClosetDataRes of(int statusCode, String message, Closet data) {
        ClosetDataRes res = new ClosetDataRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(data);

        return res;
    }
}
