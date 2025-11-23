# WorkSphere - Gestion Interactive du Personnel

## Description

**WorkSphere** est une application web innovante dédiée à la gestion visuelle et interactive du personnel au sein des espaces de travail. Elle permet de faciliter l'organisation et la répartition des employés sur un plan d'étage en temps réel, tout en intégrant les contraintes liées aux rôles et aux zones autorisées.

##  Fonctionnalités Principales

-  **Visualisation interactive** : Plan d'étage dynamique avec représentation graphique des différentes zones
-  **Gestion du personnel** : Affectation et suivi des employés en temps réel
-  **Contrôle d'accès** : Gestion des autorisations selon les rôles et zones
-  **Drag & Drop** : Interface intuitive pour déplacer les employés entre les zones
-  **Tableau de bord** : Vue d'ensemble de la répartition du personnel
-  **Temps réel** : Mise à jour instantanée des affectations

##  Structure du Projet

```
WORKSPACE/
│
├── assets/
│   ├── CSS/           # Feuilles de style
│   ├── IMAGES/        # Ressources graphiques
│   └── JS/            # Scripts JavaScript
│
└── index.html         # Page principale
│
└── README.md          # Documentation
```


##  Utilisation

### Gestion des Employés

1. **Ajouter un employé** : Cliquez sur "Ajouter un employé" et remplissez le formulaire
2. **Modifier un employé** : Cliquez sur "Modifier" à côté de l'employé et mettez à jour les informations
3. **Affecter à une zone** : Glissez-déposez l'employé sur la zone souhaitée
4. **Modifier une affectation** : Déplacez l'employé vers une nouvelle zone
5. **Retirer d'une zone** : Déplacez l'employé hors de la zone ou cliquez sur "Retirer"

### Rôles et Accès

| Rôle | Zones Autorisées |
|------|------------------|
| **Manager** | Toutes les zones |
| **Agent de sécurité** | Salle de sécurité, zones communes |
| **Réceptionniste** | Réception, zones communes |
| **Technicien IT** | Salle des serveurs, zones techniques |
| **Autres rôles** | Zones communes uniquement |
| **Nettoyage** | Toutes sauf archives |

## 🛠️ Technologies Utilisées

- **HTML5** : Structure de l'application
- **CSS3** : Stylisation et responsive design
- **JavaScript (Vanilla)** : Logique métier et interactivité
- **LocalStorage** : Persistance des données (optionnel)

## 📁 Organisation des Fichiers

### CSS/
- `style.css` : Styles principaux
- `responsive.css` : Styles pour la réactivité

### JS/
- `script.js` : Logique principale de l'application
