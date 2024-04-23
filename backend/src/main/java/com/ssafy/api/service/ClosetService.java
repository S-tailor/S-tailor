package com.ssafy.api.service;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.db.entity.Closet;

import java.util.List;

public interface ClosetService {
    boolean closetSave(ClosetSaveReq info);

    List<Closet> closetList(int profilePk);

    boolean closetDelete(int closetPk);
}
