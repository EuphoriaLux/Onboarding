// src/utils/email/translations/fr.ts
import { Translations } from '../utils/types';

/**
 * French translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': '{clientCompany} - Microsoft - Support Services - Plan de Support {tier} - Intégration', // Updated Subject
  'greeting': 'Bonjour {name},', // Updated Greeting
  'intro1': 'Merci d\'avoir choisi les Services de Support Microsoft de {company}.', // Updated Intro 1
  'intro2': 'Veuillez trouver ci-dessous les étapes du processus d\'intégration du Plan de Support {tier}. Veuillez examiner attentivement chaque section et suivre les instructions pour configurer les accès.', // Updated Intro 2
  'closing': 'Veuillez répondre à cet e-mail pour confirmer sa réception et nous faire part de vos questions ou préoccupations.', // Kept closing
  'regards': 'Cordialement,', // Kept regards
  'footer': 'SCHNEIDER IT MANAGEMENT | support@schneider.im', // Updated Footer
  
  // Section titles
  'supportPlanTitle': 'Plan de Support {tier}', // Updated Support Plan Title
  'authorizedContactsTitle': 'ACTION REQUISE : CONTACTS AUTORISÉS', // Kept Contacts Title
  'tenantTitle': 'ACTION REQUISE : INFORMATIONS DU TENANT', // Kept Tenant Title
  'gdapTitle': 'ACTION REQUISE : Privilèges d\'Administrateur Délégué Granulaire (GDAP)', // Updated GDAP Title
  'rbacTitle': 'ACTION REQUISE : Contrôle d\'Accès Basé sur les Rôles (RBAC)', // Updated RBAC Title
  'conditionalAccessTitle': 'RECOMMANDÉ : POLITIQUES D\'ACCÈS CONDITIONNEL', // Kept Conditional Access Title
  'meetingTitle': 'PLANIFIÉ : RÉUNION D\'INTÉGRATION', // Kept Meeting Title
  'additionalInfoTitle': 'INFORMATIONS SUPPLÉMENTAIRES', // Kept Additional Info Title
  
  // Support plan section
  'supportPlanIntro': 'Le Plan de Support {tier} fournit un support complet avec les caractéristiques suivantes :', // Updated Support Plan Intro
  // Removed 'supportType.bronze', 'supportType.other', 'supportTypeLabel'
  'supportProviderLabel': 'Support fourni par', // Added
  'productsCoveredLabel': 'Produits couverts', // Added
  'supportHoursLabel': 'Heures de support', // Kept (text only)
  'severityLevelsLabel': 'Niveaux de gravité Microsoft', // Updated Severity Label
  'criticalLabel': 'Gestion des Situations Critiques (Crit Sit)', // Updated Critical Label
  'supportRequestSubmissionLabel': 'Soumission des demandes de support', // Added
  'contactsLabel': 'Contacts clients autorisés', // Updated Contacts Label
  'tenantsLabel': 'Tenants', // Kept (text only)
  'requestsLabel': 'Demandes de support incluses par période de 12 mois glissants', // Updated Requests Label
  'yes': 'Oui', // Kept
  'no': 'Non', // Kept
  
  // Contacts section
  'contactsIntro': 'Selon votre Plan de Support {tier}, vous pouvez désigner jusqu\'à {count} contacts autorisés pour votre organisation. Ces contacts seront autorisés à soumettre des demandes de support et à approuver les modifications administratives dans votre environnement Microsoft.', // Updated Contacts Intro
  'contactsRolesIntro': 'Nous recommandons de désigner des personnes pour les rôles suivants : {roles}.', // Kept Contacts Roles Intro
  'contactsInstruction': 'Veuillez compléter le tableau suivant avec les informations requises pour chaque contact :', // Kept Contacts Instruction
  // Removed 'contactsNote'
  
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
  'meetingDate': 'Date : {date}', // Kept
  'meetingAttendees': 'Veuillez vous assurer que les membres appropriés de votre équipe peuvent assister à cette réunion.', // Kept
  
  // GDAP section
  'gdapIntro': 'Microsoft recommande d\'utiliser les Privilèges d\'Administrateur Délégué Granulaire (GDAP) pour un accès administratif sécurisé. Nous devons mettre cela en œuvre d\'ici le {deadline}. Nous demandons le rôle "{roles}".', // Updated GDAP Intro, incorporated roles
  // Removed 'gdapRoles'
  'gdapPermission': 'Cette autorisation nous permettra de fournir les services de support décrits dans notre accord tout en maintenant les meilleures pratiques de sécurité basées sur le Principe du Moindre Privilège (POLP).', // Updated GDAP Permission text
  'gdapInstruction': 'Veuillez visiter le lien suivant pour approuver la relation GDAP :', // Kept GDAP Instruction
  'gdapLink': 'Lien d\'approbation GDAP', // Kept GDAP Link text
  
  // RBAC section
  // Removed 'rbacIntro', 'rbacPermissionBoth', 'rbacPermissionAzure', 'rbacPermission365'
  'rbacInstruction': 'Veuillez suivre les étapes suivantes pour configurer les autorisations RBAC :', // Kept RBAC Instruction
  'rbacStep1': 'ÉTAPE 1 : Installation d\'Azure PowerShell', // Kept Step 1 Title
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
