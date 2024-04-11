package com.ssafy.api.service;

import com.ssafy.common.util.Calendar;
import com.ssafy.common.util.Deposit;
import com.ssafy.common.util.FintechAPIUtil;
import com.ssafy.common.util.ForSort;
import com.ssafy.db.entity.Account;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.GetAccountHistory;
import com.ssafy.db.join.GetBalanceAndGoal;
import com.ssafy.db.join.GetDeposit;
import com.ssafy.db.join.GetEmotionRank;
import com.ssafy.db.repository.AccountRepository;
import com.ssafy.db.repository.UserRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service("myPageService")
public class MyPageServiceImpl implements MyPageService{

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AccountRepository accountRepository;

    @Value("${Fintech.baseUrl}")
    String fintechUrl;

    @Override
    public User getUserInfo(String userId) {
        try {
            User user = userRepository.findByUserIdAndIsDelete(userId,0);
            return user;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public int updateUserInfo(String originUserId, String updateUserId, String password, String nickname, String gender) {
        int userPk = getUserInfo(originUserId).getUserPk();
        try {
            int result = userRepository.updateUserInfo(updateUserId,password,nickname,gender,userPk);
            return result;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public Map<String, Object> getBalanceAndGoal(String userId) {
        try {
            GetBalanceAndGoal result = accountRepository.getBalanceAndGoal(getUserInfo(userId).getUserPk());

            if(result != null) {
                Map<String, Object> data = new HashMap<>();
                data.put("balance",result.getBalance());
                data.put("goal",result.getGoal());
                return data;
            }
        } catch (Exception e) {
            return null;
        }

        return null;
    }

    @Override
    public List<GetAccountHistory> getAccountHistory(String userId) {
        try {
            List<GetAccountHistory> result = accountRepository.getAccountHistory(getUserInfo(userId).getUserPk());
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Deposit> getDeposit(String userId) {
        User user = userRepository.findByUserIdAndIsDelete(userId, 0);
        Account account = accountRepository.findByUserPk(user.getUserPk());

        RestTemplate restTemplate = new RestTemplate();

        String url = fintechUrl + "/edu/account/inquireAccountTransactionHistory";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JSONObject body = new JSONObject();
        body.put("bankCode", account.getBankCode());
        body.put("accountNo", account.getNumber());
        body.put("transactionType", "A");
        body.put("startDate","20240101");
        body.put("endDate",LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        body.put("orderByType", "ASC");
        JSONObject header = FintechAPIUtil.baseHeaderSetting("inquireAccountTransactionHistory",user.getUserKey());

        body.put("Header",header);

        HttpEntity<JSONObject> requestMessage = new HttpEntity<>(body,httpHeaders);

        List<Deposit> result = new ArrayList<>();

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
            JSONParser parser = new JSONParser();
            JSONObject responseBody = (JSONObject) parser.parse(response.getBody());
            JSONObject rec = (JSONObject) responseBody.get("REC");
            JSONArray list = (JSONArray) rec.get("list");

            List<ForSort> sortList = new ArrayList<>();

            for (Object o : list) {
                ForSort sort = new ForSort();
                sort.setNo(Integer.parseInt((String)((JSONObject)o).get("transactionUniqueNo")));
                sort.setDate((String)((JSONObject)o).get("transactionDate"));
                sort.setType(Integer.parseInt((String)((JSONObject)o).get("transactionType")));
                sort.setBalance(Long.parseLong((String)((JSONObject)o).get("transactionBalance")));
                sort.setAfterBalance(Long.parseLong((String)((JSONObject)o).get("transactionAfterBalance")));
                sortList.add(sort);
            }

            sortList.sort((o1, o2) -> o1.getNo() - o2.getNo());

            Deposit deposit = new Deposit();
            String date = sortList.get(0).getDate();
            long sum = 0;
            long balance = 0;

            for (int i=0; i<sortList.size(); i++) {
                if(date.equals(sortList.get(i).getDate())) {
                    if(sortList.get(i).getType() == 1) {
                        sum += sortList.get(i).getBalance();
                    } else {
                        sum -= sortList.get(i).getBalance();
                    }
                    balance = sortList.get(i).getAfterBalance();
                } else {
                    deposit.setAmount(sum);
                    deposit.setDate(date);
                    deposit.setBalance(balance);
                    result.add(deposit);
                    deposit = new Deposit();
                    sum = sortList.get(i).getBalance();
                    balance = sortList.get(i).getAfterBalance();
                    date = sortList.get(i).getDate();
                }
                if(i == sortList.size() - 1) {
                    deposit.setAmount(sum);
                    deposit.setDate(date);
                    deposit.setBalance(balance);
                    result.add(deposit);
                }
            }
            return result;
        } catch (HttpClientErrorException e) {
            System.out.println(e.getResponseBodyAsString());
            return null;
        } catch (ParseException e) {
            return null;
        }
    }

    @Override
    public List<GetEmotionRank> getEmotionRank(String userId) {
        try {
            List<GetEmotionRank> result = accountRepository.getEmotionRank(getUserInfo(userId).getUserPk());
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<Calendar> getCalendar(String userId) {
        User user = userRepository.findByUserIdAndIsDelete(userId,0);
        Account account = accountRepository.findByUserPk(user.getUserPk());

        RestTemplate restTemplate = new RestTemplate();

        String url = fintechUrl + "/edu/account/inquireAccountTransactionHistory";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JSONObject body = new JSONObject();
        body.put("bankCode", account.getBankCode());
        body.put("accountNo", account.getNumber());
        body.put("transactionType", "A");
        body.put("startDate","20240101");
        body.put("endDate",LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        body.put("orderByType", "ASC");
        JSONObject header = FintechAPIUtil.baseHeaderSetting("inquireAccountTransactionHistory",user.getUserKey());

        body.put("Header",header);

        HttpEntity<JSONObject> requestMessage = new HttpEntity<>(body,httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url,requestMessage,String.class);
            JSONParser parser = new JSONParser();
            JSONObject responseBody = (JSONObject) parser.parse(response.getBody());
            JSONObject rec = (JSONObject) responseBody.get("REC");
            JSONArray list = (JSONArray) rec.get("list");

            List<Calendar> calendarList = new ArrayList<>();
            boolean flag = false;

            for (Object o : list) {
                flag = false;
                Calendar c = new Calendar();
                c.setDay((String)((JSONObject)o).get("transactionDate"));
                c.setValue(1);

                for (Calendar calendar : calendarList) {
                    if(calendar.getDay().equals(c.getDay())) {
                        calendar.setValue(calendar.getValue()+1);
                        flag = true;
                        break;
                    }
                }

                if(!flag) {
                    calendarList.add(c);
                }
            }

            return calendarList;

        } catch (HttpClientErrorException e) {
            System.out.println(e.getResponseBodyAsString());
            return null;
        } catch (ParseException e) {
            return null;
        }
    }
}
