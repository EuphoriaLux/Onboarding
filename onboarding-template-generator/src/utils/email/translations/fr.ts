// src/utils/email/translations/fr.ts
import { Translations } from '../types';

/**
 * French translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': 'Intégration du Plan de Support {tier} pour {company} - Configuration Administrative Microsoft 365',
  'greeting': 'Cher/Chère {name},',
  'intro1': 'Merci d\'avoir choisi {company} comme partenaire d\'administration Microsoft 365. Nous sommes ravis de commencer le processus d\'intégration pour {clientCompany}.',
  'intro2': 'Vous trouverez ci-dessous les étapes importantes pour compléter votre processus d\'intégration. Veuillez examiner attentivement chaque section et suivre les instructions pour configurer votre Plan de Support {tier} et les configurations d\'accès nécessaires.',
  'closing': 'Veuillez répondre à cet e-mail pour confirmer sa réception et nous faire part de vos questions ou préoccupations.',
  'regards': 'Cordialement,',
  'footer': 'Ceci est un message généré automatiquement par le Générateur de Modèles d\'Intégration Microsoft.',
  
  // Section titles
  'supportPlanTitle': 'DÉTAILS DU PLAN DE SUPPORT {tier}',
  'authorizedContactsTitle': 'ACTION REQUISE : CONTACTS AUTORISÉS',
  'tenantTitle': 'ACTION REQUISE : INFORMATIONS DU TENANT',
  'gdapTitle': 'ACTION REQUISE : DÉLÉGATION GDAP',
  'rbacTitle': 'ACTION REQUISE : CONFIGURATION RBAC',
  'conditionalAccessTitle': 'RECOMMANDÉ : POLITIQUES D\'ACCÈS CONDITIONNEL',
  'meetingTitle': 'PLANIFIÉ : RÉUNION D\'INTÉGRATION',
  'additionalInfoTitle': 'INFORMATIONS SUPPLÉMENTAIRES',
  
  // Support plan section
  'supportPlanIntro': 'Le Plan de Support {tier} offre {supportType} avec les fonctionnalités suivantes :',
  'supportType.bronze': 'une disponibilité de support de base pour les cas non urgents, sans couverture des situations critiques',
  'supportType.other': 'un support complet avec couverture des situations critiques',
  'supportTypeLabel': 'Type de support :',
  'supportHoursLabel': 'Heures de support :',
  'severityLevelsLabel': 'Niveaux de gravité :',
  'contactsLabel': 'Contacts autorisés :',
  'tenantsLabel': 'Tenants :',
  'requestsLabel': 'Demandes de support :',
  'criticalLabel': 'Support pour situations critiques :',
  'yes': 'Oui',
  'no': 'Non',
  
  // Contacts section
  'contactsIntro': 'Selon votre Plan de Support {tier}, vous pouvez désigner jusqu\'à {count} contacts autorisés pour votre organisation. Ces contacts seront autorisés à soumettre des demandes de support et à approuver les modifications administratives dans votre environnement Microsoft 365.',
  'contactsRolesIntro': 'Nous recommandons de désigner des personnes pour les rôles suivants : {roles}.',
  'contactsInstruction': 'Veuillez compléter le tableau suivant avec les informations requises pour chaque contact :',
  'contactsNote': 'Remarque : Votre plan {tier} inclut {count} contacts autorisés. Des contacts supplémentaires peuvent être gérés via notre portail client après la configuration initiale.',
  
  // Table headers
  'numberHeader': 'N°',
  'firstNameHeader': 'Prénom',
  'lastNameHeader': 'Nom',
  'officePhoneHeader': 'Téléphone bureau',
  'mobilePhoneHeader': 'Téléphone mobile',
  'emailHeader': 'Adresse e-mail',
  'jobTitleHeader': 'Fonction',
  
  // Meeting section
  'meetingIntro': 'Nous avons planifié une réunion d\'intégration pour discuter de ces éléments en détail et répondre à vos questions :',
  'meetingDate': 'Date : {date}',
  'meetingAttendees': 'Veuillez vous assurer que les membres appropriés de votre équipe peuvent assister à cette réunion.',
  
  // GDAP section
  'gdapIntro': 'Microsoft exige désormais que les partenaires utilisent GDAP pour un accès administratif sécurisé. Nous devons mettre cela en œuvre d\'ici le {deadline}.',
  'gdapRoles': 'Nous demanderons le rôle "{roles}".',
  'gdapPermission': 'Cette autorisation nous permettra de fournir les services de support décrits dans notre accord tout en maintenant les meilleures pratiques de sécurité.',
  'gdapInstruction': 'Veuillez visiter le lien suivant pour approuver la relation GDAP :',
  'gdapLink': 'Lien d\'approbation GDAP',
  
  // RBAC section
  'rbacIntro': 'Nous configurerons {groups} pour garantir que les utilisateurs disposent du niveau d\'accès approprié à votre environnement en fonction de leurs rôles professionnels.',
  'rbacPermissionBoth': 'Cela inclut des autorisations d\'accès pour Azure et Microsoft 365.',
  'rbacPermissionAzure': 'Cela inclut des autorisations d\'accès aux ressources Azure.',
  'rbacPermission365': 'Cela inclut des autorisations d\'accès aux services Microsoft 365.',
  'rbacInstruction': 'Veuillez suivre les étapes suivantes pour configurer les autorisations RBAC :',
  'rbacStep1': 'ÉTAPE 1 : Installation d\'Azure PowerShell',
  'rbacStep1Source': 'Source :',
  'rbacStep2': 'ÉTAPE 2 : Mettez à jour le tenant et exécutez le script suivant',
  'rbacStep2Instruction': 'Copiez et collez ce script complet dans votre console PowerShell',
  'rbacScriptHeader': 'Script PowerShell (Copier et coller dans la console PowerShell)',
  'rbacScreenshot': 'Veuillez nous envoyer une capture d\'écran du résultat du script ci-dessus ou nous indiquer si vous préférez planifier une réunion Teams pour effectuer cette configuration ensemble.',
  
  // Conditional Access section
  'conditionalAccessIntro': 'Nous recommandons la mise en œuvre des politiques de sécurité suivantes pour votre environnement :',
  'mfaPolicy': 'Exigences d\'authentification multifacteur (MFA) pour tous les utilisateurs',
  'locationPolicy': 'Restrictions d\'accès basées sur la localisation',
  'devicePolicy': 'Politiques de conformité des appareils pour garantir que seuls les appareils sécurisés peuvent accéder à vos données',
  'signInPolicy': 'Politiques basées sur le risque de connexion pour prévenir les tentatives de connexion suspectes'
};

export default translations;