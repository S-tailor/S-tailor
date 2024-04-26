package com.ssafy.api.controller;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.api.response.ClosetListRes;
import com.ssafy.api.service.ClosetService;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Closet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/closet")
public class ClosetController {
    @Autowired
    ClosetService closetService;

    @PostMapping("/save")
    public ResponseEntity<? extends BaseResponseBody> closetSave(@RequestBody ClosetSaveReq info) {
        if(closetService.closetSave(info)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<? extends BaseResponseBody> closetList(int profilePk) {
        List<Closet> data = closetService.closetList(profilePk);
        if(data != null) {
            return ResponseEntity.ok(ClosetListRes.of(200,"Success",data));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400, "Fail"));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<? extends BaseResponseBody> closetDelete(int closetPk) {
        if(closetService.closetDelete(closetPk)) {
            return ResponseEntity.ok(BaseResponseBody.of(200,"Success"));
        } else {
            return ResponseEntity.ok(BaseResponseBody.of(400,"Fail"));
        }
    }
}