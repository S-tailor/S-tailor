package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MyPageGetSumRes extends BaseResponseBody {
    long balance;
    long goal;

    public static MyPageGetSumRes of(int statusCode, String message, long balance, long goal) {
        MyPageGetSumRes res = new MyPageGetSumRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setBalance(balance);
        res.setGoal(goal);

        return res;
    }
}
