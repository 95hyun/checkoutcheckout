package com.toy.checkoutcheckout.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@TestConfiguration
@Profile("test")
public class TestRedisConfiguration {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // 테스트용 Redis 연결 팩토리 생성 (실제 연결하지 않음)
        return new LettuceConnectionFactory();
    }
}
