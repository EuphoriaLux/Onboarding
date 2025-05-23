import React from 'react';
import { AuthorizedContact } from '../../types/index'; // Updated import path
import { EnvelopeIcon, PhoneIcon, UserCircleIcon, ChatBubbleLeftRightIcon } from '../common/icons'; // Updated import path

interface AuthorizedContactListItemProps {
  contact: AuthorizedContact;
}

const AuthorizedContactListItem: React.FC<AuthorizedContactListItemProps> = ({ contact }) => {
  return (
    <li className="p-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-150">
      <div className="flex items-center space-x-3 mb-1.5">
        <UserCircleIcon className="w-6 h-6 text-[var(--primary-color-light)] dark:text-[var(--primary-color-dark)] flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-medium text-[var(--text-color-light)] dark:text-[var(--text-color-dark)] truncate" title={contact.fullName}>{contact.fullName}</p>
          {(contact.firstName || contact.lastName) && (
            <p className="text-xs text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80 truncate">
              {contact.firstName} {contact.lastName}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-1 pl-9 text-xs">
        {contact.jobTitle && (
          <div className="flex items-center space-x-1.5 text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
            {/* No specific icon for job title, could use a generic one if desired */}
            <span className="w-3.5 h-3.5 flex-shrink-0"></span> {/* Placeholder for alignment */}
            <p className="truncate" title={contact.jobTitle}>{contact.jobTitle}</p>
          </div>
        )}
        <div className="flex items-center space-x-1.5 text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
          <EnvelopeIcon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60" />
          <a href={`mailto:${contact.email}`} className="truncate hover:text-[var(--primary-color-light)] dark:hover:text-[var(--primary-color-dark)]" title={contact.email}>
            {contact.email}
          </a>
        </div>
        {contact.businessPhone && (
          <div className="flex items-center space-x-1.5 text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
            <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60" />
            <a href={`tel:${contact.businessPhone}`} className="truncate hover:text-[var(--primary-color-light)] dark:hover:text-[var(--primary-color-dark)]" title={`Business: ${contact.businessPhone}`}>
              Business: {contact.businessPhone}
            </a>
          </div>
        )}
        {contact.mobileNumber && (
          <div className="flex items-center space-x-1.5 text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
            <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60" />
            <a href={`tel:${contact.mobileNumber}`} className="truncate hover:text-[var(--primary-color-light)] dark:hover:text-[var(--primary-color-dark)]" title={`Mobile: ${contact.mobileNumber}`}>
              Mobile: {contact.mobileNumber}
            </a>
          </div>
        )}
        {contact.teamsAddress && (
          <div className="flex items-center space-x-1.5 text-[var(--text-color-light)] opacity-80 dark:text-[var(--text-color-dark)] opacity-80">
            <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 flex-shrink-0 text-[var(--text-color-light)] opacity-60 dark:text-[var(--text-color-dark)] opacity-60" />
            <p className="truncate" title={`Teams: ${contact.teamsAddress}`}>
              Teams: {contact.teamsAddress}
            </p>
          </div>
        )}
      </div>
    </li>
  );
};

export default AuthorizedContactListItem;
