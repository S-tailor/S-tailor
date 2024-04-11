package com.ssafy.api.service;

import com.ssafy.api.request.DonationPayReq;
import com.ssafy.common.util.FintechAPIUtil;
import com.ssafy.db.entity.Account;
import com.ssafy.db.entity.Donation;
import com.ssafy.db.entity.DonationHistory;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.GetDonationHistory;
import com.ssafy.db.join.GetDonationRecommend;
import com.ssafy.db.repository.AccountRepository;
import com.ssafy.db.repository.DonationHistoryRepository;
import com.ssafy.db.repository.DonationRepository;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class DonationServiceImpl implements DonationService{

    @Autowired
    DonationRepository donationRepository;

    @Autowired
    DonationHistoryRepository donationHistoryRepository;

    @Autowired
    AccountService accountService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    UserService userService;

    @Value("${Fintech.baseUrl}")
    String fintechUrl;

    @Override
    public List<GetDonationRecommend> getDonationRecommend(String emotion) {
        try {
            List<GetDonationRecommend> result = donationRepository.donationRecommend(emotion);
            return result;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean donationPay(DonationPayReq donationPayReq) {
        User user = userService.getUserByUserId(donationPayReq.getUserId());

        RestTemplate restTemplate = new RestTemplate();

        String url = fintechUrl + "/edu/account/drawingTransfer";

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        Account account = accountService.accountDetail(donationPayReq.getUserId());

        JSONObject body = new JSONObject();
        body.put("bankCode",account.getBankCode());
        body.put("accountNo",account.getNumber());
        body.put("transactionBalance",donationPayReq.getAmount());
        body.put("transactionSummary","test");

        JSONObject header = FintechAPIUtil.baseHeaderSetting("drawingTransfer",user.getUserKey());

        body.put("Header",header);

        HttpEntity<?> requestMessage = new HttpEntity<>(body,httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url,requestMessage,String.class);
            Donation donation = donationRepository.findByName(donationPayReq.getName());
            DonationHistory donationHistory = new DonationHistory();
            donationHistory.setAmount(donationPayReq.getAmount());
            donationHistory.setUserPk(user.getUserPk());
            donationHistory.setDonationPk(donation.getDonationPk());
            donationHistory.setCreateAt(new Date());
            donationHistoryRepository.save(donationHistory);
        } catch (HttpClientErrorException e) {
            return false;
        }

        url = fintechUrl + "/edu/account/inquireAccountBalance";

        body = new JSONObject();
        body.put("bankCode",account.getBankCode());
        body.put("accountNo",account.getNumber());

        header = FintechAPIUtil.baseHeaderSetting("inquireAccountBalance",user.getUserKey());

        body.put("Header",header);

        requestMessage = new HttpEntity<>(body,httpHeaders);

        try {
            HttpEntity<String> response = restTemplate.postForEntity(url,requestMessage,String.class);
            JSONParser parser = new JSONParser();
            Object parse = parser.parse(response.getBody());
            JSONObject responseJson = (JSONObject) parse;
            JSONObject rec = (JSONObject) responseJson.get("REC");
            String balance = (String) rec.get("accountBalance");
            int result = accountRepository.changeBalance(Long.parseLong(balance),user.getUserPk());
        } catch (Exception e) {
            return false;
        }

        try {
            Donation donation = donationRepository.findByName(donationPayReq.getName());
            donationRepository.updateAmount(donation.getCurrentAmount()+donationPayReq.getAmount(), donation.getDonationPk());
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    @Override
    public List<GetDonationHistory> getDonationHistory(String userId) {
        User user = userService.getUserByUserId(userId);
        int userPk = user.getUserPk();
        try {
            List<GetDonationHistory> result = donationHistoryRepository.getDonationHistory(userPk);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<GetDonationRecommend> getDonationRecommendAll() {
        try {
            return donationRepository.donationRecommendAll();
        } catch (Exception e) {
            return null;
        }
    }
}