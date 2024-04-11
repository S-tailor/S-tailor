package com.ssafy.api.controller;

import com.ssafy.api.request.AccountCreateReq;
import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.api.response.AccountDetailRes;
import com.ssafy.api.service.AccountService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Account;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    AccountService accountService;


    @PostMapping("/create")
    @ApiOperation(value = "서비스 계좌 개설", notes = "<strong>상품, 이름, 대표이미지, 목표금액, 계좌 비밀번호</strong>를 통해 서비스 계좌를 개설 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> accountCreate(
            @ModelAttribute @ApiParam(value="회원가입 정보", required = true) AccountCreateReq accountInfo){

        if(accountService.accountCreate(accountInfo)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @GetMapping("/detail")
    @ApiOperation(value = "서비스 계좌 조회", notes = "<strong>아이디</strong>를 통해 서비스 계좌를 조회 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> accountDetail(
            @ApiParam(value="회원가입 정보", required = true) String userId){
        Account account = accountService.accountDetail(userId);
        if(account != null) {
            return ResponseEntity.ok(AccountDetailRes.of(200,"Success",account));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @PutMapping("/update")
    @ApiOperation(value = "서비스 계좌 수정", notes = "<strong>상품, 이름, 대표이미지, 목표금액, 계좌 비밀번호</strong>를 통해 서비스 계좌를 수정 한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends BaseResponseBody> accountUpdate(
            @ModelAttribute @ApiParam(value="회원가입 정보", required = true) AccountCreateReq accountInfo){

        if(accountService.accountUpdate(accountInfo)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }
}
