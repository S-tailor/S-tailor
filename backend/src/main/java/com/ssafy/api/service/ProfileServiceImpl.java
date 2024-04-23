package com.ssafy.api.service;

import com.ssafy.api.request.ProfileCreateReq;
import com.ssafy.db.entity.Profile;
import com.ssafy.db.entity.User;
import com.ssafy.db.join.ProfileList;
import com.ssafy.db.repository.ProfileRepository;
import com.ssafy.db.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProfileServiceImpl implements ProfileService{
    @Autowired
    S3UpDownloadService s3UpDownloadService;

    @Autowired
    ProfileRepository profileRepository;

    @Autowired
    UserService userService;

    @Override
    public boolean profileCreate(ProfileCreateReq info) {
        Profile profile = new Profile();
        profile.setProfileName(info.getName());
        profile.setHeight(info.getHeight());
        profile.setWeight(info.getWeight());

        profile.setGender(info.getGender());
        profile.setUserPk(info.getUserPk());

        try {
            MultipartFile image = info.getImage();
            profile.setImage(s3UpDownloadService.saveProfileImage(image,image.getOriginalFilename(),profileRepository.getCount()+1));
            profileRepository.save(profile);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    @Override
    public Profile profileSelect(int profilePk) {
        try {
            return profileRepository.findByProfilePk(profilePk);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public List<ProfileList> profileList(String id) {
        try {
            User user = userService.getUserByUserId(id);
            return profileRepository.getProfileList(user.getUserPk());
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean profileEdit(ProfileCreateReq info) {
        try {
            String image = s3UpDownloadService.saveProfileImage(info.getImage(), info.getImage().getOriginalFilename(), info.getProfilePk());
            profileRepository.profileEdit(info.getName(), image, info.getHeight(), info.getWeight(), info.getGender(), info.getProfilePk());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
