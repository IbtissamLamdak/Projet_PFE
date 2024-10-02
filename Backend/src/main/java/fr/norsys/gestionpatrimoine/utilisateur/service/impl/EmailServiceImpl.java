package fr.norsys.gestionpatrimoine.utilisateur.service.impl;

import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.utilisateur.service.EmailService;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    public static final String EMAIL_VERIFICATION_TEMPLATE = "email-verification-template";
    public static final String SUBJECT_VERIFICATION_EMAIL = "Please verify your email address";
    public static final String UTF_8_ENCODING = "UTF-8";
    @Value("${EMAIL_ID}")
    private String emailHost;
    @Value("${BASE_URL_FRONT_END}")
    private String baseUrl;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    @Override
    @Async
    public void sendVerificationEmail(String username, String email, String verificationToken) {
        try {
            Context context = new Context();
            context.setVariable("url", getVerificationUrl(verificationToken));
            String text = templateEngine.process(EMAIL_VERIFICATION_TEMPLATE, context);
            MimeMessage mimeMessage = new MimeMessage(mailSender.createMimeMessage().getSession());
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, UTF_8_ENCODING);
            helper.setPriority(1);
            helper.setFrom(emailHost);
            helper.setTo(email);
            helper.setSubject(SUBJECT_VERIFICATION_EMAIL);
            helper.setText(text, true);
            mailSender.send(mimeMessage);
        }catch (MessagingException e) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
    private String getVerificationUrl(String verificationToken) {
        return baseUrl + "/api/utilisateurs/verify?token=" + verificationToken;
    }
}
