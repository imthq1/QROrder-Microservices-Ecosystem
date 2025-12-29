package com.example.ApiGateway.Config;

import com.example.ApiGateway.Domain.RestResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.server.ServerAuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Optional;


@Component
public class CustomAuthenticationEntryPoint implements ServerAuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public CustomAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Mono<Void> commence(ServerWebExchange exchange,
                               AuthenticationException ex) {

        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        RestResponse<Object> restResponse = new RestResponse<>();

        String errorMessage = Optional.ofNullable(ex.getCause())
                .map(Throwable::getMessage)
                .orElse(ex.getMessage());

        if (errorMessage != null && errorMessage.toLowerCase().contains("expired")) {
            response.setStatusCode(HttpStatus.FORBIDDEN);
            restResponse.setStatusCode(HttpStatus.FORBIDDEN.value());
            restResponse.setError("Token đã hết hạn");
            restResponse.setMessage("Vui lòng đăng nhập lại hoặc làm mới token.");
        } else {
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            restResponse.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            restResponse.setError("UNAUTHORIZED");
            restResponse.setMessage("Token không hợp lệ hoặc không tồn tại.");
        }

        byte[] bytes;
        try {
            bytes = objectMapper.writeValueAsBytes(restResponse);
        } catch (JsonProcessingException e) {
            return Mono.error(e);
        }

        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }
}
