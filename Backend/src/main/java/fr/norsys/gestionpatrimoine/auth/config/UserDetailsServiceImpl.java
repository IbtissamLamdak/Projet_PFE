package fr.norsys.gestionpatrimoine.auth.config;

import fr.norsys.gestionpatrimoine.auth.entity.UserModel;
import fr.norsys.gestionpatrimoine.exception.ResourceNotFoundException;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import fr.norsys.gestionpatrimoine.utilisateur.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // get utilisateur by username from database
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("Utilisateur", "username", username)
        );
        return new UserModel(
                utilisateur.getUsername(),
                utilisateur.getPassword(),
                utilisateur.getRole(),
                utilisateur.isActif()
        );
    }
}
