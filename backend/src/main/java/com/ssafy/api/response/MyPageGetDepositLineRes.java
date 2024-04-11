package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.Deposit;
import com.ssafy.common.util.Line;
import com.ssafy.db.join.GetDeposit;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class MyPageGetDepositLineRes extends BaseResponseBody {
    List<Line> data;

    public static MyPageGetDepositLineRes of(int statusCode, String message, List<Deposit> data) {
        MyPageGetDepositLineRes res = new MyPageGetDepositLineRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        List<Line> tmp = new ArrayList<>();

        for (Deposit d : data) {
            Line l = new Line();
            l.setX(d.getDate().substring(0,4)+'-'+d.getDate().substring(4,6)+'-'+d.getDate().substring(6));
            l.setY(d.getBalance());
            tmp.add(l);
        }

        res.setData(tmp);

        return res;
    }
}
