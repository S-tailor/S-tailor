package com.ssafy.db.repository;

import com.ssafy.db.entity.EmotionAccount;
import com.ssafy.db.entity.EmotionAccountHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionAccountHistoryRepository extends JpaRepository<EmotionAccountHistory, Long> {

}
