-- utilisateurs
INSERT INTO utilisateurs (email, is_actif, password, role, username) values ('admin@gmail.com', true, 'admin', 'ADMIN', 'admin');

-- agences
INSERT INTO agence (adresse, description, latitude, localisation, longitude, nom, pays, ville) values ('Haut founty, Immeuble Haut founty, 2ème étage, Bureaux 203 et 204', 'NORSYS Afrique Agadir', '30.402716026598718', 'Haut founty, Immeuble Haut founty, 2ème étage, Bureaux 203 et 204', '-9.577728157955175', 'NORSYS Afrique Agadir', 'MAROC', 'AGADIR');

-- plateau
INSERT INTO plateau (capacity, floor, has_kitchen, has_meeting_room, has_restroom, name, agence_id) values (10, 2, false, false, true, 'Bureau 203', '1');
INSERT INTO plateau (capacity, floor, has_kitchen, has_meeting_room, has_restroom, name, agence_id) values (20, 2, true, true, true, 'Bureau 204', '1');

-- actif categories
INSERT INTO actif_categorie (nom) VALUES ('ECRAN');
INSERT INTO actif_categorie (nom) VALUES ('PC');

-- -- consommable categories
INSERT INTO consommable_categorie (nom) values ('PAPIER');
INSERT INTO consommable_categorie (nom) values ('AUTRE');


