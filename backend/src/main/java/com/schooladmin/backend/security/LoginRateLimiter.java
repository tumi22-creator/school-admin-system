package com.schooladmin.backend.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginRateLimiter {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean isAllowed(String key) {

        Bucket bucket = buckets.computeIfAbsent(key, k -> createBucket());

        return bucket.tryConsume(1);
    }

    private Bucket createBucket() {

        Refill refill = Refill.intervally(5, Duration.ofMinutes(1));

        Bandwidth limit = Bandwidth.classic(5, refill);

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}