package fr.norsys.gestionpatrimoine.utilisateur.service.impl;

import fr.norsys.gestionpatrimoine.auth.entity.Token;
import fr.norsys.gestionpatrimoine.auth.repository.TokenRepository;
import fr.norsys.gestionpatrimoine.collaborateur.entity.Collaborateur;
import fr.norsys.gestionpatrimoine.collaborateur.repository.CollaborateurRepository;
import fr.norsys.gestionpatrimoine.exception.AppException;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.utilisateur.dto.*;
import fr.norsys.gestionpatrimoine.utilisateur.entity.AccountVerification;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import fr.norsys.gestionpatrimoine.utilisateur.mapper.UtilisateurMapper;
import fr.norsys.gestionpatrimoine.utilisateur.repository.AccountVerificationRepository;
import fr.norsys.gestionpatrimoine.utilisateur.repository.UtilisateurRepository;
import fr.norsys.gestionpatrimoine.utilisateur.service.EmailService;
import fr.norsys.gestionpatrimoine.utilisateur.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountVerificationRepository accountVerificationRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final CollaborateurRepository collaborateurRepository;

    @Override
    @Transactional
    public UtilisateurDtoResponse create(UtilisateurDtoRequest request) {
        Utilisateur utilisateur = UtilisateurMapper.toEntity(request);
        utilisateur.setId(0L);
        utilisateur.setActif(false);

        // check if utilisateur exist in database
        if(utilisateurRepository.existsUtilisateurByEmail(utilisateur.getEmail())) {
            throw new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "Utilisatuer déja exist");
        }

        // encode password
        utilisateur.setPassword(passwordEncoder.encode(request.password()));

        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);

        // get verification token
        String verificationToken = getVerificationToken();

        // create and save account verification
        AccountVerification accountVerification = new AccountVerification();
        accountVerification.setToken(verificationToken);

        // assign account verification to utilisateur
        accountVerification.setUtilisateur(savedUtilisateur);

        accountVerificationRepository.save(accountVerification);

        // send verification mail to utilisateur
        emailService.sendVerificationEmail(utilisateur.getUsername(), utilisateur.getEmail(), verificationToken);

        return UtilisateurMapper.toDto(savedUtilisateur);
    }
    @Override
    public void verifyUser(String token) {
        // get utilisateur by verification token
        Utilisateur utilisateur = findUtilisateurByVerificationToken(token);

        if(utilisateur != null) {
            utilisateur.setActif(true);
            utilisateurRepository.save(utilisateur);
        }
    }
    @Override
    public UtilisateurDtoResponse update(Long utilisateurId, UtilisateurDtoUpdate request) {
        Utilisateur utilisateur = getUtilisateur(utilisateurId);

        // update utilisateur
        if(StringUtils.hasText(request.username()))
            utilisateur.setUsername(request.username());
        if(StringUtils.hasText(request.email()))
            utilisateur.setEmail(request.email());
        if(request.isActif() != utilisateur.isActif()) {
            utilisateur.setActif(request.isActif());
        }
        if(request.role() != null && StringUtils.hasText(request.role().name())) {
            utilisateur.setRole(request.role());
        }
        // save updated utilisateur in database
        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);

        return UtilisateurMapper.toDto(updatedUtilisateur);
    }
    @Override
    public void assignUserToCollaborateur(Long utilisateurId, AssignCollabDto request) {
        // get utilisateur from db
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId).orElseThrow(
                () -> new ResourceNotFoundException("Utilisateur", "id", utilisateurId.toString())
        );
        // get collaborateur from db
        Collaborateur collaborateur = collaborateurRepository.findById(request.collaborateurId()).orElseThrow(
                () -> new ResourceNotFoundException("Collaborateur", "id", request.collaborateurId().toString())
        );
        if(utilisateur.getCollaborateur() != null && utilisateur.getCollaborateur().getId() != null && !collaborateur.getUtilisateur().getId().equals(utilisateurId)) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Collaborateur already assigned to other suer");
        }
        // assgin user to collaborateur
        utilisateur.setCollaborateur(collaborateur);

        // save updated utilisateur in database
        utilisateurRepository.save(utilisateur);
    }
    @Override
    public void resetPassword(Long id, ResetPasswordDto request) {
        Utilisateur utilisateur = getUtilisateur(id);

        if(passwordEncoder.matches(request.newPassword(), utilisateur.getPassword()) || !request.newPassword().equals(request.confirmNewPassword())) {
            throw new AppException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "An error occurred while updating the user's password. " +
                    "The new password must not match the current password, " +
                    "and the new password and confirmation password must match");
        }

        utilisateur.setPassword(passwordEncoder.encode(request.newPassword()));

        utilisateurRepository.save(utilisateur);
    }
    @Override
    public UtilisateurDtoResponse getById(Long id) {
        // get utilisateur from database
        Utilisateur utilisateur = utilisateurRepository.findById(id).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Utilisateur n'existe pas")
        );
        return UtilisateurMapper.toDto(utilisateur);
    }
    @Override
    public UtilisateurDtoResponse getByUsername(String username) {
        // get utilisateur from database
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Utilisateur n'existe pas")
        );
        return UtilisateurMapper.toDto(utilisateur);
    }
    @Override
    public UtilisateurDtoResponse getByEmail(String email) {
        // get utilisateur from database
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Utilisateur n'existe pas")
        );
        return UtilisateurMapper.toDto(utilisateur);
    }
    @Override
    public List<UtilisateurDtoResponse> getAll() {
        // get all utilisateurs from databse
        List<Utilisateur> utilisateurs = utilisateurRepository.findAll();

        return utilisateurs.stream().map(UtilisateurMapper::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public void delete(Long utilisateurId) {
        Utilisateur utilisateur = getUtilisateur(utilisateurId);

        // TODO check if there is collaborateur has relation with this utilisateur

        // delete utilisateur from database
        utilisateurRepository.delete(utilisateur);
    }
    private Utilisateur getUtilisateur(Long utilisateurId) {
        // get utilisateur from database
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId).orElseThrow(
                () -> new AppException(HttpStatus.NOT_FOUND, "Utilisateur n'existe pas")
        );

        List<Token> tokens = utilisateur.getTokens();
        tokens.forEach(token -> {
            token.setRevoked(true);
            token.setExpired(true);
            token.setUtilisateur(null);
        });

        tokenRepository.saveAll(tokens);

        return utilisateur;
    }
    private String getVerificationToken() {
        return UUID.randomUUID().toString();
    }
    private Utilisateur findUtilisateurByVerificationToken(String token) {
        // get verification token from database
        AccountVerification accountVerification = accountVerificationRepository.findByToken(token).orElseThrow(
                () -> new ResourceNotFoundException("Account verification", "token", token)
        );
        return accountVerification.getUtilisateur();
    }
}
