package com.ssafy.api.service;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.api.request.ClosetSearchReq;
import com.ssafy.db.entity.Closet;
import org.json.simple.parser.ParseException;

import java.util.List;

public interface ClosetService {
    boolean closetSave(ClosetSaveReq info) throws ParseException;

    List<Closet> closetList(int profilePk);
    List<Closet> closetFilter(int profilePk, String category);

    boolean closetDelete(int closetPk);

    List<Closet> closetSearch(ClosetSearchReq info);

    Closet closetData(int closetPk);
}
