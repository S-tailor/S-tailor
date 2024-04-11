package com.ssafy.api.service;

import com.ssafy.common.util.Calendar;
import com.ssafy.common.util.Deposit;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetDeposit;
import com.ssafy.db.join.GetEmotionRank;

import java.util.List;
import java.util.Map;

public interface MyPageService {
    User getUserInfo(String userId);
    int updateUserInfo(String originUserId, String updateUserId, String password, String nickname, String gender);

    Map<String, Object> getBalanceAndGoal(String userId);

    List<GetAccountHistory> getAccountHistory(String userId);

    List<Deposit> getDeposit(String userId);

    List<GetEmotionRank> getEmotionRank(String userId);

    List<Calendar> getCalendar(String userId);
}
