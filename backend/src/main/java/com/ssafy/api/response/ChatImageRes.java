package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class ChatImageRes extends BaseResponseBody {
    String body;
    List<SearchResultDTO> result;

    public static ChatImageRes of(int statusCode,String message, String body,List<SearchResultDTO> result) {
        ChatImageRes res = new ChatImageRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setBody(body);
        res.setResult(result);

        return res;
    }
}