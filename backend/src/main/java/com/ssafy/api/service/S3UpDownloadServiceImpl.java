package com.ssafy.api.service;


import java.io.IOException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;


@Service("S3UpDownloadService")
public class S3UpDownloadServiceImpl implements S3UpDownloadService{

    @Autowired
    private AmazonS3 amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.credentials.access-key}")
    private String key;

    @Value("${cloud.aws.cloudfront.url}")
    private String cloudfrontUrl;

    @Override
    public String saveProfileImage(@RequestParam MultipartFile multipartFile,String fileName,int profilePk) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());


        try {
            amazonS3Client.putObject(bucket, "S-Tailor/profileImg/"+profilePk+"/"+fileName, multipartFile.getInputStream(), metadata);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return cloudfrontUrl+"S-Tailor/profileImg/"+profilePk+"/"+fileName;
    }

    public Map<String, Object> getFile(String s3FileName) throws IOException{
        Map<String, Object> map = new HashMap<>();
        String extension = s3FileName.substring(s3FileName.lastIndexOf(".") + 1);

        S3Object o = amazonS3Client.getObject(new GetObjectRequest(bucket, s3FileName));
        S3ObjectInputStream objectInputStream = o.getObjectContent();
        byte[] bytes = IOUtils.toByteArray(objectInputStream);

        String fileName = URLEncoder.encode(s3FileName, "UTF-8").replaceAll("\\+", "%20");
        HttpHeaders httpHeaders = new HttpHeaders();
        if(extension.equals("JPG") || extension.equals("JPEG") || extension.equals("PNG") || extension.equals("GIF"))
            httpHeaders.setContentType(MediaType.IMAGE_PNG);
        else
            httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        httpHeaders.setContentLength(bytes.length);
        httpHeaders.setContentDispositionFormData("attachment", fileName);

        map.put("bytes",bytes);
        map.put("headers",httpHeaders);
        return map;

    }

    @Override
    public String imageSearchUpload(MultipartFile image) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(image.getSize());
        metadata.setContentType(image.getContentType());


        try {
            amazonS3Client.putObject(bucket, "S-Tailor/searchImg/"+image.getOriginalFilename(), image.getInputStream(), metadata);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return cloudfrontUrl+"S-Tailor/searchImg/"+image.getOriginalFilename();
    }

    @Override
    public String saveTryOnModelImage(MultipartFile file, int profilePk) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        String type = file.getContentType().split("/")[1];

        LocalDate now = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy_MM_dd");
        String timeString = now.format(formatter);

        LocalTime date = LocalTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH_mm_ss");
        String dateString = date.format(dateTimeFormatter);

        try {
            amazonS3Client.putObject(bucket, "S-Tailor/TryOnModel/"+profilePk+"/" + dateString + "_" + timeString + "_model." +type, file.getInputStream(), metadata);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return cloudfrontUrl+"S-Tailor/TryOnModel/"+profilePk+ "/" + dateString + "_" + timeString + "_model." +type;
    }

    @Override
    public String imageChatUpload(MultipartFile image, String profile) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(image.getSize());
        metadata.setContentType(image.getContentType());


        try {
            amazonS3Client.putObject(bucket, "S-Tailor/chatImg/"+profile+"/"+image.getOriginalFilename(), image.getInputStream(), metadata);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return image.getOriginalFilename();
    }
}
