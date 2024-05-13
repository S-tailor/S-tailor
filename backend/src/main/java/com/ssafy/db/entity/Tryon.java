package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Getter
@Setter
@ToString
@Entity
public class Tryon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int tryonPk;
    String generatedImage;
    int profilePk;
    int closetPk;
}
