package fr.norsys.gestionpatrimoine.exception.validation;

public record ValidationFieldError(
        String field,
        String message
) {
}
