// src/features/emailBuilder/translations/de.ts
import { Translations } from '../utils/types';

/**
 * German translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': '{tier} Support-Plan Onboarding für {company} - Microsoft 365 Administrationseinrichtung',
  'greeting': 'Sehr geehrte/r {name},',
  'intro1': 'Vielen Dank, dass Sie {company} als Ihren Microsoft 365 Administrationspartner gewählt haben. Wir freuen uns, den Onboarding-Prozess für {clientCompany} zu beginnen.',
  'intro2': 'Nachfolgend finden Sie die wichtigen Schritte zum Abschluss Ihres Onboarding-Prozesses. Bitte überprüfen Sie jeden Abschnitt sorgfältig und befolgen Sie die Anweisungen, um Ihren {tier} Support-Plan und die erforderlichen Zugriffskonfigurationen einzurichten.',
  'closing': 'Bitte antworten Sie auf diese E-Mail, um den Empfang zu bestätigen und uns mitzuteilen, ob Sie Fragen oder Bedenken haben.',
  'regards': 'Mit freundlichen Grüßen,',
  'footer': 'Dies ist eine automatisch generierte Nachricht vom Microsoft Onboarding Template Generator.',

  // Section titles
  'supportPlanTitle': '{tier} SUPPORT-PLAN DETAILS',
  'authorizedContactsTitle': 'AKTION ERFORDERLICH: AUTORISIERTE KONTAKTE',
  'tenantTitle': 'AKTION ERFORDERLICH: TENANT-INFORMATIONEN',
  'gdapTitle': 'AKTION ERFORDERLICH: GDAP-DELEGIERUNG',
  'rbacTitle': 'AKTION ERFORDERLICH: RBAC-KONFIGURATION',
  'conditionalAccessTitle': 'EMPFOHLEN: RICHTLINIEN FÜR BEDINGTEN ZUGRIFF',
  'meetingTitle': 'GEPLANT: ONBOARDING-MEETING',
  'additionalInfoTitle': 'ZUSÄTZLICHE INFORMATIONEN',

  // Support plan section
  'supportPlanIntro': 'Der {tier} Support-Plan bietet {supportType} mit folgenden Funktionen:',
  'supportType.bronze': 'grundlegende Support-Verfügbarkeit für nicht dringende Fälle, ohne Abdeckung kritischer Situationen',
  'supportType.other': 'umfassenden Support mit Abdeckung kritischer Situationen',
  'supportTypeLabel': 'Support-Typ:',
  'supportHoursLabel': 'Support-Zeiten:',
  'severityLevelsLabel': 'Schweregrade:',
  'contactsLabel': 'Autorisierte Kontakte:',
  'tenantsLabel': 'Tenants:',
  'requestsLabel': 'Support-Anfragen:',
  'criticalLabel': 'Support für kritische Situationen:',
  'yes': 'Ja',
  'no': 'Nein',

  // Contacts section
  'contactsIntro': 'Basierend auf Ihrem {tier} Support-Plan können Sie bis zu {count} autorisierte Kontakte für Ihre Organisation benennen. Diese Kontakte sind berechtigt, Support-Anfragen einzureichen und administrative Änderungen an Ihrer Microsoft 365-Umgebung zu genehmigen.',
  'contactsRolesIntro': 'Wir empfehlen, Personen für die folgenden Rollen zu benennen: {roles}.',
  'contactsInstruction': 'Bitte vervollständigen Sie die folgende Tabelle mit den erforderlichen Informationen für jeden Kontakt:',
  'contactsNote': 'Hinweis: Ihr {tier}-Plan beinhaltet {count} autorisierte Kontakte. Zusätzliche Kontakte können nach der Ersteinrichtung über unser Kundenportal verwaltet werden.',

  // Table headers
  'numberHeader': 'Nr.',
  'firstNameHeader': 'Vorname',
  'lastNameHeader': 'Nachname',
  'officePhoneHeader': 'Bürotelefon',
  'mobilePhoneHeader': 'Mobiltelefon',
  'emailHeader': 'E-Mail-Adresse',
  'jobTitleHeader': 'Position',

  // Meeting section
  'meetingIntro': 'Wir haben ein Onboarding-Meeting angesetzt, um diese Punkte im Detail zu besprechen und Ihre Fragen zu beantworten:',
  'meetingDate': 'Datum: {date}',
  'meetingAttendees': 'Bitte stellen Sie sicher, dass die entsprechenden Teammitglieder an diesem Meeting teilnehmen können.',

  // GDAP section
  'gdapIntro': 'Microsoft verlangt nun von Partnern die Verwendung von GDAP für den sicheren administrativen Zugriff. Wir müssen dies bis zum {deadline} implementieren.',
  'gdapRoles': 'Wir werden die Rolle "{roles}" anfordern.',
  'gdapPermission': 'Diese Berechtigung ermöglicht es uns, die in unserer Vereinbarung beschriebenen Support-Leistungen zu erbringen und gleichzeitig die Best Practices für Sicherheit einzuhalten.',
  'gdapInstruction': 'Bitte besuchen Sie den folgenden Link, um die GDAP-Beziehung zu genehmigen:',
  'gdapLink': 'GDAP-Genehmigungslink',

  // RBAC section
  'rbacIntro': 'Wir werden {groups} konfigurieren, um sicherzustellen, dass Benutzer basierend auf ihren Jobfunktionen die entsprechende Zugriffsebene auf Ihre Umgebung haben.',
  'rbacPermissionBoth': 'Dies umfasst Zugriffsberechtigungen für Azure und Microsoft 365.',
  'rbacPermissionAzure': 'Dies umfasst Zugriffsberechtigungen für Azure-Ressourcen.',
  'rbacPermission365': 'Dies umfasst Zugriffsberechtigungen für Microsoft 365-Dienste.',
  'rbacInstruction': 'Bitte führen Sie die folgenden Schritte aus, um RBAC-Berechtigungen zu konfigurieren:',
  'rbacStep1': 'SCHRITT 1: Azure PowerShell installieren',
  'rbacStep1Source': 'Quelle:',
  'rbacStep2': 'SCHRITT 2: Den Tenant aktualisieren und das folgende Skript ausführen',
  'rbacStep2Instruction': 'Kopieren Sie dieses vollständige Skript und fügen Sie es in Ihre PowerShell-Konsole ein',
  'rbacScriptHeader': 'PowerShell-Skript (In PowerShell-Konsole kopieren und einfügen)',
  'rbacScreenshot': 'Bitte senden Sie uns einen Screenshot des Ergebnisses des obigen Skripts oder teilen Sie uns mit, ob Sie lieber ein Teams-Meeting vereinbaren möchten, um diese Konfiguration gemeinsam durchzuführen.',

  // Conditional Access section
  'conditionalAccessIntro': 'Wir empfehlen die Implementierung der folgenden Sicherheitsrichtlinien für Ihre Umgebung:',
  'mfaPolicy': 'Anforderungen für Multi-Faktor-Authentifizierung (MFA) für alle Benutzer',
  'locationPolicy': 'Standortbasierte Zugriffsbeschränkungen',
  'devicePolicy': 'Gerätekonformitätsrichtlinien, um sicherzustellen, dass nur sichere Geräte auf Ihre Daten zugreifen können',
  'signInPolicy': 'Risikobasierte Anmelderichtlinien zur Verhinderung verdächtiger Anmeldeversuche'
};

export default translations;
