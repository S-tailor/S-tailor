package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.transaction.Transactional;

@Getter
@Setter
@Transactional
@Entity
public class EmotionResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int emotionResultPk;
    String fear;
    String surprise;
    String angry;
    String sadness;
    String neutral;
    String happiness;
    String disgust;
}
