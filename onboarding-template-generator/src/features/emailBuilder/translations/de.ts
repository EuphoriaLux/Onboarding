// src/features/emailBuilder/translations/de.ts
import { Translations } from '../utils/types';

/**
 * German translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': '{clientCompany} - Microsoft - Support Services - {tier} Support-Plan - Onboarding', // Updated Subject
  'greeting': 'Hallo {name},', // Updated Greeting
  'intro1': 'Vielen Dank, dass Sie sich für {company} Microsoft Support Services entschieden haben.', // Updated Intro 1
  'intro2': 'Bitte finden Sie unten die Schritte des Onboarding-Prozesses für den {tier} Support-Plan. Bitte überprüfen Sie jeden Abschnitt sorgfältig und befolgen Sie die Anweisungen, um die Zugriffskonfigurationen einzurichten.', // Updated Intro 2
  'closing': 'Bitte antworten Sie auf diese E-Mail, um den Empfang zu bestätigen und uns mitzuteilen, ob Sie Fragen oder Bedenken haben.', // Kept closing
  'regards': 'Mit freundlichen Grüßen,', // Kept regards
  'footer': 'SCHNEIDER IT MANAGEMENT | support@schneider.im', // Updated Footer

  // Section titles
  'supportPlanTitle': '{tier} Support-Plan', // Updated Support Plan Title
  'authorizedContactsTitle': 'AKTION ERFORDERLICH: AUTORISIERTE KONTAKTE', // Kept Contacts Title
  'tenantTitle': 'AKTION ERFORDERLICH: TENANT-INFORMATIONEN', // Kept Tenant Title
  'gdapTitle': 'AKTION ERFORDERLICH: Granular Delegated Admin Privileges (GDAP)', // Updated GDAP Title
  'rbacTitle': 'AKTION ERFORDERLICH: Role-Based Access Control (RBAC)', // Updated RBAC Title
  'conditionalAccessTitle': 'EMPFOHLEN: RICHTLINIEN FÜR BEDINGTEN ZUGRIFF', // Kept Conditional Access Title
  'meetingTitle': 'GEPLANT: ONBOARDING-MEETING', // Kept Meeting Title
  'meetingSlotsTitle': 'VORGESCHLAGEN: ONBOARDING-MEETING-TERMINE', // New title for slots
  'additionalInfoTitle': 'ZUSÄTZLICHE INFORMATIONEN', // Kept Additional Info Title

  // Support plan section
  'supportPlanIntro': 'Der {tier} Support-Plan bietet umfassenden Support mit folgenden Merkmalen:', // Updated Support Plan Intro
  // Removed 'supportType.bronze', 'supportType.other', 'supportTypeLabel'
  'supportProviderLabel': 'Support bereitgestellt von', // Added
  'productsCoveredLabel': 'Abgedeckte Produkte', // Added
  'supportHoursLabel': 'Support-Zeiten', // Kept (text only)
  'severityLevelsLabel': 'Microsoft Schweregrade', // Updated Severity Label
  'criticalLabel': 'Management kritischer Situationen (Crit Sit)', // Updated Critical Label
  'supportRequestSubmissionLabel': 'Einreichung von Support-Anfragen', // Added
  'contactsLabel': 'Autorisierte Kundenkontakte', // Updated Contacts Label
  'tenantsLabel': 'Mandanten', // Updated Tenants Label Text
  'requestsLabel': 'Enthaltene Support-Anfragen pro letzten 12 Monate', // Updated Requests Label
  'yes': 'Ja', // Kept
  'no': 'Nein', // Kept

  // Contacts section
  'contactsIntro': 'Basierend auf Ihrem {tier} Support-Plan können Sie bis zu {count} autorisierte Kontakte für Ihre Organisation benennen. Diese Kontakte sind berechtigt, Support-Anfragen einzureichen und administrative Änderungen an Ihrer Microsoft-Umgebung zu genehmigen.', // Updated Contacts Intro
  'contactsRolesIntro': 'Wir empfehlen, Personen für die folgenden Rollen zu benennen: {roles}.', // Kept Contacts Roles Intro
  'contactsInstruction': 'Bitte vervollständigen Sie die folgende Tabelle mit den erforderlichen Informationen für jeden Kontakt:', // Kept Contacts Instruction
  // Removed 'contactsNote'

  // Table headers
  'numberHeader': 'Nr.',
  'firstNameHeader': 'Vorname',
  'lastNameHeader': 'Nachname',
  'officePhoneHeader': 'Bürotelefon',
  'mobilePhoneHeader': 'Mobiltelefon',
  'emailHeader': 'E-Mail-Adresse',
  'jobTitleHeader': 'Position',

  // Meeting section
  'meetingIntro': 'Wir haben ein Onboarding-Meeting angesetzt, um diese Punkte im Detail zu besprechen und Ihre Fragen zu beantworten:', // Old intro - Keep for reference?
  'meetingDate': 'Datum: {date}', // Old date format - Keep for reference?
  'meetingSlotsIntro': 'Bitte teilen Sie uns mit, welcher der folgenden 30-minütigen Zeitfenster für den Onboarding-Anruf über Microsoft Teams am besten passt:', // Intro for slots list
  'meetingBlockMorning': '(Vormittag, 10:00-12:00)', // Re-add key for summarized morning block
  'meetingBlockAfternoon': '(Nachmittag, 14:00-16:00)', // Re-add key for summarized afternoon block
  'meetingBlockBoth': '(Vormittag & Nachmittag)', // Re-add key for summarized full day block
  'meetingAttendees': 'Bitte stellen Sie sicher, dass die entsprechenden Teammitglieder an diesem Meeting teilnehmen können.', // Kept
  'meetingSlotsMorningHeader': 'Vormittags-Termine', // Added for table header
  'meetingSlotsAfternoonHeader': 'Nachmittags-Termine', // Added for table header

  // GDAP section
  'gdapIntro': 'Microsoft empfiehlt die Verwendung von Granular Delegated Admin Privileges (GDAP) für den sicheren administrativen Zugriff. Wir müssen dies bis zum {deadline} implementieren. Wir benötigen die Rolle "{roles}".', // Updated GDAP Intro, incorporated roles
  // Removed 'gdapRoles'
  'gdapPermission': 'Diese Berechtigung ermöglicht es uns, die in unserer Vereinbarung beschriebenen Support-Leistungen zu erbringen und gleichzeitig die Best Practices für Sicherheit basierend auf dem Prinzip der geringsten Rechte (POLP) einzuhalten.', // Updated GDAP Permission text
  'gdapInstruction': 'Bitte besuchen Sie den folgenden Link, um die GDAP-Beziehung zu genehmigen:', // Kept GDAP Instruction
  'gdapLink': 'GDAP-Genehmigungslink', // Kept GDAP Link text

  // RBAC section
  // Removed 'rbacIntro', 'rbacPermissionBoth', 'rbacPermissionAzure', 'rbacPermission365'
  'rbacInstruction': 'Bitte führen Sie die folgenden Schritte aus, um RBAC-Berechtigungen zu konfigurieren:', // Kept RBAC Instruction
  'rbacStep1': 'SCHRITT 1: Azure PowerShell installieren', // Kept Step 1 Title
  'rbacStep1Source': 'Quelle:',
  'rbacStep2': 'SCHRITT 2: Den Tenant aktualisieren und das folgende Skript ausführen',
  'rbacStep2Instruction': 'Kopieren Sie dieses vollständige Skript und fügen Sie es in Ihre PowerShell-Konsole ein', // Kept Step 2 Instruction (Single Tenant)
  'rbacScriptHeader': 'PowerShell-Skript (In PowerShell-Konsole kopieren und einfügen)',
  'rbacOrUpdateIt': 'oder aktualisieren Sie es:', // Added for RBAC step 1
  'rbacScriptForTenantHeader': 'Skript für TENANT: {companyName} (Domäne: {tenantDomain})', // Added for RBAC step 2 multi-tenant
  'rbacScreenshot': 'Bitte senden Sie uns einen Screenshot des Ergebnisses des obigen Skripts oder teilen Sie uns mit, ob Sie lieber ein Teams-Meeting vereinbaren möchten, um diese Konfiguration gemeinsam durchzuführen.',

  // Conditional Access section
  'conditionalAccessIntro': 'Wir empfehlen die Implementierung der folgenden Sicherheitsrichtlinien für Ihre Umgebung:',
  'mfaPolicy': 'Anforderungen für Multi-Faktor-Authentifizierung (MFA) für alle Benutzer',
  'locationPolicy': 'Standortbasierte Zugriffsbeschränkungen',
  'devicePolicy': 'Gerätekonformitätsrichtlinien, um sicherzustellen, dass nur sichere Geräte auf Ihre Daten zugreifen können',
  'signInPolicy': 'Risikobasierte Anmelderichtlinien zur Verhinderung verdächtiger Anmeldeversuche',

  // Roles for contacts section
  'roleTechnical': 'Technische',
  'roleAdministrative': 'Administrative',
  'conjunctionAnd': 'und',
  'contactsSuffix': 'Kontakte',

  // Added for multi-tenant support (Matching EN keys)
  'tenantInfoTitle': 'TENANT NINFORMATIONEN', // Adjusted from 'TENANT-INFORMATIONEN'
  'tenantInfoIntro_singular': 'Bitte überprüfen Sie die Details für den in diesem Onboarding enthaltenen TENANT:', // Added singular
  'tenantInfoIntro': 'Bitte überprüfen Sie die Details für die in diesem Onboarding enthaltenen TENANT:', // Updated to be explicitly plural
  'noTenantInfo': '[KEINE TENANT INFORMATIONEN ANGEGEBEN]',
  'gdapSpecificTenantDetailsHeader': 'Details für Mandanten mit spezifischen GDAP-Links:', // New key
  'gdapSpecificLinkInfo': 'Für TENANT, für die ein spezifischer GDAP-Link bereitgestellt wurde, verwenden Sie bitte diesen Link. Die Links sind unten aufgeführt:', // Keeping old key
  'gdapDefaultLinkInfo': 'Für andere TENANT ohne spezifischen Link wird der erforderliche GDAP-Genehmigungslink separat gesendet.',
  'rbacInstructionMultiTenant': 'Für TENANT, für die die Azure RBAC-Konfiguration relevant ist (angegeben im Abschnitt TENANTinformationen), führen Sie bitte die folgenden Schritte aus.',
  'rbacRelevantTenantsList': 'Relevante TENANT, die eine RBAC-Konfiguration erfordern:', // Currently unused in template, but added for completeness
  'rbacStep2InstructionMultiTenant': 'Führen Sie das entsprechende unten bereitgestellte, vorausgefüllte PowerShell-Skript für jeden relevanten TENANT aus, der im Abschnitt TENANT informationen aufgeführt ist.',
  'gdapLinksSentSeparately': 'Der/die erforderliche(n) GDAP-Genehmigungslink(s) wird/werden in einer separaten Mitteilung gesendet.'
};

export default translations;
