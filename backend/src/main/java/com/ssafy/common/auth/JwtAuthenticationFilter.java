package com.ssafy.common.auth;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Objects;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ssafy.common.util.CopyHttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ssafy.api.service.UserService;
import com.ssafy.common.util.JwtTokenUtil;
import com.ssafy.common.util.ResponseBodyWriteUtil;
import com.ssafy.db.entity.User;

/**
 * 요청 헤더에 jwt 토큰이 있는 경우, 토큰 검증 및 인증 처리 로직 정의.
 */
public class JwtAuthenticationFilter extends BasicAuthenticationFilter {
	private UserService userService;
	
	public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserService userService) {
		super(authenticationManager);
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
//        String uri = request.getRequestURI();
//        CopyHttpServletRequest copyHttpServletRequest = new CopyHttpServletRequest(request);

//        request.getInputStream();

//        if((uri.equals("/api/user/login") ||
//                uri.equals("/api/user/create")
//        )) {
//            filterChain.doFilter(copyHttpServletRequest, response);
//            return;
//        }
//
//        String header = request.getHeader(JwtTokenUtil.HEADER_STRING);
//
//        try {
//            // If header is present, try grab user principal from database and perform authorization
//            Authentication authentication = getAuthentication(copyHttpServletRequest);
//            // jwt 토큰으로 부터 획득한 인증 정보(authentication) 설정.
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//        } catch (Exception ex) {
//            ResponseBodyWriteUtil.sendError(copyHttpServletRequest, response, ex);
//            return;
//        }

        filterChain.doFilter(request, response);
	}
	
	@Transactional(readOnly = true)
    public Authentication getAuthentication(HttpServletRequest request) throws Exception {
        String token = request.getHeader(JwtTokenUtil.HEADER_STRING);
        // 요청 헤더에 Authorization 키값에 jwt 토큰이 포함된 경우에만, 토큰 검증 및 인증 처리 로직 실행.
        if (token != null) {
            // parse the token and validate it (decode)
            JWTVerifier verifier = JwtTokenUtil.getVerifier();
            JwtTokenUtil.handleError(token);
            DecodedJWT decodedJWT = verifier.verify(token.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
            String userId = decodedJWT.getSubject();
            
            // Search in the DB if we find the user by token subject (username)
            // If so, then grab user details and create spring auth token using username, pass, authorities/roles
            if (userId != null) {
                    // jwt 토큰에 포함된 계정 정보(userId) 통해 실제 디비에 해당 정보의 계정이 있는지 조회.
            		User user = userService.getUserByUserId(userId);
                if(user != null) {
                        // 식별된 정상 유저인 경우, 요청 context 내에서 참조 가능한 인증 정보(jwtAuthentication) 생성.
                		SsafyUserDetails userDetails = new SsafyUserDetails(user);
                		UsernamePasswordAuthenticationToken jwtAuthentication = new UsernamePasswordAuthenticationToken(userId,
                				null, userDetails.getAuthorities());
                		jwtAuthentication.setDetails(userDetails);
                		return jwtAuthentication;
                }
            }
            return null;
        }
        return null;
    }
}
