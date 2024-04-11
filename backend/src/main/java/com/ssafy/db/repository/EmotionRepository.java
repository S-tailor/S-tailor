package com.ssafy.db.repository;

import com.ssafy.db.entity.Emotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmotionRepository extends JpaRepository<Emotion, Long> {

    @Query("SELECT emotionPk " +
            "FROM Emotion " +
            "WHERE kind = :kind")
    int getEmotionPkByKind(String kind);

}
