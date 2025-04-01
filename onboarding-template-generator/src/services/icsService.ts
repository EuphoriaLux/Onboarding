// Service for generating iCalendar (.ics) files

import { StorageService } from './storage'; // Assuming storage service path

// Define the structure of settings we expect to retrieve
interface IcsGeneratorSettings {
    agentName?: string;
    onCallRecipients?: string;
    vacationRecipients?: string;
    supportRecipients?: string;
}

// Function to format a date object into YYYYMMDDTHHMMSSZ format (UTC)
const formatICSDate = (date: Date): string => {
    if (!date || isNaN(date.getTime())) return ''; // Check for invalid date
    return date.getUTCFullYear() +
        ('0' + (date.getUTCMonth() + 1)).slice(-2) +
        ('0' + date.getUTCDate()).slice(-2) + 'T' +
        ('0' + date.getUTCHours()).slice(-2) +
        ('0' + date.getUTCMinutes()).slice(-2) +
        ('0' + date.getUTCSeconds()).slice(-2) + 'Z';
};

// Function to generate a unique ID
const generateUID = (): string => {
    // Simple UID generator
    return Date.now() + '-' + Math.random().toString(36).substring(2, 15) + '@schneider-it.com'; // Domain can be customized
};

// Function to trigger file download
const downloadICS = (filename: string, content: string): void => {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    console.log(`Downloaded ICS file: ${filename}`);
};

// Helper to parse recipient string
const parseRecipients = (recipientString: string | undefined): string[] => {
    if (!recipientString) return [];
    return recipientString.split(',')
        .map(email => email.trim())
        .filter(email => email); // Split, trim, and remove empty entries
};

// --- Specific ICS Generation Functions ---

export const IcsService = {

    generateOnCallDutyIcs: async (startDate: Date, endDate: Date): Promise<void> => {
        try {
            const settings = await StorageService.get<IcsGeneratorSettings>('agentSettings');
            const agentName = settings?.agentName || 'Agent Name'; // Default if not set
            const recipients = parseRecipients(settings?.onCallRecipients);

            const formattedStartDate = formatICSDate(startDate);
            const formattedEndDate = formatICSDate(endDate);
            const dtStamp = formatICSDate(new Date());
            const uid = generateUID();

            let icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//SchneiderIT//OutlookAppointmentGenerator//EN',
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTAMP:${dtStamp}`,
                `DTSTART:${formattedStartDate}`,
                `DTEND:${formattedEndDate}`,
                `SUMMARY:${agentName} - On-Call Duty`, // Using agentName from settings
            ];

            recipients.forEach(email => {
                icsContent.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`);
            });

            icsContent.push('END:VEVENT');
            icsContent.push('END:VCALENDAR');

            const icsString = icsContent.join('\r\n');
            const filenameDate = startDate.toISOString().split('T')[0];
            const lastName = agentName.split(' ').pop() || 'Agent'; // Extract last name for filename
            const filename = `on-call_${lastName}_${filenameDate}.ics`;

            downloadICS(filename, icsString);

        } catch (error) {
            console.error("Error generating On-Call Duty ICS:", error);
            alert("Failed to generate On-Call Duty ICS file. Check console for details.");
        }
    },

    generateSupportRequestIcs: async (
        customerName: string,
        trackingId: string,
        startDate: Date,
        endDate: Date
    ): Promise<void> => {
        try {
            const settings = await StorageService.get<IcsGeneratorSettings>('agentSettings');
            const agentName = settings?.agentName || 'Agent Name';
            const recipients = parseRecipients(settings?.supportRecipients);

            const formattedStartDate = formatICSDate(startDate);
            const formattedEndDate = formatICSDate(endDate);
            const dtStamp = formatICSDate(new Date());
            const uid = generateUID();

            const subject = `${agentName} - ${customerName} - ${trackingId}`;

            let icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//SchneiderIT//OutlookAppointmentGenerator//EN',
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTAMP:${dtStamp}`,
                `DTSTART:${formattedStartDate}`,
                `DTEND:${formattedEndDate}`,
                `SUMMARY:${subject}`,
                'TRANSP:TRANSPARENT', // Show as "Free"
            ];

            recipients.forEach(email => {
                icsContent.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`);
            });

            icsContent.push('END:VEVENT');
            icsContent.push('END:VCALENDAR');

            const icsString = icsContent.join('\r\n');
            const filenameDate = startDate.toISOString().split('T')[0];
            const filename = `support_${trackingId}_${filenameDate}.ics`;

            downloadICS(filename, icsString);

        } catch (error) {
            console.error("Error generating Support Request ICS:", error);
            alert("Failed to generate Support Request ICS file. Check console for details.");
        }
    },

    generateVacationRequestIcs: async (
        startDate: Date,
        endDate: Date,
        description: string
    ): Promise<void> => {
        try {
            const settings = await StorageService.get<IcsGeneratorSettings>('agentSettings');
            const agentName = settings?.agentName || 'Agent Name';
            const recipients = parseRecipients(settings?.vacationRecipients);

            const formattedStartDate = formatICSDate(startDate);
            const formattedEndDate = formatICSDate(endDate);
            const dtStamp = formatICSDate(new Date());
            const uid = generateUID();

            // Subject line for vacation request
            const subject = `Vacation Request: ${agentName} - ${description}`;

            let icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//SchneiderIT//OutlookAppointmentGenerator//EN',
                'BEGIN:VEVENT',
                `UID:${uid}`,
                `DTSTAMP:${dtStamp}`,
                `DTSTART:${formattedStartDate}`, // Use formatted dates
                `DTEND:${formattedEndDate}`,
                `SUMMARY:${subject}`,
                `DESCRIPTION:${description}`, // Add description to the body
                'TRANSP:OPAQUE', // Show as "Busy" or "Out of Office"
                'STATUS:CONFIRMED', // Or TENTATIVE if approval needed
            ];

            recipients.forEach(email => {
                icsContent.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`);
            });

            icsContent.push('END:VEVENT');
            icsContent.push('END:VCALENDAR');

            const icsString = icsContent.join('\r\n');
            const filenameDate = startDate.toISOString().split('T')[0];
            const lastName = agentName.split(' ').pop() || 'Agent';
            const filename = `vacation_${lastName}_${filenameDate}.ics`;

            downloadICS(filename, icsString);

        } catch (error) {
            console.error("Error generating Vacation Request ICS:", error);
            alert("Failed to generate Vacation Request ICS file. Check console for details.");
        }
    },
};
