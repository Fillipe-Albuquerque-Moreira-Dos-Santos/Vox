package com.vox.projeto.vox.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private String extractPath(WebRequest request) {
        return request.getDescription(false).replace("uri=", "");
    }

    private ErrorResponse buildErrorResponse(
            Throwable ex,
            HttpStatus status,
            String error,
            String message,
            String path
    ) {
        ErrorResponse.Builder builder = ErrorResponse.builder(ex, status, message);
        builder.detail(message);
        builder.title(error);

        var problemDetail = builder.build().getBody();
        problemDetail.setProperty("timestamp", LocalDateTime.now());
        problemDetail.setProperty("path", path);

        return builder.build();
    }

    /**
     * 404 - Recurso não encontrado
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        log.error("Recurso não encontrado: {}", ex.getMessage());

        ErrorResponse error = buildErrorResponse(
                ex,
                HttpStatus.NOT_FOUND,
                "Recurso não encontrado",
                ex.getMessage(),
                extractPath(request)
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * 400 - Erro de regra de negócio
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException ex, WebRequest request) {

        log.error("Erro de negócio: {}", ex.getMessage());

        ErrorResponse error = buildErrorResponse(
                ex,
                HttpStatus.BAD_REQUEST,
                "Erro de negócio",
                ex.getMessage(),
                extractPath(request)
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 403 - Acesso negado
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {

        log.error("Acesso não autorizado: {}", ex.getMessage());

        ErrorResponse error = buildErrorResponse(
                ex,
                HttpStatus.FORBIDDEN,
                "Acesso negado",
                ex.getMessage(),
                extractPath(request)
        );

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * 400 - Erros de validação
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {

        log.error("Erro de validação: {}", ex.getMessage());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult()
                .getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        ValidationErrorResponse error = ValidationErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de validação")
                .message("Dados inválidos")
                .path(extractPath(request))
                .errors(errors)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 400 - ValidationException customizada
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleCustomValidationException(
            ValidationException ex, WebRequest request) {

        log.error("Erro de validação customizado: {}", ex.getMessage());

        ValidationErrorResponse error = ValidationErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de validação")
                .message(ex.getMessage())
                .path(extractPath(request))
                .errors(ex.getErrors())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * 500 - Erros não tratados
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {

        log.error("Erro interno do servidor", ex);

        ErrorResponse error = buildErrorResponse(
                ex,
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Erro interno do servidor",
                "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
                extractPath(request)
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
