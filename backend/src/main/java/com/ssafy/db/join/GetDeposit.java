package com.ssafy.db.join;

import java.util.Date;

public interface GetDeposit {
    Date getCreateAt();
    long getAmount();
    long getAmountSum();
}
