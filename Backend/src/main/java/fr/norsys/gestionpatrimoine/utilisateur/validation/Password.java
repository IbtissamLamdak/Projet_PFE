package fr.norsys.gestionpatrimoine.utilisateur.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Password {
    String PASSWORD_MESSAGE = "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre";
    String message() default PASSWORD_MESSAGE;
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
