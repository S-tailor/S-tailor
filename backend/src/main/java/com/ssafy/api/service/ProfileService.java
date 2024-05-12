package com.ssafy.api.service;

import com.ssafy.api.request.ProfileCreateReq;
import com.ssafy.db.entity.Profile;
import com.ssafy.db.join.ProfileList;

import java.io.IOException;
import java.util.List;

public interface ProfileService {
    Profile profileCreate(ProfileCreateReq info) throws IOException;

    Profile profileSelect(int profilePk);

    List<ProfileList> profileList(String id);

    boolean profileEdit(ProfileCreateReq info);
}
