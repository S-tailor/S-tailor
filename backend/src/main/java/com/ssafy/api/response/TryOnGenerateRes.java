package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TryOnGenerateRes extends BaseResponseBody {
    String generatedImageURL;

    public static TryOnGenerateRes of(int statusCode, String message, String generatedImageURL) {
        TryOnGenerateRes res = new TryOnGenerateRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setGeneratedImageURL(generatedImageURL);

        return res;
    }
}
