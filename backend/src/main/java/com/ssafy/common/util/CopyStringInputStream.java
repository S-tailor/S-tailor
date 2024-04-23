package com.ssafy.common.util;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

public class CopyStringInputStream extends ServletInputStream {

    private InputStream copyBodyInputStream;

    public CopyStringInputStream(String body) {
        this.copyBodyInputStream = new ByteArrayInputStream(body.getBytes());
    }

    @Override
    public boolean isFinished() {
        try {
            return copyBodyInputStream.available() == 0;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean isReady() {
        return true;
    }

    @Override
    public void setReadListener(ReadListener readListener) {

    }

    @Override
    public int read() throws IOException {
        return this.copyBodyInputStream.read();
    }
}
