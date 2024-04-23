package com.ssafy.api.controller;

import com.ssafy.api.request.UserLoginPostReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.UserLoginPostRes;
import com.ssafy.api.service.UserService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.db.entity.User;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Api(value = "유저 API", tags = {"User"})
@RestController
@CrossOrigin("*")
@RequestMapping("/user")
public class UserController {
    @Autowired
     UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    @ApiOperation(value = "사용자 회원 가입", notes = "<strong>아이디, 패스워드, 닉네임, 성별 </strong>를 통해 회원가입 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> createUser(
            @RequestBody @ApiParam(value="회원가입 정보", required = true) UserRegisterPostReq registerInfo){
        String userId = registerInfo.getUserId();
        User user = userService.getUserByUserId(userId);

        if(user != null){
            return ResponseEntity.ok(BaseResponseBody.of(400,"ID Existed"));
        }

//        if(userService.createUser(registerInfo)) {
//            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
//        } else {
//            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
//        }
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @PostMapping("/login")
    public ResponseEntity<? extends BaseResponseBody> login(@RequestBody UserLoginPostReq loginInfo){
        String userId = loginInfo.getUserId();
        String password = loginInfo.getPassword();
        User user = userService.getUserByUserId(userId);

        if(user == null){
            return ResponseEntity.ok(BaseResponseBody.of(400,"ID Invalid"));
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            return ResponseEntity.ok(BaseResponseBody.of(400,"Passsword Invaild"));
        }

        return ResponseEntity.ok(UserLoginPostRes.of(200, "Success", JwtTokenUtil.getToken(userId), userId, null, null));
    }
}