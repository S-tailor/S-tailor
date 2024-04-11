package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
public class EmotionAccountHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int emotionAccountHistoryPk;

    int transactionPk;
    int emotionAccountPk;
    int userPk;
}
