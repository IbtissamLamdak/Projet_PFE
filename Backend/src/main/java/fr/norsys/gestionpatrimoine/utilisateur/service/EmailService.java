package fr.norsys.gestionpatrimoine.utilisateur.service;

public interface EmailService {
    void sendVerificationEmail(String username, String email, String verificationToken);
}
