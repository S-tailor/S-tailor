package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@ToString
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int purchasePk;
    Long price;
}
