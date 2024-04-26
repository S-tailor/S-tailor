package com.ssafy.api.service;


import com.ssafy.api.request.UserRegisterPostReq;
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
	PasswordEncoder passwordEncoder;

	@Override
	public User getUserByUserId(String userId) {
		try {
			User user = userRepository.findById(userId);
			return user;
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public boolean userCreate(UserRegisterPostReq info) {
		User user = new User();
		user.setId(info.getId());
		user.setPassword(passwordEncoder.encode(info.getPassword()));

		try {
			userRepository.save(user);
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	@Override
	public Long idCheck(String id) {
		try {
			return userRepository.countById(id);
		} catch (Exception e) {
			return null;
		}
	}

}
