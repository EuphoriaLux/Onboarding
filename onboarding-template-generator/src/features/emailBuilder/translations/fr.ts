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
  'meetingSlotsTitle': 'PROPOSÉ : CRÉNEAUX DE RÉUNION D\'INTÉGRATION', // New title for slots
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
  'contactsRolesIntro': 'Nous recommandons de désigner des contacts pour les rôles suivants : {roles}.', // Modified phrasing
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
  'meetingIntro': 'Nous avons planifié une réunion d\'intégration pour discuter de ces éléments en détail et répondre à vos questions :', // Old intro - Keep for reference?
  'meetingDate': 'Date : {date}', // Old date format - Keep for reference?
  'meetingSlotsIntro': 'Veuillez nous indiquer lequel des créneaux horaires de 30 minutes suivants convient le mieux pour l\'appel d\'intégration via Microsoft Teams :', // Intro for slots list
  'meetingBlockMorning': '(Matin, 10:00-12:00)', // Re-add key for summarized morning block
  'meetingBlockAfternoon': '(Après-midi, 14:00-16:00)', // Re-add key for summarized afternoon block
  'meetingBlockBoth': '(Matin & Après-midi)', // Re-add key for summarized full day block
  'meetingAttendees': 'Veuillez vous assurer que les membres appropriés de votre équipe peuvent assister à cette réunion.', // Kept
  'meetingSlotsMorningHeader': 'Créneaux du Matin', // Added for table header
  'meetingSlotsAfternoonHeader': 'Créneaux de l\'Après-midi', // Added for table header

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
  'rbacStep2Instruction': 'Copiez et collez ce script complet dans votre console PowerShell', // Kept Step 2 Instruction (Single Tenant)
  'rbacScriptHeader': 'Script PowerShell (Copier et coller dans la console PowerShell)',
  'rbacOrUpdateIt': 'ou mettez-le à jour :', // Added for RBAC step 1
  'rbacScriptForTenantHeader': 'Script pour le Tenant : {companyName} (Domaine : {tenantDomain})', // Added for RBAC step 2 multi-tenant
  'rbacScreenshot': 'Veuillez nous envoyer une capture d\'écran du résultat du script ci-dessus ou nous indiquer si vous préférez planifier une réunion Teams pour effectuer cette configuration ensemble.',

  // Conditional Access section
  'conditionalAccessIntro': 'Nous recommandons la mise en œuvre des politiques de sécurité suivantes pour votre environnement :',
  'mfaPolicy': 'Exigences d\'authentification multifacteur (MFA) pour tous les utilisateurs',
  'locationPolicy': 'Restrictions d\'accès basées sur la localisation',
  'devicePolicy': 'Politiques de conformité des appareils pour garantir que seuls les appareils sécurisés peuvent accéder à vos données',
  'signInPolicy': 'Politiques basées sur le risque de connexion pour prévenir les tentatives de connexion suspectes',

  // Roles for contacts section
  'roleTechnical': 'techniques', // Lowercase, masc plural
  'roleAdministrative': 'administratifs', // Lowercase, masc plural
  'conjunctionAnd': 'et',
  'contactsSuffix': '', // Removed suffix, noun moved to intro key

  // Added for multi-tenant support (Matching EN keys)
  'tenantInfoTitle': 'INFORMATIONS SUR LE TENANT', // Adjusted from 'INFORMATIONS DU TENANT'
  'tenantInfoIntro_singular': 'Veuillez examiner les détails du tenant inclus dans cette intégration :', // Added singular
  'tenantInfoIntro': 'Veuillez examiner les détails des tenants inclus dans cette intégration :', // Updated to be explicitly plural
  'noTenantInfo': '[AUCUNE INFORMATION SUR LE TENANT FOURNIE]',
  'gdapSpecificTenantDetailsHeader': 'Détails des tenants avec des liens GDAP spécifiques :', // New key
  'gdapSpecificLinkInfo': 'Pour les tenants où un lien GDAP spécifique a été fourni, veuillez utiliser ce lien. Les liens sont listés ci-dessous :', // Keeping old key
  'gdapDefaultLinkInfo': 'Pour les autres tenants sans lien spécifique listé, le lien d\'approbation GDAP nécessaire sera envoyé séparément.',
  'rbacInstructionMultiTenant': 'Pour les tenants où la configuration Azure RBAC est pertinente (indiqué dans la section Informations sur le Tenant), veuillez suivre les étapes suivantes.',
  'rbacRelevantTenantsList': 'Tenants pertinents nécessitant la configuration RBAC :', // Currently unused in template, but added for completeness
  'rbacStep2InstructionMultiTenant': 'Exécutez le script PowerShell pré-rempli approprié fourni ci-dessous pour chaque tenant pertinent listé dans la section Informations sur le Tenant.',
  'gdapLinksSentSeparately': 'Le(s) lien(s) d\'approbation GDAP nécessaire(s) sera/seront envoyé(s) dans une communication séparée.'
};

export default translations;
