package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Account;
import com.ssafy.db.join.GetAccountHistory;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class AccountDetailRes extends BaseResponseBody {
    String bankCode;
    Long balance;
    Date createAt;
    Long goal;
    String imageUrl;
    String name;
    String number;

    public static AccountDetailRes of(int statusCode, String message, Account result) {
        AccountDetailRes res = new AccountDetailRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);

        res.setName(result.getName());
        res.setNumber(result.getNumber());
        res.setBalance(result.getBalance());
        res.setGoal(result.getGoal());
        res.setCreateAt(result.getCreateAt());
        res.setBankCode(result.getBankCode());
        res.setImageUrl(result.getImageUrl());

        return res;
    }
}
