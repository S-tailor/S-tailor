package com.ssafy.db.join;

import java.util.Date;

public interface GetAccountHistory {
    String getMemo();
    String getKind();
    long getAmount();
    Date getCreateAt();
}
