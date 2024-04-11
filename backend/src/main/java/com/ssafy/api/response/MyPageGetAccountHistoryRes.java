package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.join.GetAccountHistory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class MyPageGetAccountHistoryRes extends BaseResponseBody {
    List<GetAccountHistory> data;

    public static MyPageGetAccountHistoryRes of(int statusCode, String message, List<GetAccountHistory> data) {
        MyPageGetAccountHistoryRes res = new MyPageGetAccountHistoryRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setData(data);

        return res;
    }
}
