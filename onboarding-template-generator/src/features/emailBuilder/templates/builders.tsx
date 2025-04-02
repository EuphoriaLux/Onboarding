// src/features/emailBuilder/templates/builders.tsx
import React from 'react';
import { Language } from '../utils/types'; // Assuming this is still needed, otherwise remove
import { getTranslation } from '../utils/translationService'; // Assuming this is still needed, otherwise remove
import { ThemeSettings } from '../../../types';

// --- Component Props Interfaces ---

interface SectionHeaderProps {
  title: string;
  color: string;
  theme: ThemeSettings;
}

// Updated ContactsTableProps to reflect the new structure (though data source might still be simpler)
interface ContactsTableProps {
  // contacts: Array<{ name: string; email: string; phone: string }>; // Old structure
  contacts: Array<{ // Assuming the data passed might still be simpler, adjust if needed
    firstName?: string;
    lastName?: string;
    officePhone?: string;
    mobilePhone?: string;
    email?: string;
    jobTitle?: string;
  }>;
  theme: ThemeSettings;
  tierContactLimit: number;
}

interface ScriptBlockProps {
  scriptContent: string;
  theme: ThemeSettings;
}

interface InstructionBoxProps {
  title: string;
  content: string; // Assuming content might be simple text or pre-formatted HTML string
  theme: ThemeSettings;
}

interface StepIndicatorProps {
  number: number;
  title: string;
  theme: ThemeSettings;
}


