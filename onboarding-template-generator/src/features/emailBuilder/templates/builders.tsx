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

interface ContactsTableProps {
  contacts: Array<{ name: string; email: string; phone: string }>;
  theme: ThemeSettings;
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
  const headerBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f8f8f8';
  const headerTextColor = theme.textColor || '#333333';
  const mainBgColor = theme.backgroundColor || '#FFFFFF';

  const tableStyle: React.CSSProperties = { borderCollapse: 'collapse', margin: '35px 0 20px 0' };
  const tdOuterStyle: React.CSSProperties = { padding: 0, backgroundColor: mainBgColor };
  const tableInnerStyle: React.CSSProperties = { borderCollapse: 'collapse', backgroundColor: headerBgColor, borderLeft: `4px solid ${color}`, borderRadius: '0 4px 4px 0' };
  const tdInnerStyle: React.CSSProperties = { padding: '16px' };
  const h3Style: React.CSSProperties = { color: headerTextColor, fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '18px', margin: 0, padding: 0, fontWeight: 600, backgroundColor: headerBgColor };

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableStyle}>
      <tbody>
        <tr>
          <td style={tdOuterStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableInnerStyle}>
              <tbody>
                <tr>
                  <td style={tdInnerStyle}>
                    <h3 style={h3Style}>{title}</h3>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, theme }) => {
  const textColor = theme.textColor || '#333';
  const headerBgColor = theme.backgroundColor ? `${theme.backgroundColor}1A` : '#f0f0f0';
  const rowBgColor1 = theme.backgroundColor || '#FFFFFF';
  const rowBgColor2 = theme.backgroundColor ? `${theme.backgroundColor}0D` : '#f9f9f9';
  // Remove MSO specific styles from style object
  const tableStyle: React.CSSProperties = { borderCollapse: 'collapse', backgroundColor: theme.backgroundColor || '#FFFFFF', margin: '15px 0' };
  const thStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', textAlign: 'left', fontFamily: "'Segoe UI', Arial, sans-serif", color: textColor };
  const tdStyle: React.CSSProperties = { border: '1px solid #ddd', padding: '8px', fontFamily: "'Segoe UI', Arial, sans-serif", color: textColor };

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableStyle}>
      <thead>
        <tr style={{ backgroundColor: headerBgColor }}>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Phone</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((contact, index) => {
          const bgColor = index % 2 === 0 ? rowBgColor2 : rowBgColor1;
          return (
            <tr key={index} style={{ backgroundColor: bgColor }}>
              <td style={tdStyle}>{contact.name || ''}</td>
              <td style={tdStyle}>{contact.email || ''}</td>
              <td style={tdStyle}>{contact.phone || ''}</td>
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
  const boxBgColor = theme.primaryColor ? `${theme.primaryColor}1A` : '#f0f7ff';
  const boxTextColor = theme.textColor || '#333';
  const primaryColor = theme.primaryColor || '#0078D4';
  const mainBgColor = theme.backgroundColor || '#FFFFFF';

  const tableOuterStyle: React.CSSProperties = { borderCollapse: 'collapse', margin: '20px 0', backgroundColor: mainBgColor };
  const tdOuterStyle: React.CSSProperties = { padding: 0, backgroundColor: mainBgColor };
  const tableInnerStyle: React.CSSProperties = { borderCollapse: 'collapse', backgroundColor: boxBgColor, border: `1px solid ${primaryColor}33`, borderRadius: '4px' };
  const tdInnerStyle: React.CSSProperties = { padding: '16px', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '14px', lineHeight: 1.5, color: boxTextColor, backgroundColor: boxBgColor };
  const titleDivStyle: React.CSSProperties = { fontWeight: 'bold', color: primaryColor, marginBottom: '8px', fontSize: '15px', backgroundColor: boxBgColor };
  const contentDivStyle: React.CSSProperties = { color: boxTextColor, backgroundColor: boxBgColor };

  // Use dangerouslySetInnerHTML if content is expected to be HTML, otherwise just render content
  const contentElement = typeof content === 'string' && content.includes('<')
    ? <div style={contentDivStyle} dangerouslySetInnerHTML={{ __html: content }} />
    : <div style={contentDivStyle}>{content}</div>;


  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableOuterStyle}>
      <tbody>
        <tr>
          <td style={tdOuterStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableInnerStyle}>
              <tbody>
                <tr>
                  <td style={tdInnerStyle}>
                    <div style={titleDivStyle}>{title}</div>
                    {contentElement}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const StepIndicator: React.FC<StepIndicatorProps> = ({ number, title, theme }) => {
  const primaryColor = theme.primaryColor || '#0078D4';
  const stepTextColor = theme.textColor || '#333';
  const mainBgColor = theme.backgroundColor || '#FFFFFF';

  const tableOuterStyle: React.CSSProperties = { borderCollapse: 'collapse', margin: '25px 0 15px 0', backgroundColor: mainBgColor };
  const tdOuterStyle: React.CSSProperties = { padding: 0, verticalAlign: 'middle', backgroundColor: mainBgColor };
  const tableInnerStyle: React.CSSProperties = { borderCollapse: 'collapse', backgroundColor: mainBgColor };
  const tdNumberStyle: React.CSSProperties = { width: '36px', height: '36px', backgroundColor: primaryColor, borderRadius: '50%', textAlign: 'center', verticalAlign: 'middle' };
  const spanNumberStyle: React.CSSProperties = { color: 'white', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '18px', fontWeight: 'bold', backgroundColor: primaryColor };
  const tdTitleStyle: React.CSSProperties = { paddingLeft: '12px', backgroundColor: mainBgColor };
  const spanTitleStyle: React.CSSProperties = { fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '16px', fontWeight: 600, color: stepTextColor, backgroundColor: mainBgColor };

  return (
    <table width="100%" cellPadding="0" cellSpacing="0" border={0} style={tableOuterStyle}>
      <tbody>
        <tr>
          <td style={tdOuterStyle}>
            <table cellPadding="0" cellSpacing="0" border={0} style={tableInnerStyle}>
              <tbody>
                <tr>
                  <td style={tdNumberStyle}>
                    <span style={spanNumberStyle}>{number}</span>
                  </td>
                  <td style={tdTitleStyle}>
                    <span style={spanTitleStyle}>{title}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
