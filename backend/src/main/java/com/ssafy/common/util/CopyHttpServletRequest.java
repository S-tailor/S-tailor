package com.ssafy.common.util;

import org.springframework.util.StreamUtils;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class CopyHttpServletRequest extends HttpServletRequestWrapper {
    private String body;
    public CopyHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        this.body = StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8);
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        return new CopyStringInputStream(this.body);
    }
}
