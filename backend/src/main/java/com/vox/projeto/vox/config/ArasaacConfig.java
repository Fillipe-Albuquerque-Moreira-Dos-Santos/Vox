//package com.vox.projeto.vox.config;
//
//import org.springframework.boot.web.client.RestTemplateBuilder;
//import org.springframework.cache.CacheManager;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.client.ClientHttpRequestFactory;
//import org.springframework.http.client.SimpleClientHttpRequestFactory;
//import org.springframework.web.client.RestTemplate;
//
//import java.time.Duration;
//
///**
// * Configuração para integração com API ARASAAC
// */
//@Configuration
//@EnableCaching
//public class ArasaacConfig {
//
//    /**
//     * RestTemplate configurado para chamadas à API ARASAAC
//     */
//    @Bean
//    public RestTemplate restTemplate(RestTemplateBuilder builder) {
//        return builder
//                .setConnectTimeout(Duration.ofSeconds(5))
//                .setReadTimeout(Duration.ofSeconds(10))
//                .requestFactory(this::clientHttpRequestFactory)
//                .build();
//    }
//
//    /**
//     * Request factory com configurações personalizadas
//     */
//    private ClientHttpRequestFactory clientHttpRequestFactory() {
//        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
//        factory.setConnectTimeout(5000); // 5 segundos
//        factory.setReadTimeout(10000);   // 10 segundos
//        return factory;
//    }
//
//    /**
//     * Cache Manager para armazenar resultados das buscas
//     *
//     * Caches:
//     * - arasaac-search: Busca por palavra-chave (30 min)
//     * - arasaac-pictogram: Pictograma por ID (1 hora)
//     * - arasaac-category: Busca por categoria (30 min)
//     */
//    @Bean
//    public CacheManager cacheManager() {
//        return new ConcurrentMapCacheManager(
//                "arasaac-search",
//                "arasaac-pictogram",
//                "arasaac-category"
//        );
//    }
//}