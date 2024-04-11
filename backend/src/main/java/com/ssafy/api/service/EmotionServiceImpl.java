package com.ssafy.api.service;

import com.ssafy.common.util.FintechAPIUtil;
import com.ssafy.db.entity.*;
import com.ssafy.db.join.GetAccountInfo;
import com.ssafy.db.join.GetAlbumHistory;
import com.ssafy.db.repository.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.List;

@Service("emotionService")
public class EmotionServiceImpl implements EmotionService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    OriginalAccountRepository originalAccountRepository;

    @Autowired
    AccountHistoryRepository accountHistoryRepository;

    @Autowired
    EmotionRepository emotionRepository;

    @Autowired
    EmotionAccountRepository emotionAccountRepository;

    @Autowired
    EmotionAccountHistoryRepository emotionAccountHistoryRepository;

    @Autowired
    EmotionResultRepository emotionResultRepository;

    @Autowired
    UserService userService;

    @Value("${Fintech.baseUrl}")
    String fintechUrl;

    @Autowired
    FintechAPIUtil fintechAPIUtil;

    private static final String FAST_API_URL = "http://ai-compose:8000/ai";

    @Override
    public EmotionResult analyzeEmotion(String memo) {
        String url = FAST_API_URL + "/emotion/dic_test";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("memo", memo);

        HttpEntity<?> requestMessage = new HttpEntity<>(jsonObject.toString(), httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);

            // JSON 형식의 응답 데이터를 파싱하여 JSONObject로 반환
            JSONParser parser = new JSONParser();
            JSONObject jsonResponse = (JSONObject) parser.parse(response.getBody());

            // "fear"와 "surprise" 필드의 값을 갖는 JSONObject를 생성하여 반환
            JSONObject emotions = new JSONObject();
            emotions.put("result", jsonResponse.get("result"));

            JSONArray array = (JSONArray) emotions.get("result");

            EmotionResult emotionResult = new EmotionResult();

            emotionResult.setFear(String.valueOf(array.get(0)));
            emotionResult.setSurprise(String.valueOf(array.get(1)));
            emotionResult.setAngry(String.valueOf(array.get(2)));
            emotionResult.setSadness(String.valueOf(array.get(3)));
            emotionResult.setNeutral(String.valueOf(array.get(4)));
            emotionResult.setHappiness(String.valueOf(array.get(5)));
            emotionResult.setDisgust(String.valueOf(array.get(6)));

            EmotionResult result = emotionResultRepository.save(emotionResult);

            return result;

        } catch (HttpClientErrorException error) {
            String errorMessage = error.getResponseBodyAsString();
            System.out.println("HTTP 요청 실패: " + errorMessage);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Transactional
    @Override
    public int emojiSaving(String userId, String emoji, Long amount) {

        User user = userService.getUserByUserId(userId);
        int userPk = user.getUserPk();

        System.out.println(userId + emoji + amount);

        JSONObject body = new JSONObject();

        // 로그인 사용자 계좌 - 서비스 계좌(입금용)
        List<GetAccountInfo> getAccountInfo = accountRepository.getAccountInfo(userId);
        int accountPk = 0;
        for (GetAccountInfo accountInfo : getAccountInfo) {
            System.out.println("Bank Code: " + accountInfo.getBankCode());
            System.out.println("Account Number: " + accountInfo.getNumber());
            accountPk = accountInfo.getAccountPk();
            body.put("depositBankCode", accountInfo.getBankCode());
            body.put("depositAccountNo", accountInfo.getNumber());
            body.put("depositTransactionSummary", emoji);
        }

        body.put("transactionBalance", amount);

        // 로그인 사용자 계좌 - 실 계좌(출금용)
        List<GetAccountInfo> getOriginAccountInfo = originalAccountRepository.getOriginAccountInfo(userId);
        for (GetAccountInfo originAccountInfo : getOriginAccountInfo) {
            System.out.println("Bank Code: " + originAccountInfo.getBankCode());
            System.out.println("Account Number: " + originAccountInfo.getNumber());
            body.put("withdrawalBankCode", originAccountInfo.getBankCode());
            body.put("withdrawalAccountNo", originAccountInfo.getNumber());
            body.put("withdrawalTransactionSummary", emoji);
        }

        // Fintech Server로 계좌이체 진행
        String url = fintechUrl + "/edu/account/accountTransfer";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JSONObject header = FintechAPIUtil.baseHeaderSetting("accountTransfer", user.getUserKey());
        body.put("Header", header);

        HttpEntity<?> requestMessage = new HttpEntity<>(body, httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
        } catch (Exception e) {
            return 0;
        }

        // (SSAFY API) 서비스 계좌 잔액 검증 - 입금확인
        url = fintechUrl + "/edu/account/inquireAccountBalance";

        body = new JSONObject();
        for (GetAccountInfo accountInfo : getAccountInfo) {
            System.out.println("Bank Code: " + accountInfo.getBankCode());
            System.out.println("Account Number: " + accountInfo.getNumber());
            body.put("bankCode", accountInfo.getBankCode());
            body.put("accountNo", accountInfo.getNumber());
        }

        header = FintechAPIUtil.baseHeaderSetting("inquireAccountBalance", user.getUserKey());
        body.put("Header", header);
        requestMessage = new HttpEntity<>(body, httpHeaders);

        String ssafyAccountBalance;
        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
            JSONParser parser = new JSONParser();
            Object parse = parser.parse(response.getBody());
            JSONObject responseJson = (JSONObject) parse;
            JSONObject rec = (JSONObject) responseJson.get("REC");
            System.out.println("SSAFY API Account Balance : " + rec.get("accountBalance"));
            ssafyAccountBalance = (String) rec.get("accountBalance");
//            System.out.println(ssafyAccountBalance);

        } catch (Exception e) {
            return 0;
        }

        // (MySql) 서비스 계좌 잔액 검증 및 변경 - 입금확인
        Long accountBalance = accountRepository.getBalanceByUserId(userId);
        System.out.println("accountBalance : " + accountBalance);


        if (String.valueOf(accountBalance+amount).equals(ssafyAccountBalance)) {
            // 잔액이 일치하는 경우 서비스 계좌 잔액 업데이트
            accountRepository.updateBalanceByUserPk(userPk, Long.parseLong(ssafyAccountBalance));
            System.out.println("싱크 일치");
        } else {
            // 잔액이 일치하지 않는 경우 Fintech Server의 잔액으로 업데이트
            accountRepository.updateBalanceByUserPk(userPk, Long.parseLong(ssafyAccountBalance));
            System.out.println("싱크 불일치");
        }


        // (SSAFY API) 실 계좌 잔액 검증 - 출금확인
        url = fintechUrl + "/edu/account/inquireAccountBalance";

        body = new JSONObject();
        for (GetAccountInfo originAccountInfo : getOriginAccountInfo) {
            System.out.println("Bank Code: " + originAccountInfo.getBankCode());
            System.out.println("OriginAccount Number: " + originAccountInfo.getNumber());
            body.put("bankCode", originAccountInfo.getBankCode());
            body.put("accountNo", originAccountInfo.getNumber());
        }

        header = FintechAPIUtil.baseHeaderSetting("inquireAccountBalance", user.getUserKey());
        body.put("Header", header);

        requestMessage = new HttpEntity<>(body, httpHeaders);

        String ssafyOriginAccountBalance;
        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
            JSONParser parser = new JSONParser();
            Object parse = parser.parse(response.getBody());
            JSONObject responseJson = (JSONObject) parse;
            JSONObject rec = (JSONObject) responseJson.get("REC");
            System.out.println("SSAFY API OriginAccount Balance : " + rec.get("accountBalance"));
            ssafyOriginAccountBalance = (String) rec.get("accountBalance");
//            System.out.println(ssafyOriginAccountBalance);

        } catch (HttpClientErrorException e) {
            System.out.println(e.getResponseBodyAsString());
            return 0;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        // (MySql) 실 계좌 잔액 검증 및 변경 - 출금확인
        Long originAccountBalance = originalAccountRepository.getAvailableAmtByUserId(userId);
        System.out.println("originAccountBalance : " + originAccountBalance);


        if (String.valueOf(originAccountBalance-amount).equals(ssafyOriginAccountBalance)) {
            // 잔액이 일치하는 경우 실 계좌 잔액 업데이트
            originalAccountRepository.updateAvailableAmtByUserPk(userPk, Long.parseLong(ssafyOriginAccountBalance));
            System.out.println("싱크 일치");
        } else {
            // 잔액이 일치하지 않는 경우 Fintech Server의 잔액으로 업데이트
            originalAccountRepository.updateAvailableAmtByUserPk(userPk, Long.parseLong(ssafyOriginAccountBalance));
            System.out.println("싱크 불일치");
        }


        // (서비스 계좌 - 입금) 저축 금액 내역 (AccountHistory)
        AccountHistory accountHistory = new AccountHistory();
        accountHistory.setCreateAt(new Date());
        accountHistory.setAmount(amount);
        accountHistory.setAccountPk(accountPk);
        AccountHistory accountHistorySave = accountHistoryRepository.save(accountHistory);

        System.out.println("emoji : " + emoji);
        int emotionPk = emotionRepository.getEmotionPkByKind(emoji);

        // 감정 인벤토리 저축 (EmotionAccount)
        EmotionAccount emotionAccount = new EmotionAccount();
        emotionAccount.setCreateAt(new Date());
        emotionAccount.setEmotionPk(emotionPk);
        emotionAccount.setUserPk(userPk);
        EmotionAccount emotionAccountSave = emotionAccountRepository.save(emotionAccount);

        // 감정 저축 내역 저축 (EmotionAccountHistory)
        EmotionAccountHistory emotionAccountHistory = new EmotionAccountHistory();
        emotionAccountHistory.setEmotionAccountPk(emotionAccountSave.getEmotionAccountPk());
        emotionAccountHistory.setTransactionPk(accountHistorySave.getTransactionPk());
        emotionAccountHistory.setUserPk(userPk);
        emotionAccountHistoryRepository.save(emotionAccountHistory);

        return emotionAccountSave.getEmotionAccountPk();
    }
    @Transactional
    @Override
    public int memoSaving(String userId, String memo, String emoji, Long amount, int emotionResultPk) {

        User user = userService.getUserByUserId(userId);
        int userPk = user.getUserPk();

        System.out.println(userId + memo + emoji + amount);

        JSONObject body = new JSONObject();

        // 로그인 사용자 계좌 - 서비스 계좌(입금용)
        List<GetAccountInfo> getAccountInfo = accountRepository.getAccountInfo(userId);
        int accountPk = 0;
        for (GetAccountInfo accountInfo : getAccountInfo) {
            System.out.println("Bank Code: " + accountInfo.getBankCode());
            System.out.println("Account Number: " + accountInfo.getNumber());
            accountPk = accountInfo.getAccountPk();
            body.put("depositBankCode", accountInfo.getBankCode());
            body.put("depositAccountNo", accountInfo.getNumber());
            body.put("depositTransactionSummary", emoji);
        }

        body.put("transactionBalance", amount);

        // 로그인 사용자 계좌 - 실 계좌(출금용)
        List<GetAccountInfo> getOriginAccountInfo = originalAccountRepository.getOriginAccountInfo(userId);
        for (GetAccountInfo originAccountInfo : getOriginAccountInfo) {
            System.out.println("Bank Code: " + originAccountInfo.getBankCode());
            System.out.println("Account Number: " + originAccountInfo.getNumber());
            body.put("withdrawalBankCode", originAccountInfo.getBankCode());
            body.put("withdrawalAccountNo", originAccountInfo.getNumber());
            body.put("withdrawalTransactionSummary", emoji);
        }

        // Fintech Server로 계좌이체 진행
        String url = fintechUrl + "/edu/account/accountTransfer";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        JSONObject header = FintechAPIUtil.baseHeaderSetting("accountTransfer", user.getUserKey());
        body.put("Header", header);

        HttpEntity<?> requestMessage = new HttpEntity<>(body, httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
        } catch (Exception e) {
            return 0;
        }

        // (SSAFY API) 서비스 계좌 잔액 검증 - 입금확인
        url = fintechUrl + "/edu/account/inquireAccountBalance";

        body = new JSONObject();
        for (GetAccountInfo accountInfo : getAccountInfo) {
            System.out.println("Bank Code: " + accountInfo.getBankCode());
            System.out.println("Account Number: " + accountInfo.getNumber());
            body.put("bankCode", accountInfo.getBankCode());
            body.put("accountNo", accountInfo.getNumber());
        }

        header = FintechAPIUtil.baseHeaderSetting("inquireAccountBalance", user.getUserKey());
        body.put("Header", header);
        requestMessage = new HttpEntity<>(body, httpHeaders);

        String ssafyAccountBalance;
        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
            JSONParser parser = new JSONParser();
            Object parse = parser.parse(response.getBody());
            JSONObject responseJson = (JSONObject) parse;
            JSONObject rec = (JSONObject) responseJson.get("REC");
            System.out.println("SSAFY API Account Balance : " + rec.get("accountBalance"));
            ssafyAccountBalance = (String) rec.get("accountBalance");
//            System.out.println(ssafyAccountBalance);

        } catch (Exception e) {
            return 0;
        }

        // (MySql) 서비스 계좌 잔액 검증 및 변경 - 입금확인
        Long accountBalance = accountRepository.getBalanceByUserId(userId);
        System.out.println("accountBalance : " + accountBalance);


        if (String.valueOf(accountBalance+amount).equals(ssafyAccountBalance)) {
            // 잔액이 일치하는 경우 서비스 계좌 잔액 업데이트
            accountRepository.updateBalanceByUserPk(userPk, Long.parseLong(ssafyAccountBalance));
            System.out.println("싱크 일치");
        } else {
            // 잔액이 일치하지 않는 경우 Fintech Server의 잔액으로 업데이트
            accountRepository.updateBalanceByUserPk(userPk, Long.parseLong(ssafyAccountBalance));
            System.out.println("싱크 불일치");
        }


        // (SSAFY API) 실 계좌 잔액 검증 - 출금확인
        url = fintechUrl + "/edu/account/inquireAccountBalance";

        body = new JSONObject();
        for (GetAccountInfo originAccountInfo : getOriginAccountInfo) {
            System.out.println("Bank Code: " + originAccountInfo.getBankCode());
            System.out.println("OriginAccount Number: " + originAccountInfo.getNumber());
            body.put("bankCode", originAccountInfo.getBankCode());
            body.put("accountNo", originAccountInfo.getNumber());
        }

        header = FintechAPIUtil.baseHeaderSetting("inquireAccountBalance", user.getUserKey());
        body.put("Header", header);

        requestMessage = new HttpEntity<>(body, httpHeaders);

        String ssafyOriginAccountBalance;
        try {
            HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
            JSONParser parser = new JSONParser();
            Object parse = parser.parse(response.getBody());
            JSONObject responseJson = (JSONObject) parse;
            JSONObject rec = (JSONObject) responseJson.get("REC");
            System.out.println("SSAFY API OriginAccount Balance : " + rec.get("accountBalance"));
            ssafyOriginAccountBalance = (String) rec.get("accountBalance");
//            System.out.println(ssafyOriginAccountBalance);

        } catch (HttpClientErrorException e) {
            System.out.println(e.getResponseBodyAsString());
            return 0;
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }

        // (MySql) 실 계좌 잔액 검증 및 변경 - 출금확인
        Long originAccountBalance = originalAccountRepository.getAvailableAmtByUserId(userId);
        System.out.println("originAccountBalance : " + originAccountBalance);


        if (String.valueOf(originAccountBalance-amount).equals(ssafyOriginAccountBalance)) {
            // 잔액이 일치하는 경우 실 계좌 잔액 업데이트
            originalAccountRepository.updateAvailableAmtByUserPk(userPk, Long.parseLong(ssafyOriginAccountBalance));
            System.out.println("싱크 일치");
        } else {
            // 잔액이 일치하지 않는 경우 Fintech Server의 잔액으로 업데이트
            originalAccountRepository.updateAvailableAmtByUserPk(userPk, Long.parseLong(ssafyOriginAccountBalance));
            System.out.println("싱크 불일치");
        }


        // (서비스 계좌 - 입금) 저축 금액 내역 (AccountHistory)
        AccountHistory accountHistory = new AccountHistory();
        accountHistory.setCreateAt(new Date());
        accountHistory.setAmount(amount);
        accountHistory.setAccountPk(accountPk);
        AccountHistory accountHistorySave = accountHistoryRepository.save(accountHistory);


        int emotionPk = emotionRepository.getEmotionPkByKind(emoji);

        // 감정 인벤토리 저축 (EmotionAccount)
        EmotionAccount emotionAccount = new EmotionAccount();
        emotionAccount.setCreateAt(new Date());
        emotionAccount.setEmotionPk(emotionPk);
        emotionAccount.setUserPk(userPk);
        emotionAccount.setMemo(memo);
        emotionAccount.setEmotionResultPk(emotionResultPk);
        EmotionAccount emotionAccountSave = emotionAccountRepository.save(emotionAccount);

        // 감정 저축 내역 저축 (EmotionAccountHistory)
        EmotionAccountHistory emotionAccountHistory = new EmotionAccountHistory();
        emotionAccountHistory.setEmotionAccountPk(emotionAccountSave.getEmotionAccountPk());
        emotionAccountHistory.setTransactionPk(accountHistorySave.getTransactionPk());
        emotionAccountHistory.setUserPk(userPk);
        emotionAccountHistoryRepository.save(emotionAccountHistory);

        return emotionAccountSave.getEmotionAccountPk();
    }

    @Override
    public boolean selectAlbum(int emotionAccountPk) {
        EmotionAccount emotionAccount = emotionAccountRepository.findByEmotionAccountPk(emotionAccountPk);

        emotionAccount.toggleMarked();

        emotionAccountRepository.save(emotionAccount);

        return true;
    }

    @Override
    public List<GetAlbumHistory> getAlbumHistory(String userId) {
        return emotionAccountRepository.getAlbumHistory(userId);

    }

    @Override
    public String getAlbumDetail(int emotionAccountPk) {
        try {
            return emotionAccountRepository.getAlbumDetail(emotionAccountPk);
        } catch (Exception e) {
            return null;
        }
    }
}
