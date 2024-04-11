package com.ssafy.db.repository;

import com.ssafy.db.entity.Donation;
import com.ssafy.db.entity.DonationHistory;
import com.ssafy.db.join.GetDonationHistory;
import com.ssafy.db.join.GetDonationRecommend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {

    @Query(value = "select dh.createAt, dh.amount, d.name, d.imageUrl from DonationHistory dh " +
            "join Donation d " +
            "on dh.donationPk = d.donationPk " +
            "where dh.userPk = :userPk",nativeQuery = true)
    List<GetDonationHistory> getDonationHistory(int userPk);
}