// --- Refactored Components ---

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, color, theme }) => {
  // Ensure white background for header components
  const headerBgColor = '#FFFFFF'; // Force white
  const headerTextColor = theme.textColor || '#333333';

  // Styles for the div-based header
  const headerDivStyle: React.CSSProperties = {
    margin: '35px 0 20px 0',
    padding: '16px',
    backgroundColor: '#FFFFFF', // Ensure white background
    borderLeft: `4px solid ${color}`,
    borderRadius: '0 4px 4px 0', // Keep the rounded corner effect if desired
    // Add border-top, border-bottom, border-right if needed for visual separation, e.g., border: '1px solid #eee', borderLeftWidth: '4px'
  };
  const h3Style: React.CSSProperties = {
    color: headerTextColor,
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: '18px',
    margin: 0,
    padding: 0,
    fontWeight: 600,
    backgroundColor: 'transparent' // Ensure h3 background is transparent
  };

  return (
    <div style={headerDivStyle}>
      <h3 style={h3Style}>{title}</h3>
    </div>
  );
};

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, theme, tierContactLimit }) => {
  const textColor = theme.textColor || '#333';
  // Ensure white background for table elements
  const headerBgColor = '#FFFFFF'; // Force white header
  const rowBgColor1 = '#FFFFFF'; // Force white rows
  const rowBgColor2 = '#FFFFFF'; // Force white alternating rows (effectively removing alternation)
  const placeholderBgColor = '#FFFFFF'; // Force white placeholder rows
  const tableBgColor = '#FFFFFF'; // Force white table background

  const tableStyle: React.CSSProperties = { borderCollapse: 'collapse', backgroundColor: tableBgColor, margin: '15px 0', width: '100%' }; // Ensure width 100%
  const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontFamily: "'Segoe UI', Arial, sans-serif", color: textColor, backgroundColor: headerBgColor, fontWeight: 600 }; // White BG, added font weight
  const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', fontFamily: "'Segoe UI', Arial, sans-serif", color: textColor, backgroundColor: 'transparent', height: '24px' }; // Transparent cell BG, added fixed height
  const thNumStyle: React.CSSProperties = { ...thStyle, width: '30px', textAlign: 'center' }; // Style for the # column
  const tdNumStyle: React.CSSProperties = { ...tdStyle, width: '30px', textAlign: 'center' }; // Style for the # column

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableStyle}>
      <thead>
        <tr style={{ backgroundColor: headerBgColor }}>
          <th style={thNumStyle}>#</th>
          <th style={thStyle}>First Name</th>
          <th style={thStyle}>Last Name</th>
          <th style={thStyle}>Office Phone</th>
          <th style={thStyle}>Mobile Phone</th>
          <th style={thStyle}>Email Address</th>
          <th style={thStyle}>Job Title</th>
        </tr>
      </thead>
      <tbody>
        {/* Render actual contacts if provided (assuming simple structure for now) */}
        {contacts.map((contact, index) => {
          const bgColor = rowBgColor1; // Use consistent white background
          return (
            <tr key={`contact-${index}`} style={{ backgroundColor: bgColor }}>
              <td style={tdNumStyle}>{index + 1}</td>
              <td style={tdStyle}>{contact.firstName || ''}</td>
              <td style={tdStyle}>{contact.lastName || ''}</td>
              <td style={tdStyle}>{contact.officePhone || ''}</td>
              <td style={tdStyle}>{contact.mobilePhone || ''}</td>
              <td style={tdStyle}>{contact.email || ''}</td>
              <td style={tdStyle}>{contact.jobTitle || ''}</td>
            </tr>
          );
        })}
        {/* Add placeholder rows - Ensure white background */}
        {Array.from({ length: Math.max(0, tierContactLimit - contacts.length) }).map((_, index) => {
          const actualIndex = contacts.length + index; // Calculate index considering existing contacts
          const bgColor = rowBgColor1; // Use consistent white background
          const placeholderCellStyle: React.CSSProperties = { ...tdStyle, backgroundColor: 'transparent', color: '#aaa' }; // Transparent cell BG, grey text
          return (
            <tr key={`placeholder-${index}`} style={{ backgroundColor: bgColor }}>
              <td style={{ ...tdNumStyle, color: '#aaa' }}>{actualIndex + 1}</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
              <td style={placeholderCellStyle}>&nbsp;</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const ScriptBlock: React.FC<ScriptBlockProps> = ({ scriptContent, theme }) => {
  const cleanedScript = scriptContent.trim()
    .replace(/\t/g, '    ')
    .replace(/^\s*\n/gm, '');

  const scriptBgColor = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f5f5f5';
  const scriptTextColor = theme.textColor || '#333';
  const borderColor = '#ddd';

  const preStyle: React.CSSProperties = {
    backgroundColor: scriptBgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '4px',
    padding: '15px',
    fontFamily: "Consolas, Monaco, 'Courier New', monospace",
    fontSize: '13px',
    lineHeight: 1.45,
    color: scriptTextColor,
    whiteSpace: 'pre', // Use 'pre' to preserve all whitespace
    wordWrap: 'normal', // Prevent wrapping
    overflowX: 'auto', // Add scrollbars if content overflows
    margin: '15px 0',
  };

  // No need for escapeHtml, JSX handles it.
  return (
    <pre style={preStyle}>{cleanedScript}</pre>
  );
};

export const InstructionBox: React.FC<InstructionBoxProps> = ({ title, content, theme }) => {
  // Use theme colors or fallbacks
  const boxBgColor = theme.primaryColor ? `${theme.primaryColor}1A` : '#f0f7ff'; // Light blue/primary tint
  const boxTextColor = theme.textColor || '#333';
  const primaryColor = theme.primaryColor || '#0078D4'; // For title color
  const borderColor = theme.primaryColor ? `${theme.primaryColor}33` : '#b3d7ff'; // Lighter border

  // Styles for the div-based instruction box
  const boxDivStyle: React.CSSProperties = {
    margin: '20px 0',
    padding: '16px',
    backgroundColor: boxBgColor, // Apply background color
    border: `1px solid ${borderColor}`, // Apply border
    borderRadius: '4px',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: '14px',
    lineHeight: 1.5,
    color: boxTextColor,
  };
  const titleStyle: React.CSSProperties = {
    fontWeight: 'bold',
    color: primaryColor, // Use primary color for title
    marginBottom: '8px',
    fontSize: '15px',
    backgroundColor: 'transparent', // Ensure transparent background
  };
  const contentStyle: React.CSSProperties = {
    color: boxTextColor,
    backgroundColor: 'transparent', // Ensure transparent background
  };

  // Use dangerouslySetInnerHTML if content is expected to be HTML, otherwise just render content
  const contentElement = typeof content === 'string' && content.includes('<')
    ? <div style={contentStyle} dangerouslySetInnerHTML={{ __html: content }} />
    : <div style={contentStyle}>{content}</div>;

  return (
    <div style={boxDivStyle}>
      <div style={titleStyle}>{title}</div>
      {contentElement}
    </div>
  );
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ number, title, theme }) => {
  const primaryColor = theme.primaryColor || '#0078D4';
  const stepTextColor = theme.textColor || '#333';
  const mainBgColor = '#FFFFFF'; // Force white background

  // Styles for the div-based step indicator using Flexbox
  const containerStyle: React.CSSProperties = {
    display: 'flex', // Use Flexbox
    alignItems: 'center', // Align items vertically center
    margin: '25px 0 15px 0',
    backgroundColor: mainBgColor, // Ensure white background
  };
  const numberCircleStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    backgroundColor: primaryColor,
    borderRadius: '50%',
    display: 'flex', // Use Flexbox for centering number inside circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12px', // Space between circle and title
    flexShrink: 0, // Prevent circle from shrinking
  };
  const numberTextStyle: React.CSSProperties = {
    color: 'white',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: '18px',
    fontWeight: 'bold',
    lineHeight: 1, // Adjust line height for better centering
  };
  const titleStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: stepTextColor,
    backgroundColor: 'transparent', // Ensure transparent background
  };

  return (
    <div style={containerStyle}>
      <div style={numberCircleStyle}>
        <span style={numberTextStyle}>{number}</span>
      </div>
      <div style={titleStyle}>{title}</div>
    </div>
  );
};
