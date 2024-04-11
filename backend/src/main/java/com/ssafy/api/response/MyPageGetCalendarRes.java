package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.Calendar;
import com.ssafy.common.util.Deposit;
import com.ssafy.common.util.Line;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class MyPageGetCalendarRes extends BaseResponseBody {
    String from;
    String to;
    List<Calendar> data;

    public static MyPageGetCalendarRes of(int statusCode, String message, List<Calendar> data) {
        MyPageGetCalendarRes res = new MyPageGetCalendarRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        List<Calendar> tmp = new ArrayList<>();

        for (Calendar d : data) {
            Calendar c = new Calendar();
            c.setValue(d.getValue());
            c.setDay(d.getDay().substring(0,4)+'-'+d.getDay().substring(4,6)+'-'+d.getDay().substring(6));
            tmp.add(c);
        }

        res.setData(tmp);

        res.setFrom(LocalDate.now().minusYears(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        res.setTo(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

        return res;
    }
}
