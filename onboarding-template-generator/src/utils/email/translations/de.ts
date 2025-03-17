// src/utils/email/translations/de.ts
import { Translations } from '../types';

/**
 * German translations for the email template
 */
const translations: Translations = {
  // Email general
  'subject': '{tier} Support-Plan Onboarding für {company} - Microsoft 365 Administrationseinrichtung',
  'greeting': 'Sehr geehrte(r) {name},',
  'intro1': 'Vielen Dank, dass Sie sich für {company} als Ihren Microsoft 365-Administrationspartner entschieden haben. Wir freuen uns, den Onboarding-Prozess für {clientCompany} zu beginnen.',
  'intro2': 'Nachfolgend finden Sie die wichtigen Schritte zum Abschluss Ihres Onboarding-Prozesses. Bitte prüfen Sie jeden Abschnitt sorgfältig und folgen Sie den Anweisungen zur Einrichtung Ihres {tier} Support-Plans und der notwendigen Zugriffskonfigurationen.',
  'closing': 'Bitte antworten Sie auf diese E-Mail, um den Erhalt zu bestätigen, und lassen Sie uns wissen, wenn Sie Fragen oder Bedenken haben.',
  'regards': 'Mit freundlichen Grüßen,',
  'footer': 'Dies ist eine automatisch generierte Nachricht des Microsoft Onboarding Template Generators.',
  
  // Section titles
  'supportPlanTitle': '{tier} SUPPORT-PLAN DETAILS',
  'authorizedContactsTitle': 'ERFORDERLICHE AKTION: AUTORISIERTE KONTAKTE',
  'tenantTitle': 'ERFORDERLICHE AKTION: TENANT-INFORMATIONEN',
  'gdapTitle': 'ERFORDERLICHE AKTION: GDAP-DELEGATION',
  'rbacTitle': 'ERFORDERLICHE AKTION: RBAC-KONFIGURATION',
  'conditionalAccessTitle': 'EMPFOHLEN: RICHTLINIEN FÜR BEDINGTEN ZUGRIFF',
  'meetingTitle': 'GEPLANT: ONBOARDING-MEETING',
  'additionalInfoTitle': 'ZUSÄTZLICHE INFORMATIONEN',
  
  // Support plan section
  'supportPlanIntro': 'Der {tier} Support-Plan bietet {supportType} mit den folgenden Funktionen:',
  'supportType.bronze': 'grundlegende Support-Verfügbarkeit für nicht dringende Fälle, ohne Abdeckung kritischer Situationen',
  'supportType.other': 'umfassenden Support mit Abdeckung kritischer Situationen',
  'supportTypeLabel': 'Support-Typ:',
  'supportHoursLabel': 'Support-Zeiten:',
  'severityLevelsLabel': 'Schweregrade:',
  'contactsLabel': 'Autorisierte Kontakte:',
  'tenantsLabel': 'Tenants:',
  'requestsLabel': 'Support-Anfragen:',
  'criticalLabel': 'Unterstützung bei kritischen Situationen:',
  'yes': 'Ja',
  'no': 'Nein',
  
  // Contacts section
  'contactsIntro': 'Basierend auf Ihrem {tier} Support-Plan können Sie bis zu {count} autorisierte Kontakte für Ihre Organisation benennen. Diese Kontakte werden berechtigt sein, Support-Anfragen zu stellen und administrative Änderungen in Ihrer Microsoft 365-Umgebung zu genehmigen.',
  'contactsRolesIntro': 'Wir empfehlen, Personen für die folgenden Rollen zu benennen: {roles}.',
  'contactsInstruction': 'Bitte füllen Sie die folgende Tabelle mit den erforderlichen Informationen für jeden Kontakt aus:',
  'contactsNote': 'Hinweis: Ihr {tier}-Plan umfasst {count} autorisierte Kontakte. Zusätzliche Kontakte können nach der Ersteinrichtung über unser Kundenportal verwaltet werden.',
  
  // Table headers
  'numberHeader': 'Nr.',
  'firstNameHeader': 'Vorname',
  'lastNameHeader': 'Nachname',
  'officePhoneHeader': 'Bürotelefon',
  'mobilePhoneHeader': 'Mobiltelefon',
  'emailHeader': 'E-Mail-Adresse',
  'jobTitleHeader': 'Berufsbezeichnung',
  
  // Meeting section
  'meetingIntro': 'Wir haben ein Onboarding-Meeting geplant, um diese Punkte im Detail zu besprechen und Ihre Fragen zu beantworten:',
  'meetingDate': 'Datum: {date}',
  'meetingAttendees': 'Bitte stellen Sie sicher, dass die entsprechenden Teammitglieder an diesem Meeting teilnehmen können.',
  
  // GDAP section
  'gdapIntro': 'Microsoft verlangt jetzt von Partnern die Verwendung von GDAP für sicheren administrativen Zugriff. Wir müssen dies bis zum {deadline} implementieren.',
  'gdapRoles': 'Wir werden die Rolle "{roles}" beantragen.',
  'gdapPermission': 'Diese Berechtigung ermöglicht es uns, die in unserer Vereinbarung festgelegten Support-Dienste zu erbringen und gleichzeitig die Best Practices für Sicherheit einzuhalten.',
  'gdapInstruction': 'Bitte besuchen Sie den folgenden Link, um die GDAP-Beziehung zu genehmigen:',
  'gdapLink': 'GDAP-Genehmigungslink',
  
  // RBAC section
  'rbacIntro': 'Wir werden {groups} konfigurieren, um sicherzustellen, dass Benutzer über die entsprechenden Zugriffsebenen für Ihre Umgebung auf Basis ihrer Jobfunktionen verfügen.',
  'rbacPermissionBoth': 'Dies umfasst sowohl Azure- als auch Microsoft 365-Zugriffsberechtigungen.',
  'rbacPermissionAzure': 'Dies umfasst Zugriffsberechtigungen für Azure-Ressourcen.',
  'rbacPermission365': 'Dies umfasst Zugriffsberechtigungen für Microsoft 365-Dienste.',
  'rbacInstruction': 'Bitte führen Sie die folgenden Schritte aus, um RBAC-Berechtigungen zu konfigurieren:',
  'rbacStep1': 'SCHRITT 1: Installation von Azure PowerShell',
  'rbacStep1Source': 'Quelle:',
  'rbacStep2': 'SCHRITT 2: Aktualisieren Sie den Tenant und führen Sie das folgende Skript aus',
  'rbacStep2Instruction': 'Kopieren und fügen Sie dieses vollständige Skript in Ihre PowerShell-Konsole ein',
  'rbacScriptHeader': 'PowerShell-Skript (Kopieren und in die PowerShell-Konsole einfügen)',
  'rbacScreenshot': 'Bitte senden Sie uns einen Screenshot des Ergebnisses des obigen Skripts oder teilen Sie uns mit, ob Sie lieber ein Teams-Meeting planen möchten, um diese Konfiguration gemeinsam durchzuführen.',
  
  // Conditional Access section
  'conditionalAccessIntro': 'Wir empfehlen die Implementierung der folgenden Sicherheitsrichtlinien für Ihre Umgebung:',
  'mfaPolicy': 'Multi-Faktor-Authentifizierung (MFA) für alle Benutzer',
  'locationPolicy': 'Standortbasierte Zugriffsbeschränkungen',
  'devicePolicy': 'Gerätekonformitätsrichtlinien, um sicherzustellen, dass nur sichere Geräte auf Ihre Daten zugreifen können',
  'signInPolicy': 'Anmelderisiko-basierte Richtlinien zur Verhinderung verdächtiger Anmeldeversuche'
};

export default translations;