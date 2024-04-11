package com.ssafy.db.join;

import java.util.Date;

public interface GetDonationHistory {
    Date getCreateAt();
    String getName();
    long getAmount();
    String getImageUrl();
}
