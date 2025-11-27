package com.vox.projeto.vox.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginDTO(
        @JsonProperty(value = "username", access = JsonProperty.Access.WRITE_ONLY)
        @JsonAlias({"email", "username"}) // Aceita tanto "email" quanto "username"
        String username,

        @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY)
        @JsonAlias({"senha", "password"})
        String password
) {}