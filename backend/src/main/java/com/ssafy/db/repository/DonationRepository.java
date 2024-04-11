package com.ssafy.db.repository;

import com.ssafy.db.entity.Donation;
import com.ssafy.db.join.GetDonationRecommend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    @Query(value = "select d.name, d.imageUrl, d.currentAmount from Donation d\n" +
            "join Emotion e\n" +
            "on d.emotion = e.emotionPk\n" +
            "where e.kind = :kind",nativeQuery = true)
    List<GetDonationRecommend> donationRecommend(String kind);

    @Query(value = "select d.name, d.imageUrl, d.currentAmount from Donation d\n" +
            "join Emotion e\n" +
            "on d.emotion = e.emotionPk\n"
            ,nativeQuery = true)
    List<GetDonationRecommend> donationRecommendAll();
    Donation findByName(String name);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Donation set currentAmount = :currentAmount where donationPk = :donationPk", nativeQuery = true)
    int updateAmount(long currentAmount, int donationPk);
}
