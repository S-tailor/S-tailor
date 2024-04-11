package com.ssafy.api.service;


import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.common.util.FintechAPIUtil;
import com.ssafy.db.entity.OriginalAccount;
import com.ssafy.db.repository.*;
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

import com.ssafy.db.entity.User;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
	@Autowired
	UserRepository userRepository;

	@Autowired
	UserRepositorySupport userRepositorySupport;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	OriginalAccountRepository originalAccountRepository;

	@Autowired
	AccountRepository accountRepository;

	@Value("${Fintech.apiKey}")
	String apiKey;

	@Value("${Fintech.baseUrl}")
	String fintechUrl;

	@Value("${Fintech.baseEmail}")
	String baseEmail;

	@Value("${Fintech.institutionCode}")
	String institutionCode;

	@Value("${Fintech.fintechAppNo}")
	String fintechAppNo;

	@Autowired
	FintechAPIUtil fintechAPIUtil;

	@Override
	public User getUserByUserId(String userId) {
		try {
			User user = userRepository.findByUserIdAndIsDelete(userId,0);
			return user;
		} catch (Exception e) {
			return null;
		}
	}

	@Transactional
	@Override
	public Boolean createUser(UserRegisterPostReq userRegisterInfo) {
		User user = new User();
		user.setUserId(userRegisterInfo.getUserId());
		user.setGender(userRegisterInfo.getGender());
		user.setNickname(userRegisterInfo.getNickname());
		// 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
		String pw = passwordEncoder.encode(userRegisterInfo.getPassword());
		user.setPassword(pw);

		// RestTemplate로 핀테크 서버에 api 요청하기
		String url = fintechUrl + "/member/search";

		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.setContentType(MediaType.APPLICATION_JSON);

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("userId",userRegisterInfo.getUserId()+baseEmail);
		jsonObject.put("apiKey", apiKey);

        HttpEntity<?> requestMessage = new HttpEntity<>(jsonObject.toString(),httpHeaders);

		try {
			HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
		} catch (HttpClientErrorException e) {
			JSONParser parser = new JSONParser();
            try {
                Object obj = parser.parse(e.getResponseBodyAsString());
				JSONObject responseJson =(JSONObject) obj;
				if(!responseJson.get("responseCode").equals("E4003")) {
					return false;
				}
            } catch (ParseException ex) {
                return false;
            }
		}

		if(userRepository.countByUserIdAndIsDelete(userRegisterInfo.getUserId(),0) != 0) {
			return false;
		}

		// RestTemplate로 핀테크 서버에 api 요청하기
		url = fintechUrl + "/member";
		String userKey = "";
		try {
			HttpEntity<String> response = restTemplate.postForEntity(url, requestMessage, String.class);
			JSONParser parser = new JSONParser();
			Object obj = parser.parse(response.getBody());
			JSONObject responseJson =(JSONObject) obj;
			JSONObject payload = (JSONObject) responseJson.get("payload");
			userKey = (String) payload.get("userKey");
			user.setUserKey(userKey);
		} catch (Exception e) {
			return false;
		}

		try {
			userRepository.save(user);
		} catch (Exception e) {
			return false;
		}

		user = getUserByUserId(userRegisterInfo.getUserId());

		url = fintechUrl + "/edu/account/openAccount";
		JSONObject body = new JSONObject();
		//"004-1-74fe2deafd3277"
		body.put("accountTypeUniqueNo","004-1-74fe2deafd3277");

		JSONObject header = FintechAPIUtil.baseHeaderSetting("openAccount",user.getUserKey());
		body.put("Header",header);

		OriginalAccount originalAccount = new OriginalAccount();

		requestMessage = new HttpEntity<>(body,httpHeaders);

		try {
			HttpEntity<String> response = restTemplate.postForEntity(url,requestMessage,String.class);
			JSONParser parser = new JSONParser();
			Object parse = parser.parse(response.getBody());
			JSONObject responseJson = (JSONObject) parse;
			JSONObject rec = (JSONObject) responseJson.get("REC");

			originalAccount.setNumber((String) rec.get("accountNo"));
			originalAccount.setBankCode((String) rec.get("bankCode"));
			originalAccount.setUserPk(user.getUserPk());
		} catch (Exception e) {
			return false;
		}

		url = fintechUrl + "/edu/account/receivedTransferAccountNumber";

		body = new JSONObject();

		body.put("bankCode",originalAccount.getBankCode());
		body.put("accountNo",originalAccount.getNumber());
		body.put("transactionBalance",5000000);
		body.put("transactionSummary","초기화");

		header = FintechAPIUtil.baseHeaderSetting("receivedTransferAccountNumber",user.getUserKey());
		body.put("Header",header);

		requestMessage = new HttpEntity<>(body,httpHeaders);

		try {
			HttpEntity<String> response = restTemplate.postForEntity(url,requestMessage,String.class);
			originalAccount.setAvailableAmt(5000000);
		} catch (Exception e) {
			return false;
		}

		try {
			originalAccountRepository.save(originalAccount);
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	@Override
	public boolean accountCheck(String userId) {
		User user = getUserByUserId(userId);

		int result = accountRepository.countByUserPk(user.getUserPk());

		if(result == 0) {
			return false;
		} else {
			return true;
		}
	}
}
