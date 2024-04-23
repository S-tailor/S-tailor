package com.ssafy.api.service;

import com.ssafy.api.request.ClosetSaveReq;
import com.ssafy.db.entity.Closet;
import com.ssafy.db.repository.ClosetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClosetServiceImpl implements ClosetService{
    @Autowired
    ClosetRepository closetRepository;

    @Override
    public boolean closetSave(ClosetSaveReq info) {
        Closet closet = new Closet();

        closet.setLink(info.getLink());
        closet.setPrice(info.getPrice());
        closet.setImage(info.getThumbNail());
        closet.setName(info.getName());
        closet.setProfilePk(info.getProfilePk());

        try {
            closetRepository.save(closet);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    @Override
    public List<Closet> closetList(int profilePk) {
        try {
            return closetRepository.findAllByProfilePkAndIsDelete(profilePk, false);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean closetDelete(int closetPk) {
        try {
            if(closetRepository.closetDelete(closetPk) == 1) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}
