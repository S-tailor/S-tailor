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
public class OriginalAccount {
    @Id
    int originalAccountPk;
    String bankCode;
    String number;
    long availableAmt;
    int userPk;
}
