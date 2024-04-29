package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ChatRes extends BaseResponseBody {
    String body;

    public static ChatRes of(int statusCode,String message, String body) {
        ChatRes res = new ChatRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setBody(body);

        return res;
    }
}
