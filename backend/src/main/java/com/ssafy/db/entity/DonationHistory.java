package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Getter
@Setter
@ToString
@Entity
public class DonationHistory {
    @Id
    int donationHistoryPk;
    long amount;
    Date createAt;
    int userPk;
    int donationPk;
}
