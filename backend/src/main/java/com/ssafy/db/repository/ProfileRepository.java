package com.ssafy.db.repository;

import com.ssafy.db.entity.Profile;
import com.ssafy.db.join.ProfileList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

    @Query(value = "select profilePk from profile order by profilePk desc limit 1", nativeQuery = true)
    Integer getCount();

    Profile findByProfilePk(int profilePk);

    @Query(value = "select profilePk, image, profileName from profile where userPk = :userPk", nativeQuery = true)
    List<ProfileList> getProfileList(int userPk);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update profile " +
            "set profileName = :profileName, " +
            "image = :image, " +
            "height = :height, " +
            "weight = :weight, " +
            "gender = :gender " +
            "where profilePk = :profilePk", nativeQuery = true)
    int profileEdit(String profileName, String image, String height, String weight, String gender, int profilePk);
}
