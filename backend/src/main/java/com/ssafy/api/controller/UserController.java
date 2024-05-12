package com.ssafy.api.controller;

import com.ssafy.api.request.ProfileCreateReq;
import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.*;
import com.ssafy.api.service.ProfileService;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.Profile;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.ProfileList;
import io.swagger.annotations.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    ProfileService profileService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public ResponseEntity<? extends BaseResponseBody> createUser(@RequestBody UserRegisterPostReq registerInfo){
        String userId = registerInfo.getId();
        User user = userService.getUserByUserId(userId);

        if(user != null){
            return ResponseEntity.ok(BaseResponseBody.of(400,"ID Existed"));
        }

        if(userService.userCreate(registerInfo)) {
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<? extends BaseResponseBody> login(@RequestBody UserLoginPostReq loginInfo){
        String userId = loginInfo.getId();
        String password = loginInfo.getPassword();
        User user = userService.getUserByUserId(userId);

        if(user == null){
            return ResponseEntity.ok(BaseResponseBody.of(400,"ID Invalid"));
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            return ResponseEntity.ok(BaseResponseBody.of(400,"Passsword Invaild"));
        }

        return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId), userId, user.getUserPk()));
    }

    @PostMapping("/profile/create")
    public ResponseEntity<? extends BaseResponseBody> profileCreate(@ModelAttribute ProfileCreateReq info) {
        try {
            Profile result = profileService.profileCreate(info);
            if(result != null) {
                return ResponseEntity.ok(ProfileCreateRes.of(200,"Success",result.getProfilePk()));
            } else {
                return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PostMapping("/profile")
    public ResponseEntity<? extends BaseResponseBody> profileSelect(int profilePk) {
        Profile profile = profileService.profileSelect(profilePk);

        if(profile != null) {
            return ResponseEntity.ok(ProfileSelectRes.of(200, "Success", profile));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @GetMapping("/profile/list")
    public ResponseEntity<? extends BaseResponseBody> profileList(String id) {
        List<ProfileList> list = profileService.profileList(id);
        if(list != null) {
            return ResponseEntity.ok(ProfileListRes.of(200,"Success", list));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @PutMapping("/profile/edit")
    public ResponseEntity<? extends BaseResponseBody> profileEdit(ProfileCreateReq info) {
        if(profileService.profileEdit(info)) {
            return ResponseEntity.ok(BaseResponseBody.of(200, "Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @GetMapping("/check")
    public ResponseEntity<? extends BaseResponseBody> idCheck(String id) {
        Long result = userService.idCheck(id);
        if(result == 0) {
            return ResponseEntity.ok(UserIdCheckRes.of(200, "Success", false));
        } else if(result > 0){
            return ResponseEntity.ok(UserIdCheckRes.of(200, "Success", true));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }
}