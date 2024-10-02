package fr.norsys.gestionpatrimoine;

import fr.norsys.gestionpatrimoine.auth.enums.Role;
import fr.norsys.gestionpatrimoine.utilisateur.entity.Utilisateur;
import fr.norsys.gestionpatrimoine.utilisateur.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableAsync
@RequiredArgsConstructor
public class GestionPatrimoineApplication implements CommandLineRunner {
	private final UtilisateurRepository utilisateurRepository;
	private final PasswordEncoder passwordEncoder;
	public static void main(String[] args) {
		SpringApplication.run(GestionPatrimoineApplication.class, args);
	}
	@Override
	public void run(String... args) throws Exception {
		createUserAdmin();
	}
	void createUserAdmin() {
		if(utilisateurRepository.existsUtilisateurByEmail("admin@gmail.com"))
			return;

		Utilisateur admin = new Utilisateur();
		admin.setUsername("admin");
		admin.setEmail("admin@gmail.com");
		admin.setPassword(passwordEncoder.encode("admin"));
		admin.setRole(Role.ADMIN);
		admin.setActif(true);

		utilisateurRepository.save(admin);
	}
}
