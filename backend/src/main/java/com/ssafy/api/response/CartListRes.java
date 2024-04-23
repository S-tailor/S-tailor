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
public class CartListRes extends BaseResponseBody {
    List<Closet> result;

    public static CartListRes of(int statusCode, String message, List<Closet> data) {
        CartListRes res = new CartListRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setResult(data);

        return res;
    }
}
