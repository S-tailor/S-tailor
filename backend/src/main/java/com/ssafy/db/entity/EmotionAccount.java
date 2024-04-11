package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
public class EmotionAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer emotionAccountPk;
    String memo;
    Date createAt;

    @ColumnDefault("false")
    @Column(columnDefinition = "TINYINT(1)")
    boolean isMarked;

    int emotionPk;
    int userPk;
    Integer emotionResultPk;
    public void toggleMarked() {
        this.isMarked = !this.isMarked;
    }
}
