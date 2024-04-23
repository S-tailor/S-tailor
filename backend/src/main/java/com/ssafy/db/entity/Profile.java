package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.stereotype.Service;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Setter
@Getter
@ToString
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int profilePk;
    String profileName;
    String image;
    String height;
    String weight;
    String gender;
    int userPk;
}
