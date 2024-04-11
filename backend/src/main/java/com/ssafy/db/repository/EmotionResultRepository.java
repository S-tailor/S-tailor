package com.ssafy.db.repository;

import com.ssafy.db.entity.Emotion;
import com.ssafy.db.entity.EmotionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmotionResultRepository extends JpaRepository<EmotionResult, Long> {

}
