package com.ssafy.api.service;

import com.ssafy.api.request.AccountCreateReq;
import com.ssafy.db.entity.Account;

public interface AccountService {
    boolean accountCreate(AccountCreateReq info);

    Account accountDetail(String userId);

    boolean accountUpdate(AccountCreateReq info);
}
