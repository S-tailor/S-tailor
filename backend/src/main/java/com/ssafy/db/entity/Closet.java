package com.ssafy.db.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@ToString
public class Closet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int closetPk;
    String link;
    String image;
    String price;
    Timestamp date;
    String name;
    String category;
    String source;
    boolean cart;
    boolean isDelete;
    int profilePk;
}
