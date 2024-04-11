package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@Setter
@ToString
@Entity
public class Donation {

    @Id
    int donationPk;
    String name;
    String imageUrl;
    long currentAmount;
    int emotion;


}
