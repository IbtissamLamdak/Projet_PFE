package fr.norsys.gestionpatrimoine.exception;

import fr.norsys.gestionpatrimoine.exception.validation.ValidationErrorDetails;
import fr.norsys.gestionpatrimoine.exception.validation.ValidationFieldError;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> resourceNotFoundExceptionHandler(ResourceNotFoundException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.NOT_FOUND, e, webRequest);
    }
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorDetails> appExceptionHandler(AppException e, WebRequest webRequest) {
        return createErrorResponse(e.getStatus(), e, webRequest);
    }
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDetails> handleDataIntegrityViolation(DataIntegrityViolationException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, e, webRequest);
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleEntityNotFound(EntityNotFoundException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.NOT_FOUND, e, webRequest);
    }
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ErrorDetails> handleOptimisticLockingFailure(OptimisticLockingFailureException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.CONFLICT, e, webRequest);
    }
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorDetails> handleConstraintViolation(ConstraintViolationException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.BAD_REQUEST, e, webRequest);
    }
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorDetails> handleDataAccess(DataAccessException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e, webRequest);
    }
    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<ErrorDetails> handlePersistenceException(PersistenceException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e, webRequest);
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorDetails> accessDeniedExceptionHandler(AccessDeniedException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.UNAUTHORIZED, e, webRequest);
    }
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorDetails> methodArgumentTypeMismatchExceptionHandler(
            MethodArgumentTypeMismatchException e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, e, webRequest);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> globalExceptionHandler(Exception e, WebRequest webRequest) {
        return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, e, webRequest);
    }
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<ValidationFieldError> errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(fieldError -> new ValidationFieldError(fieldError.getField(), fieldError.getDefaultMessage()))
                .collect(Collectors.toList());

        return createValidationErrorResponse(errors);
    }
    @Override
    protected ResponseEntity<Object> handleTypeMismatch(TypeMismatchException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
               "Type mismatch request",
                request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, status);
    }
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                "Malformed JSON request",
                request.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, status);
    }
    private ResponseEntity<ErrorDetails> createErrorResponse(HttpStatus status, Exception e, WebRequest webRequest) {
        ErrorDetails errorDetails = new ErrorDetails(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                e.getMessage(),
                webRequest.getDescription(false)
        );
        return new ResponseEntity<>(errorDetails, status);
    }
    private ResponseEntity<Object> createValidationErrorResponse(List<ValidationFieldError> validationFieldErrors) {
        ValidationErrorDetails validationErrorDetails = new ValidationErrorDetails(
                4000,
                "Validation failed",
                validationFieldErrors
        );
        return new ResponseEntity<>(validationErrorDetails, HttpStatus.BAD_REQUEST);
    }
}
