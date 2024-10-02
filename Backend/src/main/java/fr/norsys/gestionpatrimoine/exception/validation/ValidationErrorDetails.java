package fr.norsys.gestionpatrimoine.exception.validation;

import java.util.List;
import java.util.Map;

public record ValidationErrorDetails(
        int errorCode,
        String errorMessage,
        List<ValidationFieldError> validationErrors
) {
}
