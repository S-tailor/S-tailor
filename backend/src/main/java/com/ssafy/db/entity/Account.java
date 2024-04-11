package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
@Getter
@Setter
@ToString
public class Account {
    @Id
    int AccountPk;
    String name;
    String number;
    String password;
    Long balance;
    Date createAt;
    String imageUrl;
    Long goal;
    int userPk;
    String bankCode;

}
