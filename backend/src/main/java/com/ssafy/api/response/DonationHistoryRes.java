package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.DonationHistory;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetDonationHistory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class DonationHistoryRes extends BaseResponseBody {
    List<GetDonationHistory> data;

    public static DonationHistoryRes of(int statusCode, String message, List<GetDonationHistory> data) {
        DonationHistoryRes res = new DonationHistoryRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setData(data);

        return res;
    }
}
