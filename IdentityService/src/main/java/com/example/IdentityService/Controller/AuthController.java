package com.example.IdentityService.Controller;

import com.example.IdentityService.Config.SecurityUtil;
import com.example.IdentityService.Domain.ReqDTO.ReqDTO;
import com.example.IdentityService.Domain.ReqDTO.ResLoginDTO;
import com.example.IdentityService.Domain.ResDTO.UserDTO;
import com.example.IdentityService.Domain.User;
import com.example.IdentityService.Service.UserService;
import com.example.IdentityService.Util.ApiMessage;
import com.example.IdentityService.Util.error.IdInValidException;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.util.RequestUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class AuthController {
    private final UserService userService;
    private final SecurityUtil securityUtil;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private static final String RT_COOKIE = "refresh_token";
    private static final String RT_PATH   = "/api/auth";
    private final PasswordEncoder passwordEncoder;
    @Value("${imthang.jwt.refresh-token-validity-in-seconds:90000}")
    private long refreshTokenExpiration;
    public AuthController(UserService userService, AuthenticationManagerBuilder authenticationManagerBuilder,
                          SecurityUtil securityUtil,
                          PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtil = securityUtil;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/auth/register")
    @ApiMessage("Register Account")
    public ResponseEntity<UserDTO> register(@RequestBody User user) throws IdInValidException {
        if(this.userService.getUserByEmail(user.getUsername())!=null){
            throw new IdInValidException("User has been exists!");
        }
       UserDTO userDTO=this.userService.CreateUser(user);
//        this.emailService.sendLinkVerify(user.getEmail(), user.getFullname());
        return ResponseEntity.ok().body(userDTO);
    }
    @GetMapping("/auth/account")
    public ResponseEntity<UserDTO> getAccount(
            @RequestHeader("X-User-Email") String email
    ) {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/auth/login")
    @ApiMessage("Login Account")
    public ResponseEntity<ResLoginDTO> login(@RequestBody ReqDTO req,
                                             HttpServletRequest request) throws IdInValidException {

        UserDTO user = userService.getUserByEmail(req.getUsername());
        if (user == null) throw new IdInValidException("User hasn't exists!");

        var authenticationToken = new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword());
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        var res = new ResLoginDTO();
        res.setUserLogin(new ResLoginDTO.UserLogin(user.getId(), user.getName()));

        String accessToken = securityUtil.createAcessToken(authentication.getName(), res);
        res.setAccessToken(accessToken);

        String refreshToken = securityUtil.createRefreshToken(user.getName(), res);

        ResponseCookie rtCookie = ResponseCookie.from(RT_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path(RT_PATH)
                .maxAge(Duration.ofSeconds(refreshTokenExpiration))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, rtCookie.toString())
                .body(res);
    }
}
