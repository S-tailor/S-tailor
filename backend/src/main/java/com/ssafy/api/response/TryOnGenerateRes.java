package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Tryon;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TryOnGenerateRes extends BaseResponseBody {
    Tryon result;

    public static TryOnGenerateRes of(int statusCode, String message, Tryon result) {
        TryOnGenerateRes res = new TryOnGenerateRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(result);

        return res;
    }
}
